import type { Game } from '../types/game'
import { computeFitDimensions, getViewportBoxSize } from '../utils/gameViewport'

type GamePlayerViewportProps = {
  game: Game
  width: number
  height: number
  onLoad: () => void
}

/** Scale entire Unity page (1280×720) to fill the card without cropping. */
export function GamePlayerViewport({ game, width, height, onLoad }: GamePlayerViewportProps) {
  const box = getViewportBoxSize(game)
  const { scale } = computeFitDimensions(width, height, box.width, box.height)
  const scaledW = box.width * scale
  const scaledH = box.height * scale

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden bg-[#231F20]"
      style={{ width, height }}
    >
      <div
        className="relative overflow-hidden"
        style={{ width: scaledW, height: scaledH }}
      >
        <iframe
          key={game.id}
          title={game.name}
          src={game.url}
          scrolling="no"
          className="absolute left-0 top-0 border-0"
          style={{
            width: box.width,
            height: box.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          allow="fullscreen; autoplay; gamepad"
          onLoad={onLoad}
        />
      </div>
    </div>
  )
}
