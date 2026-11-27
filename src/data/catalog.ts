/**
 * The store catalog. Fictional games with generated artwork (see
 * `src/app/media`), so the project needs no third-party assets.
 *
 * This is the single source of truth: `npm run db:seed` copies it into
 * SQLite, and the static store serves it directly when no database is
 * configured.
 */

export const CATEGORIES = [
  'Action',
  'Adventure',
  'Indie',
  'Platformer',
  'Puzzle',
  'Racing',
  'RPG',
  'Shooter',
  'Simulation',
  'Strategy',
] as const

export const PLATFORMS = ['Windows', 'macOS', 'Linux'] as const

export type CategoryName = (typeof CATEGORIES)[number]
export type PlatformName = (typeof PLATFORMS)[number]

export interface CatalogGame {
  slug: string
  title: string
  developer: string
  description: string
  /** Price in cents; 0 means free to claim. */
  priceCents: number
  releasedAt: string
  categories: CategoryName[]
  platforms: PlatformName[]
  featured?: boolean
  /** Two colours for the generated artwork. */
  palette: [string, string]
  screenshots: number
}

export const catalog: CatalogGame[] = [
  {
    slug: 'ember-protocol',
    title: 'Ember Protocol',
    developer: 'Northlight Forge',
    description:
      'A tactical shooter set in a city that burns for a week every year. Plan routes through collapsing districts, recruit a squad of misfits and get out before the firestorm reaches the core.',
    priceCents: 3999,
    releasedAt: '2026-03-12',
    categories: ['Action', 'Shooter'],
    platforms: ['Windows'],
    featured: true,
    palette: ['#ff6a3d', '#3b0a45'],
    screenshots: 4,
  },
  {
    slug: 'tidebound',
    title: 'Tidebound',
    developer: 'Saltglass',
    description:
      'Sail a living archipelago that rearranges itself with the tides. Chart islands, trade with drifting markets and uncover why the sea keeps moving.',
    priceCents: 2499,
    releasedAt: '2025-11-04',
    categories: ['Adventure', 'Indie'],
    platforms: ['Windows', 'macOS'],
    featured: true,
    palette: ['#22d3ee', '#0c2340'],
    screenshots: 3,
  },
  {
    slug: 'circuit-saints',
    title: 'Circuit Saints',
    developer: 'Overclock Studio',
    description:
      'Arcade racing on neon tracks that rewire mid-lap. Draft through traffic, tune a chassis made of salvaged parts and climb the underground league.',
    priceCents: 2999,
    releasedAt: '2026-01-28',
    categories: ['Racing', 'Action'],
    platforms: ['Windows', 'Linux'],
    featured: true,
    palette: ['#f472b6', '#1e1b4b'],
    screenshots: 4,
  },
  {
    slug: 'the-quiet-archive',
    title: 'The Quiet Archive',
    developer: 'Paperlamp',
    description:
      'A narrative puzzle game about restoring a library that forgets its books. Rebuild stories from fragments and decide which ones are worth remembering.',
    priceCents: 1499,
    releasedAt: '2025-06-19',
    categories: ['Puzzle', 'Indie', 'Adventure'],
    platforms: ['Windows', 'macOS', 'Linux'],
    featured: true,
    palette: ['#fbbf24', '#3f2a14'],
    screenshots: 3,
  },
  {
    slug: 'starfall-dominion',
    title: 'Starfall Dominion',
    developer: 'Meridian Games',
    description:
      'A grand strategy game across a dying galaxy. Negotiate, betray and terraform your way to the last habitable stars before they go dark.',
    priceCents: 4999,
    releasedAt: '2026-05-07',
    categories: ['Strategy', 'Simulation'],
    platforms: ['Windows', 'macOS'],
    palette: ['#818cf8', '#0b1026'],
    screenshots: 4,
  },
  {
    slug: 'mossheart',
    title: 'Mossheart',
    developer: 'Little Grove',
    description:
      'A cosy platformer about a creature made of moss looking for rain. Grow bridges, ride seed pods and bring colour back to a dry forest.',
    priceCents: 1999,
    releasedAt: '2025-09-02',
    categories: ['Platformer', 'Indie'],
    platforms: ['Windows', 'macOS', 'Linux'],
    palette: ['#86efac', '#14361f'],
    screenshots: 3,
  },
  {
    slug: 'iron-litany',
    title: 'Iron Litany',
    developer: 'Grimward',
    description:
      'An open-world RPG in a kingdom of clockwork saints. Forge your own relics, choose a faith and shape a war that has lasted a thousand winters.',
    priceCents: 5999,
    releasedAt: '2026-02-14',
    categories: ['RPG', 'Action', 'Adventure'],
    platforms: ['Windows'],
    palette: ['#cbd5e1', '#1f2937'],
    screenshots: 4,
  },
  {
    slug: 'pocket-orbit',
    title: 'Pocket Orbit',
    developer: 'Tiny Telescope',
    description:
      'A physics puzzler about slinging satellites into tiny solar systems. Hundreds of hand-made levels and a level editor for the rest.',
    priceCents: 0,
    releasedAt: '2025-04-23',
    categories: ['Puzzle', 'Indie'],
    platforms: ['Windows', 'macOS', 'Linux'],
    palette: ['#a78bfa', '#120d2b'],
    screenshots: 3,
  },
  {
    slug: 'harvest-of-hollow-vale',
    title: 'Harvest of Hollow Vale',
    developer: 'Fieldnote',
    description:
      'Run a farm in a valley where crops grow overnight and so do secrets. Befriend the village, restore the old mill and find out what lives under the fields.',
    priceCents: 1999,
    releasedAt: '2025-08-15',
    categories: ['Simulation', 'Indie', 'RPG'],
    platforms: ['Windows', 'macOS'],
    palette: ['#facc15', '#1c3a2a'],
    screenshots: 3,
  },
  {
    slug: 'blacksite-zero',
    title: 'Blacksite Zero',
    developer: 'Coldframe',
    description:
      'A stealth shooter inside an abandoned research station. Every room remembers what happened in it, and so do the things still walking the halls.',
    priceCents: 3499,
    releasedAt: '2025-10-30',
    categories: ['Shooter', 'Action'],
    platforms: ['Windows'],
    palette: ['#4ade80', '#020617'],
    screenshots: 4,
  },
  {
    slug: 'skyward-couriers',
    title: 'Skyward Couriers',
    developer: 'Airmail Collective',
    description:
      'Deliver parcels between floating cities on a glider. Ride thermals, dodge storms and race rival couriers in this breezy co-op adventure.',
    priceCents: 2499,
    releasedAt: '2026-04-09',
    categories: ['Adventure', 'Action'],
    platforms: ['Windows', 'macOS', 'Linux'],
    palette: ['#7dd3fc', '#1e3a8a'],
    screenshots: 3,
  },
  {
    slug: 'kingdoms-of-salt',
    title: 'Kingdoms of Salt',
    developer: 'Meridian Games',
    description:
      'A turn-based strategy game about trade empires on a dried-up sea. Build caravans, control the wells and outlast your rivals.',
    priceCents: 2999,
    releasedAt: '2025-07-01',
    categories: ['Strategy'],
    platforms: ['Windows', 'macOS'],
    palette: ['#fdba74', '#431407'],
    screenshots: 3,
  },
  {
    slug: 'neon-drift-free',
    title: 'Neon Drift: Free Lap',
    developer: 'Overclock Studio',
    description:
      'A free standalone time-trial set in the Circuit Saints universe. Chase ghosts, climb the leaderboard and keep your car forever.',
    priceCents: 0,
    releasedAt: '2026-01-28',
    categories: ['Racing'],
    platforms: ['Windows', 'Linux'],
    palette: ['#e879f9', '#2e1065'],
    screenshots: 2,
  },
  {
    slug: 'lanternwake',
    title: 'Lanternwake',
    developer: 'Paperlamp',
    description:
      'A dungeon-crawling RPG where your lantern is your health bar. Light the way for a caravan of lost souls through caverns that shift when the light goes out.',
    priceCents: 2299,
    releasedAt: '2026-06-18',
    categories: ['RPG', 'Indie'],
    platforms: ['Windows', 'macOS', 'Linux'],
    palette: ['#fde68a', '#1c1917'],
    screenshots: 3,
  },
  {
    slug: 'gridlock-tycoon',
    title: 'Gridlock Tycoon',
    developer: 'Civic Bits',
    description:
      'Design the transit system of a city that never stops growing. Lay tracks, schedule trains and keep millions of commuters (mostly) happy.',
    priceCents: 2799,
    releasedAt: '2025-12-03',
    categories: ['Simulation', 'Strategy'],
    platforms: ['Windows', 'macOS', 'Linux'],
    palette: ['#5eead4', '#042f2e'],
    screenshots: 3,
  },
  {
    slug: 'hollow-sprint',
    title: 'Hollow Sprint',
    developer: 'Little Grove',
    description:
      'A precision platformer about a ghost who can only move forward. Tight controls, a hand-drawn underworld and a soundtrack that speeds up with you.',
    priceCents: 999,
    releasedAt: '2025-05-20',
    categories: ['Platformer', 'Action'],
    platforms: ['Windows', 'macOS'],
    palette: ['#c4b5fd', '#18181b'],
    screenshots: 3,
  },
]
