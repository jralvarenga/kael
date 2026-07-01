import type { KaelFieldConfig, KaelRowData } from '@kael/database/types'
import {
  boolean,
  check,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm/sql'

const auditTables = {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}

export const fieldType = pgEnum('field_type', [
  'text',
  'number',
  'boolean',
  'timestamp',
  'relation',
])

export const kaelTable = pgTable(
  'kael_table',
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    slug: text().notNull(),

    ...auditTables,
  },
  (table) => [unique('kael_table_slug_unique').on(table.slug)],
)

export const kaelField = pgTable(
  'kael_field',
  {
    id: uuid().primaryKey().defaultRandom(),
    kaelTableId: uuid('kael_table_id')
      .notNull()
      .references(() => kaelTable.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    slug: text().notNull(),
    type: fieldType().notNull(),
    config: jsonb().$type<KaelFieldConfig>().notNull().default({}),
    position: integer().notNull().default(0),
    required: boolean().notNull().default(false),
    relationTableId: uuid('relation_table_id').references(() => kaelTable.id, {
      onDelete: 'cascade',
    }),

    ...auditTables,
  },
  (table) => [
    unique('kael_field_table_slug_unique').on(table.kaelTableId, table.slug),
    unique('kael_field_table_position_unique').on(
      table.kaelTableId,
      table.position,
    ),
    unique('kael_field_id_table_id_unique').on(table.id, table.kaelTableId),
    unique('kael_field_id_relation_table_id_unique').on(
      table.id,
      table.relationTableId,
    ),
    check('kael_field_position_non_negative', sql`${table.position} >= 0`),
    check(
      'kael_field_relation_table_id_consistency',
      sql`(${table.type} = 'relation' AND ${table.relationTableId} IS NOT NULL) OR (${table.type} <> 'relation' AND ${table.relationTableId} IS NULL)`,
    ),
  ],
)

export const kaelRow = pgTable(
  'kael_row',
  {
    id: uuid().primaryKey().defaultRandom(),
    kaelTableId: uuid('kael_table_id')
      .notNull()
      .references(() => kaelTable.id, { onDelete: 'cascade' }),
    data: jsonb().$type<KaelRowData>().notNull().default({}),

    ...auditTables,
  },
  (table) => [
    unique('kael_row_id_table_id_unique').on(table.id, table.kaelTableId),
  ],
)
