import type { Game } from '../types/game'
import { DEFAULT_UNITY_CANVAS } from '../utils/gameViewport'

/** Default portrait canvas (typical mobile Unity WebGL — check `<canvas width height>` in index.html). */
export const DEFAULT_PORTRAIT_CANVAS = { width: 450, height: 800 } as const

/**
 * Overrides when a build is not 1280×720 (landscape) or 450×800 (portrait).
 * Game list only needs `portrait()` / `landscape()` — add a line here when sizes differ.
 */
export const GAME_CANVAS: Record<string, readonly [width: number, height: number]> = {
  // 'some-id': [720, 1280],
}

type GameEntryInput = Omit<Game, 'orientation' | 'resolutionWidth' | 'resolutionHeight'>

function resolveCanvas(
  id: string,
  orientation: 'landscape' | 'portrait',
): { width: number; height: number } {
  const custom = GAME_CANVAS[id]
  if (custom) {
    return { width: custom[0], height: custom[1] }
  }
  if (orientation === 'portrait') {
    return { ...DEFAULT_PORTRAIT_CANVAS }
  }
  return { ...DEFAULT_UNITY_CANVAS }
}

/** Standard wide Unity WebGL title (1280×720 unless listed in `GAME_CANVAS`). */
export function landscape(entry: GameEntryInput): Game {
  const { width, height } = resolveCanvas(entry.id, 'landscape')
  return {
    ...entry,
    orientation: 'landscape',
    resolutionWidth: width,
    resolutionHeight: height,
  }
}

/** Tall Unity WebGL title (720×1280 unless listed in `GAME_CANVAS`). */
export function portrait(entry: GameEntryInput): Game {
  const { width, height } = resolveCanvas(entry.id, 'portrait')
  return {
    ...entry,
    orientation: 'portrait',
    resolutionWidth: width,
    resolutionHeight: height,
  }
}
