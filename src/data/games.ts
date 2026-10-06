import type { Game } from '../types/game'
import { landscape, portrait } from './gameEntry'

/**
 * Replace each `url` with your Cloudflare Worker game URL.
 * Images live in `/public/games/` — swap files or paths as needed.
 *
 * Use `landscape({ ... })` or `portrait({ ... })` — canvas size comes from `gameEntry.ts` (`GAME_CANVAS`).
 */
export const games: Game[] = [
    landscape({
        id: 'wonder-voyage',
        name: 'Wonder Voyage',
        tagline: 'Test your memory',
        url: 'https://shaffan-nextgen.github.io/WonderVoyage-Build/',
        image: '/games/wonder-voyage.png',
        gradientFrom: '#ff006e',
        gradientTo: '#8338ec',
        glow: '#ff006e',
        category: 'Puzzle',
        popular: true,
    }),
    landscape({
        id: 'city-cargo',
        name: 'City Cargo',
        tagline: 'Balance the cargo',
        url: 'https://shaffan-nextgen.github.io/CargoLiftPuzzle2D-Build/',
        image: '/games/city-cargo.png',
        gradientFrom: '#ff006e',
        gradientTo: '#8338ec',
        glow: '#ff006e',
        category: 'Puzzle',
        popular: true,
    }),
    portrait({
        id: 'bounce-legends',
        name: 'Bounce Legends',
        tagline: 'Hoops!',
        url: 'https://shaffan-nextgen.github.io/BounceLegends-Build/',
        image: '/games/bounce-legends.png',
        gradientFrom: '#ff006e',
        gradientTo: '#8338ec',
        glow: '#ff006e',
        category: 'Arcade',
        popular: true,
    }),
    portrait({
        id: 'color-snake',
        name: 'Color Snake',
        tagline: 'Classic Snake game with a twist',
        url: 'https://shaffan-nextgen.github.io/ColorSnake-Build/',
        image: '/games/color-snake.png',
        gradientFrom: '#ff006e',
        gradientTo: '#8338ec',
        glow: '#ff006e',
        category: 'Slots',
        popular: true,
    }),
    portrait({
        id: 'bloom-heaven',
        name: 'Bloom Heaven',
        tagline: 'guuu',
        url: 'https://shaffan-nextgen.github.io/BloomHeaven-Build/',
        image: '/games/bloom-heaven.png',
        gradientFrom: '#ff006e',
        gradientTo: '#8338ec',
        glow: '#ff006e',
        category: 'Puzzle',
        popular: true,
    }),
    landscape({
        id: 'dunes',
        name: 'Dunes',
        tagline: 'Dunes',
        url: 'https://shaffan-nextgen.github.io/Dunes-Build/',
        image: '/games/dunes.png',
        gradientFrom: '#ff006e',
        gradientTo: '#8338ec',
        glow: '#ff006e',
        category: 'Arcade',
        popular: true,
    }),
    portrait({
        id: 'knife-strike',
        name: 'Knife Strike',
        tagline: 'Knife Strike',
        url: 'https://shaffan-nextgen.github.io/KnifeStrike-Build/',
        image: '/games/knife-strike.png',
        gradientFrom: '#ff006e',
        gradientTo: '#8338ec',
        glow: '#ff006e',
        category: 'Arcade',
        popular: true,
    }),
    portrait({
        id: 'robo-scape',
        name: 'Robo Scape',
        tagline: 'RoboScape',
        url: 'https://shaffan-nextgen.github.io/RoboScape-Build/',
        image: '/games/robo-scape.png',
        gradientFrom: '#ff006e',
        gradientTo: '#8338ec',
        glow: '#ff006e',
        category: 'Arcade',
        popular: true,
    }),
]

export const featuredGame = games.find((g) => g.featured) ?? games[0]

/** Hero slider — featured titles first, then popular/fallback without duplicating entries. */
export const featuredSliderGames: Game[] = (() => {
  const featured = games.filter((g) => g.featured)
  if (featured.length >= 2) return featured.slice(0, 6)
  const mix = [
    ...new Map(
      [...featured, ...games.filter((g) => g.popular)].map((g) => [g.id, g] as const),
    ).values(),
  ]
  if (mix.length >= 2) return mix.slice(0, 6)
  return games.slice(0, Math.min(5, games.length))
})()

/** Featured row (excludes the hero spotlight title) */
export const featuredTitles = games.filter(
  (g) => g.featured && g.id !== featuredGame.id,
)

export const popularGames = games.filter((g) => g.popular)

export const newGames = games.filter((g) => g.isNew)

const sortedCategories = Array.from(new Set(games.map((g) => g.category))).sort()

export const gameCategories = [
  'All',
  ...sortedCategories,
  'New',
  'Popular',
  'Favorites',
] as const

export function filterGamesByCategory(category: string, favoriteIds?: Set<string>): Game[] {
  if (category === 'All') return games
  if (category === 'New') return games.filter((g) => g.isNew)
  if (category === 'Popular') return games.filter((g) => g.popular)
  if (category === 'Favorites') {
    const fav = favoriteIds ?? new Set<string>()
    return games.filter((g) => fav.has(g.id))
  }
  return games.filter((g) => g.category === category)
}

export function searchGames(query: string, pool: Game[] = games): Game[] {
  const q = query.trim().toLowerCase()
  if (!q) return pool
  return pool.filter(
    (g) =>
      g.name.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.tagline.toLowerCase().includes(q),
  )
}

/** Recommended row — featured + popular, deduped, cap 4 */
export const recommendedGames = [
  ...new Map(
    [...games.filter((g) => g.featured), ...games.filter((g) => g.popular)].map((g) => [g.id, g]),
  ).values(),
]
  .filter((g) => g.id !== featuredGame.id)
  .slice(0, 4)
