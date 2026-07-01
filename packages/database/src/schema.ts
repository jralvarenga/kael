import type { KaelFieldConfig, KaelRowData } from '@kael/database/types'
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm/sql'

const auditTimestamps = {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}

export const kaelTable = pgTable(
  'kael_table',
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    slug: text().notNull(),

    ...auditTimestamps,
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
    type: text().notNull(),
    config: jsonb().$type<KaelFieldConfig>().notNull().default({}),
    position: integer().notNull().default(0),
    required: boolean().notNull().default(false),
    relationTableId: uuid('relation_table_id').references(() => kaelTable.id, {
      onDelete: 'cascade',
    }),

    ...auditTimestamps,
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
    index('kael_field_relation_table_id_idx').on(table.relationTableId),
    check('kael_field_position_non_negative', sql`${table.position} >= 0`),
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

    ...auditTimestamps,
  },
  (table) => [
    index('kael_row_kael_table_id_idx').on(table.kaelTableId),
    unique('kael_row_id_table_id_unique').on(table.id, table.kaelTableId),
  ],
)

export const kaelRecordLink = pgTable(
  'kael_record_link',
  {
    id: uuid().primaryKey().defaultRandom(),
    fieldId: uuid('field_id').notNull(),
    sourceKaelTableId: uuid('source_kael_table_id').notNull(),
    sourceRowId: uuid('source_row_id').notNull(),
    targetKaelTableId: uuid('target_kael_table_id').notNull(),
    targetRowId: uuid('target_row_id').notNull(),
    position: integer().notNull().default(0),

    ...auditTimestamps,
  },
  (table) => [
    foreignKey({
      name: 'kael_record_link_field_source_table_fk',
      columns: [table.fieldId, table.sourceKaelTableId],
      foreignColumns: [kaelField.id, kaelField.kaelTableId],
    }).onDelete('cascade'),
    foreignKey({
      name: 'kael_record_link_source_row_table_fk',
      columns: [table.sourceRowId, table.sourceKaelTableId],
      foreignColumns: [kaelRow.id, kaelRow.kaelTableId],
    }).onDelete('cascade'),
    foreignKey({
      name: 'kael_record_link_field_target_table_fk',
      columns: [table.fieldId, table.targetKaelTableId],
      foreignColumns: [kaelField.id, kaelField.relationTableId],
    }).onDelete('cascade'),
    foreignKey({
      name: 'kael_record_link_target_row_table_fk',
      columns: [table.targetRowId, table.targetKaelTableId],
      foreignColumns: [kaelRow.id, kaelRow.kaelTableId],
    }).onDelete('cascade'),
    index('kael_record_link_field_source_table_idx').on(
      table.fieldId,
      table.sourceKaelTableId,
    ),
    index('kael_record_link_source_row_table_idx').on(
      table.sourceRowId,
      table.sourceKaelTableId,
    ),
    index('kael_record_link_field_target_table_idx').on(
      table.fieldId,
      table.targetKaelTableId,
    ),
    index('kael_record_link_target_row_table_idx').on(
      table.targetRowId,
      table.targetKaelTableId,
    ),
    unique('kael_record_link_unique').on(
      table.fieldId,
      table.sourceRowId,
      table.targetRowId,
    ),
    unique('kael_record_link_position_unique').on(
      table.fieldId,
      table.sourceRowId,
      table.position,
    ),
    check(
      'kael_record_link_position_non_negative',
      sql`${table.position} >= 0`,
    ),
  ],
)
