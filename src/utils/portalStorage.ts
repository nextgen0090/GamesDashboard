import type { Game } from '../types/game'

const KEYS = {
  favorites: 'lobby_favorites',
  recent: 'lobby_recent',
  ratings: 'lobby_ratings',
  settings: 'lobby_settings',
  feedback: 'lobby_feedback',
  readNews: 'lobby_read_news',
} as const

export type RecentEntry = {
  id: string
  name: string
  image: string
  at: number
}

export type PortalSettings = {
  soundUi: boolean
  reducedAnimations: boolean
  backgroundEffects: boolean
  compactCards: boolean
}

const DEFAULT_SETTINGS: PortalSettings = {
  soundUi: true,
  reducedAnimations: false,
  backgroundEffects: true,
  compactCards: false,
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getFavorites(): string[] {
  return readJson<string[]>(KEYS.favorites, [])
}

export function toggleFavorite(gameId: string): string[] {
  const set = new Set(getFavorites())
  if (set.has(gameId)) set.delete(gameId)
  else set.add(gameId)
  const next = [...set]
  writeJson(KEYS.favorites, next)
  return next
}

export function addRecentlyPlayed(game: Game) {
  const list = readJson<RecentEntry[]>(KEYS.recent, [])
  const next = [
    { id: game.id, name: game.name, image: game.image, at: Date.now() },
    ...list.filter((e) => e.id !== game.id),
  ].slice(0, 6)
  writeJson(KEYS.recent, next)
  return next
}

export function getRecentlyPlayed(): RecentEntry[] {
  return readJson<RecentEntry[]>(KEYS.recent, [])
}

export function getUserRating(gameId: string): number | null {
  const map = readJson<Record<string, number>>(KEYS.ratings, {})
  return map[gameId] ?? null
}

export function setUserRating(gameId: string, stars: number) {
  const map = readJson<Record<string, number>>(KEYS.ratings, {})
  map[gameId] = stars
  writeJson(KEYS.ratings, map)
}

export function getSettings(): PortalSettings {
  return { ...DEFAULT_SETTINGS, ...readJson<Partial<PortalSettings>>(KEYS.settings, {}) }
}

export function saveSettings(settings: PortalSettings) {
  writeJson(KEYS.settings, settings)
}

export type FeedbackEntry = {
  id: string
  type: string
  gameId: string | null
  rating: number
  message: string
  at: number
}

export function saveFeedback(entry: Omit<FeedbackEntry, 'id' | 'at'>) {
  const list = readJson<FeedbackEntry[]>(KEYS.feedback, [])
  const row: FeedbackEntry = {
    ...entry,
    id: crypto.randomUUID(),
    at: Date.now(),
  }
  writeJson(KEYS.feedback, [row, ...list].slice(0, 50))
  return row
}

export function getReadNewsIds(): string[] {
  return readJson<string[]>(KEYS.readNews, [])
}

export function markNewsRead(id: string) {
  const set = new Set(getReadNewsIds())
  set.add(id)
  writeJson(KEYS.readNews, [...set])
}
