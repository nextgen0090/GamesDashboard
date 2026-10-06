import type { Game } from '../types/game'

/**
 * Replace each `url` with your Cloudflare Worker game URL.
 * Images live in `/public/games/` — swap files or paths as needed.
 */
export const games: Game[] = [
    {
        id: 'wonder-voyage',
        name: 'Wonder Voyage',
        tagline: 'Test your memory',
        url: 'https://shaffan-nextgen.github.io/WonderVoyage-Build/',
        image: '/games/wonder-voyage.png',
        gradientFrom: '#ff006e',
        gradientTo: '#8338ec',
        glow: '#ff006e',
        category: 'Puzzle',
        featured: true,
    },
    {
        id: 'city-cargo',
        name: 'City Cargo',
        tagline: 'Balance the cargo',
        url: 'https://shaffan-nextgen.github.io/CargoLiftPuzzle2D-Build/',
        image: '/games/city-cargo.png',
        gradientFrom: '#ff006e',
        gradientTo: '#8338ec',
        glow: '#ff006e',
        category: 'Puzzle',
    },
    {
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
    },
    {
        id: 'color-snake',
        name: 'Color Snake',
        tagline: 'Classic snake with a twist',
        url: 'https://shaffan-nextgen.github.io/ColorSnake-Build/',
        image: '/games/color-snake.png',
        gradientFrom: '#ff006e',
        gradientTo: '#8338ec',
        glow: '#ff006e',
        category: 'Arcade',
    },
    {
        id: 'neon-slots',
        name: 'Neon Slots',
        tagline: 'Spin the reels under city lights',
        url: 'https://neon-slots-game.workers.dev',
        image: '/games/neon-slots.svg',
        gradientFrom: '#ff006e',
        gradientTo: '#8338ec',
        glow: '#ff006e',
        category: 'Slots',
        popular: true,
    },
    {
        id: 'golden-fortune',
        name: 'Golden Fortune',
        tagline: 'Chase the jackpot glow',
        url: 'https://golden-fortune-game.workers.dev',
        image: '/games/golden-fortune.svg',
        gradientFrom: '#f59e0b',
        gradientTo: '#ef4444',
        glow: '#fbbf24',
        category: 'Jackpot',
        popular: true,
    },
    {
        id: 'crystal-match',
        name: 'Crystal Match',
        tagline: 'Match gems, unlock cascades',
        url: 'https://crystal-match-game.workers.dev',
        image: '/games/crystal-match.svg',
        gradientFrom: '#06b6d4',
        gradientTo: '#3b82f6',
        glow: '#22d3ee',
        category: 'Puzzle',
    },
    {
        id: 'roulette-neon',
        name: 'Neon Roulette',
        tagline: 'Where the wheel never sleeps',
        url: 'https://neon-roulette-game.workers.dev',
        image: '/games/roulette-neon.svg',
        gradientFrom: '#10b981',
        gradientTo: '#059669',
        glow: '#34d399',
        category: 'Table',
    },
    {
        id: 'dice-rush',
        name: 'Dice Rush',
        tagline: 'Roll fast, win faster',
        url: 'https://dice-rush-game.workers.dev',
        image: '/games/dice-rush.svg',
        gradientFrom: '#a855f7',
        gradientTo: '#ec4899',
        glow: '#e879f9',
        category: 'Arcade',
        isNew: true,
    },
    {
        id: 'poker-star',
        name: 'Poker Star',
        tagline: 'All-in under the spotlight',
        url: 'https://poker-star-game.workers.dev',
        image: '/games/poker-star.svg',
        gradientFrom: '#6366f1',
        gradientTo: '#8b5cf6',
        glow: '#818cf8',
        category: 'Cards',
        popular: true,
    },
    {
        id: 'wheel-blaze',
        name: 'Wheel Blaze',
        tagline: 'Fire up the prize wheel',
        url: 'https://wheel-blaze-game.workers.dev',
        image: '/games/wheel-blaze.svg',
        gradientFrom: '#f97316',
        gradientTo: '#dc2626',
        glow: '#fb923c',
        category: 'Wheel',
        isNew: true,
    },
    {
        id: 'blackjack-pro',
        name: 'Blackjack Pro',
        tagline: 'Beat the dealer in style',
        url: 'https://blackjack-pro-game.workers.dev',
        image: '/games/blackjack-pro.svg',
        gradientFrom: '#14b8a6',
        gradientTo: '#0ea5e9',
        glow: '#2dd4bf',
        category: 'Cards',
        isNew: true,
    },
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