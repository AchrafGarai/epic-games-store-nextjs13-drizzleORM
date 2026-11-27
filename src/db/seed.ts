import { createDb } from './client'
import { seedCatalog } from './seed-data'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('Set DATABASE_URL (for example file:local.db) before seeding.')
  process.exit(1)
}

const count = await seedCatalog(createDb(url, process.env.DATABASE_AUTH_TOKEN))
console.log(`Seeded ${count} games.`)
