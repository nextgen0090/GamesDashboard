import { useEffect, useState } from 'react'
import type { Game } from '../types/game'
import { computeModalSize, getPlayViewportSize } from '../utils/gameViewport'

export function useModalGameLayout(game: Game | null) {
  const [layout, setLayout] = useState({
    width: 1280,
    height: 772,
    gameWidth: 1280,
    gameHeight: 720,
  })

  useEffect(() => {
    if (!game) return

    const update = () => {
      const { width, height } = getPlayViewportSize()
      setLayout(computeModalSize(game, width, height))
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [game])

  return layout
}
