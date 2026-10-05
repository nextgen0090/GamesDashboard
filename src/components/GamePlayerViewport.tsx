import type { Game } from '../types/game'

type GamePlayerViewportProps = {
  game: Game
  width: number
  height: number
  onLoad: () => void
}

export function GamePlayerViewport({ game, width, height, onLoad }: GamePlayerViewportProps) {
  return (
    <div
      className="relative shrink-0 overflow-hidden bg-black"
      style={{ width, height }}
    >
      <iframe
        key={game.id}
        title={game.name}
        src={game.url}
        scrolling="no"
        className="block h-full w-full border-0"
        allow="fullscreen; autoplay; gamepad"
        onLoad={onLoad}
      />
    </div>
  )
}
