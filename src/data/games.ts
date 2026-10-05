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
    image: '/games/neon-slots.svg',
    gradientFrom: '#ff006e',
    gradientTo: '#8338ec',
    glow: '#ff006e',
    category: 'Puzzle',
  },
  {
    id: 'city-cargo',
    name: 'City Cargo',
    tagline: 'Balance the cargo',
    url: 'https://shaffan-nextgen.github.io/CargoLiftPuzzle2D-Build/',
    image: '/games/neon-slots.svg',
    gradientFrom: '#ff006e',
    gradientTo: '#8338ec',
    glow: '#ff006e',
    category: 'Puzzle',
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
  },
]
