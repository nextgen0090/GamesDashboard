import type { Game } from '../types/game'
import { computeFitDimensions, getViewportBoxSize } from '../utils/gameViewport'

type GamePlayerViewportProps = {
  game: Game
  width: number
  height: number
  onLoad: () => void
}

/** Scale Unity page at native canvas size to fit the modal without cropping. */
export function GamePlayerViewport({ game, width, height, onLoad }: GamePlayerViewportProps) {
  const box = getViewportBoxSize(game)
  const { scale, width: scaledW, height: scaledH } = computeFitDimensions(
    width,
    height,
    box.width,
    box.height,
  )

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#231F20]"
      style={{ width, height, minWidth: 0, minHeight: 0 }}
    >
      <div
        className="relative shrink-0 overflow-hidden"
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
