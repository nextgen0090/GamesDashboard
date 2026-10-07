import type { Game } from '../types/game'
import { landscape, portrait } from './gameEntry'

/**
 * Replace each `url` with your Cloudflare Worker game URL.
 * Images live in `/public/games/` — swap files or paths as needed.
 *
 * Use `landscape({ ... })` or `portrait({ ... })` — canvas size comes from `gameEntry.ts` (`GAME_CANVAS`).
 * Dummy tiles reuse a live build URL so every card still launches a game.
 */
const SHARED_URLS = [
  'https://shaffan-nextgen.github.io/WonderVoyage-Build/',
  'https://shaffan-nextgen.github.io/CargoLiftPuzzle2D-Build/',
  'https://shaffan-nextgen.github.io/BounceLegends-Build/',
  'https://shaffan-nextgen.github.io/ColorSnake-Build/',
  'https://shaffan-nextgen.github.io/BloomHeaven-Build/',
  'https://shaffan-nextgen.github.io/Dunes-Build/',
  'https://shaffan-nextgen.github.io/KnifeStrike-Build/',
  'https://shaffan-nextgen.github.io/RoboScape-Build/',
] as const

const PALETTE: ReadonlyArray<readonly [string, string]> = [
  ['#1d4ed8', '#7c3aed'],
  ['#db2777', '#f43f5e'],
  ['#047857', '#22c55e'],
  ['#ea580c', '#facc15'],
  ['#6d28d9', '#ec4899'],
  ['#dc2626', '#f97316'],
  ['#0e7490', '#22d3ee'],
  ['#4d7c0f', '#84cc16'],
  ['#ea580c', '#ef4444'],
  ['#4338ca', '#38bdf8'],
  ['#be185d', '#fb7185'],
  ['#0f766e', '#2dd4bf'],
  ['#c2410c', '#f59e0b'],
  ['#1d4ed8', '#06b6d4'],
  ['#7e22ce', '#f472b6'],
  ['#e11d48', '#fb7185'],
]

type DummySpec = {
  id: string
  name: string
  category: string
  from?: string
  to?: string
  popular?: boolean
  isNew?: boolean
  portrait?: boolean
}

const dummySpecs: DummySpec[] = [
  { id: 'drift-circuit', name: 'Drift Circuit', category: 'Racing', popular: true, from: '#1d4ed8', to: '#38bdf8' },
  { id: 'skyline-dash', name: 'Skyline Dash', category: 'Arcade', popular: true, isNew: true, from: '#d97706', to: '#f59e0b' },
  { id: 'neon-hoops', name: 'Neon Hoops', category: 'Sports', popular: true, from: '#ea580c', to: '#fb923c' },
  { id: 'block-dash', name: 'Block Dash', category: 'Puzzle', popular: true, from: '#7c3aed', to: '#c4b5fd' },
  { id: 'shadow-arena', name: 'Shadow Arena', category: 'Action', popular: true, from: '#be123c', to: '#fb7185' },
  { id: 'salon-stars', name: 'Salon Stars', category: 'Dress Up', popular: true, isNew: true, from: '#be185d', to: '#ec4899' },
  { id: 'island-obby', name: 'Island Obby', category: 'Adventure', popular: true, from: '#047857', to: '#10b981' },
  { id: 'turbo-rally', name: 'Turbo Rally', category: 'Racing', popular: true, from: '#0369a1', to: '#7dd3fc' },
  { id: 'petal-pop', name: 'Petal Pop', category: 'Puzzle' },
  { id: 'metro-rush', name: 'Metro Rush', category: 'Arcade', isNew: true },
  { id: 'candy-stack', name: 'Candy Stack', category: 'Puzzle', portrait: true },
  { id: 'goal-kick', name: 'Goal Kick', category: 'Sports' },
  { id: 'pixel-pit', name: 'Pixel Pit', category: 'Arcade', portrait: true },
  { id: 'cozy-cafe', name: 'Cozy Cafe', category: 'Cooking', isNew: true },
  { id: 'dune-buggy', name: 'Dune Buggy', category: 'Racing' },
  { id: 'star-fisher', name: 'Star Fisher', category: 'Arcade', portrait: true },
  { id: 'ribbon-rush', name: 'Ribbon Rush', category: 'Skill' },
  { id: 'moon-miner', name: 'Moon Miner', category: 'Adventure' },
  { id: 'kitty-merge', name: 'Kitty Merge', category: 'Animal', isNew: true, portrait: true },
  { id: 'roof-runner', name: 'Roof Runner', category: 'Platform' },
  { id: 'aqua-io', name: 'Aqua.io', category: '.io', isNew: true },
  { id: 'blossom-makeup', name: 'Blossom Makeup', category: 'Dress Up', portrait: true },
  { id: 'cannon-duel', name: 'Cannon Duel', category: 'Shooting' },
  { id: 'waffle-stack', name: 'Waffle Stack', category: 'Cooking' },
  { id: 'night-owl', name: 'Night Owl', category: 'Horror', portrait: true },
  { id: 'skate-loop', name: 'Skate Loop', category: 'Sports' },
  { id: 'gem-slide', name: 'Gem Slide', category: 'Puzzle', portrait: true },
  { id: 'cloud-jump', name: 'Cloud Jump', category: 'Platform' },
  { id: 'robot-tidy', name: 'Robot Tidy', category: 'Arcade' },
  { id: 'lava-loop', name: 'Lava Loop', category: 'Skill', portrait: true },
  { id: 'safari-snap', name: 'Safari Snap', category: 'Animal' },
  { id: 'pencil-rally', name: 'Pencil Rally', category: 'Racing' },
  { id: 'bubble-orbit', name: 'Bubble Orbit', category: 'Arcade', portrait: true },
  { id: 'castle-creep', name: 'Castle Creep', category: 'Horror' },
  { id: 'hoop-hero', name: 'Hoop Hero', category: 'Sports', portrait: true },
  { id: 'thread-run', name: 'Thread Run', category: 'Skill' },
  { id: 'pizza-rush', name: 'Pizza Rush', category: 'Cooking' },
  { id: 'voxel-park', name: 'Voxel Park', category: 'Adventure', portrait: true },
  { id: 'slime-pit', name: 'Slime Pit', category: '.io' },
  { id: 'mirror-maze', name: 'Mirror Maze', category: 'Puzzle' },
  { id: 'punch-dummy', name: 'Punch Dummy', category: 'Action', portrait: true },
  { id: 'coral-quest', name: 'Coral Quest', category: 'Adventure' },
  { id: 'paper-plane', name: 'Paper Plane', category: 'Arcade' },
  { id: 'disco-dress', name: 'Disco Dress', category: 'Dress Up', isNew: true, portrait: true },
  { id: 'sniper-lane', name: 'Sniper Lane', category: 'Shooting', isNew: true },
  { id: 'farm-hop', name: 'Farm Hop', category: 'Animal' },
  { id: 'ice-slide', name: 'Ice Slide', category: 'Sports', portrait: true },
  { id: 'lantern-run', name: 'Lantern Run', category: 'Adventure' },
  { id: 'brick-blitz', name: 'Brick Blitz', category: 'Puzzle', isNew: true },
  { id: 'turbo-toad', name: 'Turbo Toad', category: 'Racing', isNew: true, portrait: true },
  { id: 'shadow-tag', name: 'Shadow Tag', category: '.io' },
  { id: 'melody-match', name: 'Melody Match', category: 'Puzzle', portrait: true },
]

function dummy(spec: DummySpec, index: number): Game {
  const pair = PALETTE[index % PALETTE.length]
  const from = spec.from ?? pair[0]
  const to = spec.to ?? pair[1]
  const entry = {
    id: spec.id,
    name: spec.name,
    tagline: `${spec.category} game`,
    url: SHARED_URLS[index % SHARED_URLS.length],
    image: '',
    gradientFrom: from,
    gradientTo: to,
    glow: from,
    category: spec.category,
    popular: spec.popular,
    isNew: spec.isNew,
  }
  return spec.portrait ? portrait(entry) : landscape(entry)
}

export const games: Game[] = [
  landscape({
    id: 'wonder-voyage',
    name: 'Wonder Voyage',
    tagline: 'Test your memory',
    url: 'https://shaffan-nextgen.github.io/WonderVoyage-Build/',
    image: '/games/wonder-voyage.png',
    gradientFrom: '#0ea5e9',
    gradientTo: '#6366f1',
    glow: '#0ea5e9',
    category: 'Puzzle',
    popular: true,
  }),
  landscape({
    id: 'city-cargo',
    name: 'City Cargo',
    tagline: 'Balance the cargo',
    url: 'https://shaffan-nextgen.github.io/CargoLiftPuzzle2D-Build/',
    image: '/games/city-cargo.png',
    gradientFrom: '#f59e0b',
    gradientTo: '#f97316',
    glow: '#f59e0b',
    category: 'Puzzle',
    popular: true,
  }),
  portrait({
    id: 'bounce-legends',
    name: 'Bounce Legends',
    tagline: 'Hoops!',
    url: 'https://shaffan-nextgen.github.io/BounceLegends-Build/',
    image: '/games/bounce-legends.png',
    gradientFrom: '#f97316',
    gradientTo: '#ef4444',
    glow: '#f97316',
    category: 'Arcade',
    popular: true,
  }),
  portrait({
    id: 'color-snake',
    name: 'Color Snake',
    tagline: 'Classic Snake game with a twist',
    url: 'https://shaffan-nextgen.github.io/ColorSnake-Build/',
    image: '/games/color-snake.png',
    gradientFrom: '#22c55e',
    gradientTo: '#84cc16',
    glow: '#22c55e',
    category: 'Slots',
    popular: true,
  }),
  portrait({
    id: 'bloom-heaven',
    name: 'Bloom Heaven',
    tagline: 'guuu',
    url: 'https://shaffan-nextgen.github.io/BloomHeaven-Build/',
    image: '/games/bloom-heaven.png',
    gradientFrom: '#db2777',
    gradientTo: '#f472b6',
    glow: '#ec4899',
    category: 'Puzzle',
    popular: true,
  }),
  landscape({
    id: 'dunes',
    name: 'Dunes',
    tagline: 'Dunes',
    url: 'https://shaffan-nextgen.github.io/Dunes-Build/',
    image: '/games/dunes.png',
    gradientFrom: '#d97706',
    gradientTo: '#fbbf24',
    glow: '#d97706',
    category: 'Arcade',
    popular: true,
  }),
  portrait({
    id: 'knife-strike',
    name: 'Knife Strike',
    tagline: 'Knife Strike',
    url: 'https://shaffan-nextgen.github.io/KnifeStrike-Build/',
    image: '/games/knife-strike.png',
    gradientFrom: '#e11d48',
    gradientTo: '#fb7185',
    glow: '#e11d48',
    category: 'Arcade',
    popular: true,
  }),
  portrait({
    id: 'robo-scape',
    name: 'Robo Scape',
    tagline: 'RoboScape',
    url: 'https://shaffan-nextgen.github.io/RoboScape-Build/',
    image: '/games/robo-scape.png',
    gradientFrom: '#1d4ed8',
    gradientTo: '#22d3ee',
    glow: '#1d4ed8',
    category: 'Arcade',
    popular: true,
  }),
  ...dummySpecs.map(dummy),
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
