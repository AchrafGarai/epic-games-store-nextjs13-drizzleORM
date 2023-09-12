import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as userSchema from './user/schema'
import * as gameSchema from './game/schema'
import * as platfomsSchema from './platforms/schema'

neonConfig.fetchConnectionCache = true

const schema = { ...userSchema, ...gameSchema, ...platfomsSchema }
const sql = neon(process.env.DRIZZLE_DATABASE_URL!)
const db = drizzle(sql, { schema })

export { db }
// const result = await db.select().from(...);
