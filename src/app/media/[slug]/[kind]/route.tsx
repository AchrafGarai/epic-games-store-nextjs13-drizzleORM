import { ImageResponse } from 'next/og'
import { catalog, type CatalogGame } from '@/data/catalog'

/**
 * Generated key art for the fictional catalog, prerendered at build time:
 *   /media/<slug>/cover    600×800 portrait cover
 *   /media/<slug>/banner   1600×900 hero banner (no text: the page overlays it)
 *   /media/<slug>/shot-N   1280×720 screenshots
 */

const SIZES = {
  cover: { width: 600, height: 800 },
  banner: { width: 1600, height: 900 },
  shot: { width: 1280, height: 720 },
} as const

function kindsFor(game: CatalogGame) {
  return ['cover', 'banner', ...Array.from({ length: game.screenshots }, (_, i) => `shot-${i + 1}`)]
}

export function generateStaticParams() {
  return catalog.flatMap((game) => kindsFor(game).map((kind) => ({ slug: game.slug, kind })))
}

/** Small deterministic PRNG so every game gets its own, stable composition. */
function random(seed: string) {
  let h = 2166136261
  for (const char of seed) h = Math.imul(h ^ char.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

function Shapes({ game, seed, width, height }: { game: CatalogGame; seed: string; width: number; height: number }) {
  const rand = random(seed)
  const [light, dark] = game.palette
  return (
    <>
      {Array.from({ length: 7 }, (_, i) => {
        const size = (0.25 + rand() * 0.6) * Math.max(width, height)
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: rand() * width - size / 2,
              top: rand() * height - size / 2,
              width: size,
              height: size,
              borderRadius: rand() > 0.35 ? '50%' : size * 0.12,
              transform: `rotate(${Math.round(rand() * 90)}deg)`,
              background: `radial-gradient(circle at 30% 30%, ${light}, ${dark})`,
              opacity: 0.25 + rand() * 0.45,
            }}
          />
        )
      })}
    </>
  )
}

export async function GET(_request: Request, { params }: RouteContext<'/media/[slug]/[kind]'>) {
  const { slug, kind } = await params
  const game = catalog.find((candidate) => candidate.slug === slug)
  if (!game || !kindsFor(game).includes(kind)) return new Response('Not found', { status: 404 })

  const variant = kind.startsWith('shot') ? 'shot' : (kind as 'cover' | 'banner')
  const { width, height } = SIZES[variant]
  const [light, dark] = game.palette

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(160deg, ${dark} 10%, #050505 90%)`,
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <Shapes game={game} seed={`${slug}:${kind}`} width={width} height={height} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 55%)',
          }}
        />
        {variant === 'cover' && (
          <div
            style={{
              position: 'absolute',
              left: 40,
              right: 40,
              bottom: 48,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: -2,
                textTransform: 'uppercase',
                textShadow: `0 4px 32px ${light}`,
              }}
            >
              {game.title}
            </div>
            <div style={{ fontSize: 24, color: light, letterSpacing: 4, textTransform: 'uppercase' }}>
              {game.developer}
            </div>
          </div>
        )}
      </div>
    ),
    { width, height },
  )
}
