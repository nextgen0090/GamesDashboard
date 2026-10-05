import { useEffect, useState } from 'react'
import type { Game } from '../types/game'
import { computeModalSize } from '../utils/gameViewport'

export function useModalGameLayout(game: Game | null) {
  const [layout, setLayout] = useState({
    width: 960,
    height: 592,
    gameWidth: 960,
    gameHeight: 540,
  })

  useEffect(() => {
    if (!game) return

    const update = () => {
      setLayout(computeModalSize(game, window.innerWidth, window.innerHeight))
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [game])

  return layout
}
