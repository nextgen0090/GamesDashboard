import type { Game } from '../types/game'

/** Typical Unity WebGL canvas for your GitHub Pages builds (see index.html unity-canvas). */
export const DEFAULT_UNITY_CANVAS = { width: 1280, height: 720 } as const

export function getCanvasSize(game: Game): { width: number; height: number } {
  if (
    game.resolutionWidth != null &&
    game.resolutionHeight != null &&
    game.resolutionWidth > 0 &&
    game.resolutionHeight > 0
  ) {
    return { width: game.resolutionWidth, height: game.resolutionHeight }
  }
  if (game.orientation === 'portrait') {
    return { width: 720, height: 1280 }
  }
  return { ...DEFAULT_UNITY_CANVAS }
}

export function getViewportBoxSize(game: Game): { width: number; height: number } {
  const canvas = getCanvasSize(game)
  const padTop = game.viewportPaddingTop ?? 0
  const padBottom = game.viewportPaddingBottom ?? 0
  return {
    width: canvas.width,
    height: canvas.height + padTop + padBottom,
  }
}

export function getGameResolution(game: Game): { width: number; height: number } {
  return getViewportBoxSize(game)
}

export function isPortraitGame(game: Game): boolean {
  const { width, height } = getViewportBoxSize(game)
  return height > width
}

export function computeFitDimensions(
  maxWidth: number,
  maxHeight: number,
  contentWidth: number,
  contentHeight: number,
): { width: number; height: number; scale: number } {
  if (maxWidth <= 0 || maxHeight <= 0 || contentWidth <= 0 || contentHeight <= 0) {
    return { width: 0, height: 0, scale: 1 }
  }
  const scale = Math.min(maxWidth / contentWidth, maxHeight / contentHeight)
  return {
    width: contentWidth * scale,
    height: contentHeight * scale,
    scale,
  }
}

const MODAL_HEADER_PX = 52
const MODAL_PAD_PX = 12

export function computeModalSize(
  game: Game,
  viewportWidth: number,
  viewportHeight: number,
): { width: number; height: number; gameWidth: number; gameHeight: number } {
  const { width: gw, height: gh } = getViewportBoxSize(game)
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
