export type PortalPage =
  | 'home'
  | 'games'
  | 'popular'
  | 'new'
  | 'favorites'
  | 'recent'
  | 'recommended'
  | 'leaderboard'
  | 'updates'
  | 'news'
  | 'feedback'
  | 'faq'
  | 'help'
  | 'settings'

export const PORTAL_NAV: { page: PortalPage; label: string; icon: string }[] = [
  { page: 'home', label: 'Home', icon: '⌂' },
  { page: 'games', label: 'Games', icon: '▦' },
  { page: 'popular', label: 'Popular', icon: '★' },
  { page: 'new', label: 'New Games', icon: '✦' },
  { page: 'favorites', label: 'Favorites', icon: '♥' },
  { page: 'recent', label: 'Recently Played', icon: '↺' },
  { page: 'recommended', label: 'Recommended', icon: '◆' },
  { page: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
  { page: 'updates', label: 'Game Updates', icon: '◈' },
  { page: 'news', label: 'News', icon: '📰' },
  { page: 'feedback', label: 'Feedback', icon: '✎' },
  { page: 'faq', label: 'FAQ', icon: '?' },
  { page: 'help', label: 'Help', icon: '!' },
  { page: 'settings', label: 'Settings', icon: '⚙' },
]

export const PAGE_TITLES: Record<PortalPage, string> = {
  home: 'Lobby Home',
  games: 'Game Library',
  popular: 'Popular Games',
  new: 'New Games',
  favorites: 'Favorites',
  recent: 'Recently Played',
  recommended: 'Recommended',
  leaderboard: 'Leaderboard',
  updates: 'Game Updates',
  news: 'Latest News',
  feedback: 'Feedback',
  faq: 'FAQ',
  help: 'Help & Support',
  settings: 'Settings',
}
