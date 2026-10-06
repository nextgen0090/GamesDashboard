/** Mock portal content — replace with API responses later. */

export type LeaderboardPeriod = 'global' | 'today' | 'weekly' | 'monthly' | 'allTime'

export type LeaderboardRow = {
  rank: number
  player: string
  gamesPlayed: number
  score: number
  wins: number
  level: number
  period: LeaderboardPeriod
}

export const MOCK_LEADERBOARD: LeaderboardRow[] = [
  { rank: 1, player: 'NovaStrike', gamesPlayed: 142, score: 98420, wins: 89, level: 42, period: 'global' },
  { rank: 2, player: 'PixelQueen', gamesPlayed: 128, score: 91200, wins: 76, level: 39, period: 'global' },
  { rank: 3, player: 'JackpotJay', gamesPlayed: 119, score: 88750, wins: 71, level: 37, period: 'global' },
  { rank: 4, player: 'ArcadeAce', gamesPlayed: 104, score: 76400, wins: 58, level: 34, period: 'global' },
  { rank: 5, player: 'LuckyLuna', gamesPlayed: 98, score: 72100, wins: 52, level: 32, period: 'global' },
  { rank: 6, player: 'CardShark99', gamesPlayed: 91, score: 69800, wins: 49, level: 31, period: 'global' },
  { rank: 7, player: 'WheelWizard', gamesPlayed: 86, score: 67200, wins: 44, level: 29, period: 'global' },
  { rank: 8, player: 'You', gamesPlayed: 24, score: 18450, wins: 12, level: 14, period: 'global' },
  { rank: 9, player: 'NeonNinja', gamesPlayed: 77, score: 65100, wins: 41, level: 28, period: 'global' },
  { rank: 10, player: 'SlotSavant', gamesPlayed: 72, score: 62800, wins: 38, level: 27, period: 'global' },
]

export function leaderboardForPeriod(period: LeaderboardPeriod): LeaderboardRow[] {
  if (period === 'global' || period === 'allTime') return MOCK_LEADERBOARD
  return MOCK_LEADERBOARD.map((r, i) => ({
    ...r,
    rank: i + 1,
    score: Math.floor(r.score * (period === 'today' ? 0.08 : period === 'weekly' ? 0.35 : 0.6)),
    gamesPlayed: Math.max(3, Math.floor(r.gamesPlayed * (period === 'today' ? 0.05 : 0.25))),
  }))
}

/** Seeded display rating per game id (until API exists). */
export const BASE_GAME_RATINGS: Record<string, number> = {
  'wonder-voyage': 4.8,
  'city-cargo': 4.6,
  'bounce-legends': 4.7,
  'neon-slots': 4.9,
  'golden-fortune': 4.8,
  'crystal-match': 4.7,
  'roulette-neon': 4.6,
  'dice-rush': 4.5,
  'poker-star': 4.8,
  'wheel-blaze': 4.6,
  'blackjack-pro': 4.7,
}

export function displayRating(gameId: string, userStars: number | null): number {
  const base = BASE_GAME_RATINGS[gameId] ?? 4.6
  if (userStars == null) return base
  return Math.round(((base + userStars) / 2) * 10) / 10
}

export type PortalUpdate = {
  id: string
  kind: 'new' | 'update' | 'feature' | 'upcoming' | 'leaderboard'
  title: string
  date: string
  summary: string
  body: string
  gameName?: string
}

export const PORTAL_UPDATES: PortalUpdate[] = [
  {
    id: 'u1',
    kind: 'new',
    title: 'Blackjack Pro is live',
    date: 'Oct 2026',
    summary: 'Beat the dealer with a polished table experience.',
    body: 'Blackjack Pro joins the lobby with smooth WebGL play, instant launch in-modal, and leaderboard tracking.',
    gameName: 'Blackjack Pro',
  },
  {
    id: 'u2',
    kind: 'leaderboard',
    title: 'Weekly leaderboard reset',
    date: 'Oct 2026',
    summary: 'Fresh rankings every Monday — climb to the top.',
    body: 'Weekly boards reset at 00:00 UTC. Your all-time stats remain on the Global tab.',
  },
  {
    id: 'u3',
    kind: 'feature',
    title: 'Favorites & recently played',
    date: 'Sep 2026',
    summary: 'Save games and pick up where you left off.',
    body: 'Use the heart on any card to favorite. Recently played titles appear in your personal row.',
  },
]

export type NewsArticle = {
  id: string
  tag: string
  date: string
  title: string
  excerpt: string
  body: string
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'n1',
    tag: 'NEW GAME',
    date: 'Oct 2026',
    title: 'Dice Rush Is Now Live',
    excerpt: 'Fast arcade rolls with neon flair — play instantly in the lobby.',
    body: 'Dice Rush brings quick sessions and score-chasing fun. Tap Play on any card to launch inside the same modal player you already use — no downloads, no new tabs.',
  },
  {
    id: 'n2',
    tag: 'PLATFORM',
    date: 'Sep 2026',
    title: 'Portal Refresh 2026',
    excerpt: 'A cleaner lobby, leaderboard, and discovery tools.',
    body: 'The WebGL Lobby now includes favorites, feedback, FAQ, and news — all inside one dashboard. Gameplay in the iframe player is unchanged.',
  },
]

export type PortalNotification = {
  id: string
  title: string
  body: string
  at: string
  unread: boolean
}

export const PORTAL_NOTIFICATIONS: PortalNotification[] = [
  { id: 'no1', title: 'New game released', body: 'Wheel Blaze is available in New Games.', at: '2h ago', unread: true },
  { id: 'no2', title: 'Leaderboard updated', body: 'Weekly standings refreshed.', at: '1d ago', unread: true },
  { id: 'no3', title: 'Maintenance complete', body: 'All titles are online.', at: '3d ago', unread: false },
]

export type FaqItem = { id: string; q: string; a: string }

export const FAQ_ITEMS: FaqItem[] = [
  { id: 'f1', q: 'How do I play a game?', a: 'Tap Play on any card. The game opens in the lobby modal — stay on this page.' },
  { id: 'f2', q: 'Do I need to download anything?', a: 'No. Games run in your browser via WebGL inside the dashboard.' },
  { id: 'f3', q: 'Why is a game loading slowly?', a: 'Large WebGL builds may take a moment on first load. Check your connection and try again.' },
  { id: 'f4', q: 'How does the leaderboard work?', a: 'Sample rankings are shown for preview. Connect your API to the leaderboard component when ready.' },
  { id: 'f5', q: 'How do favorites work?', a: 'Tap the heart on a card. Favorites are stored locally on this device.' },
  { id: 'f6', q: 'Where are recently played games?', a: 'The Recently Played row updates when you launch a game from the lobby.' },
  { id: 'f7', q: 'How can I report a game problem?', a: 'Use Feedback with type Game Issue, or Need Help → Report Game Problem.' },
  { id: 'f8', q: 'How do I rate a game?', a: 'Open game details or use the Feedback section to set a star rating.' },
  { id: 'f9', q: 'Are new games added regularly?', a: 'Yes. Watch Game Updates and Latest News in the lobby.' },
]

export const ANNOUNCEMENT =
  'Weekly leaderboard resets Monday 00:00 UTC · New titles appear in New Games'
