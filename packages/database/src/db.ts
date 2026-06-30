import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to create the database client.')
}

export const db = drizzle(databaseUrl)

export type Database = typeof db
