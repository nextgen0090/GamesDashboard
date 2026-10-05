import type { Game } from '../types/game'

export function getGameResolution(game: Game): { width: number; height: number } {
  if (game.resolutionWidth > 0 && game.resolutionHeight > 0) {
    return { width: game.resolutionWidth, height: game.resolutionHeight }
  }
  if (game.orientation === 'portrait') {
    return { width: 1080, height: 1920 }
  }
  return { width: 1920, height: 1080 }
}

export function isPortraitGame(game: Game): boolean {
  const { width, height } = getGameResolution(game)
  return height > width
}

/** Largest box with game aspect ratio that fits inside maxW × maxH (contain, no crop). */
export function computeFitDimensions(
  maxWidth: number,
  maxHeight: number,
  contentWidth: number,
  contentHeight: number,
): { width: number; height: number } {
  if (maxWidth <= 0 || maxHeight <= 0 || contentWidth <= 0 || contentHeight <= 0) {
    return { width: 0, height: 0 }
  }
  const scale = Math.min(maxWidth / contentWidth, maxHeight / contentHeight)
  return {
    width: contentWidth * scale,
    height: contentHeight * scale,
  }
}

const MODAL_HEADER_PX = 52
const MODAL_PAD_PX = 12

/** Modal outer size so the game area matches aspect ratio and uses max viewport space. */
export function computeModalSize(
  game: Game,
  viewportWidth: number,
  viewportHeight: number,
): { width: number; height: number; gameWidth: number; gameHeight: number } {
  const { width: gw, height: gh } = getGameResolution(game)
  const maxOuterW = viewportWidth * 0.98 - MODAL_PAD_PX * 2
  const maxOuterH = viewportHeight * 0.94 - MODAL_PAD_PX * 2
  const maxGameH = maxOuterH - MODAL_HEADER_PX

  const fit = computeFitDimensions(maxOuterW, maxGameH, gw, gh)

  return {
    width: Math.floor(fit.width),
    height: Math.floor(fit.height + MODAL_HEADER_PX),
    gameWidth: Math.floor(fit.width),
    gameHeight: Math.floor(fit.height),
  }
}

export { MODAL_HEADER_PX, MODAL_PAD_PX }
