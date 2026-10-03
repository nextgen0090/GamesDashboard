import { motion } from 'framer-motion'
import type { Game } from '../types/game'
import { PlayButton } from './PlayButton'

type GameCardProps = {
  game: Game
  index: number
  onPlay: (game: Game) => void
}

const thumbAspect = 'aspect-[4/3]'

export function GameCard({ game, index, onPlay }: GameCardProps) {
  return (
    <motion.article
      style={{ ['--card-glow' as string]: game.glow }}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        delay: 0.04 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        scale: 1.02,
        transition: { type: 'spring', stiffness: 360, damping: 22 },
      }}
      className="group card-glow-ring flex h-full flex-col rounded-xl"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[rgba(18,10,32,0.62)] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.88)] backdrop-blur-sm transition-[box-shadow,border-color] duration-300 group-hover:border-white/[0.14] group-hover:shadow-[0_16px_40px_-14px_color-mix(in_srgb,var(--card-glow)_42%,transparent),0_0_28px_color-mix(in_srgb,var(--card-glow)_18%,transparent)]">
        <div className={`relative ${thumbAspect} w-full shrink-0 overflow-hidden`}>
          <img
            src={game.image}
            alt={game.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.22] transition-opacity duration-300 group-hover:opacity-[0.32]"
            style={{
              background: `linear-gradient(145deg, ${game.gradientFrom}88, transparent 55%, ${game.gradientTo}55)`,
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0614]/95 via-[#0a0614]/15 to-transparent" />

          <span className="absolute left-2.5 top-2.5 rounded border border-white/12 bg-black/50 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm sm:text-[9px]">
            {game.category}
          </span>
        </div>

        <div className="flex flex-col gap-2.5 p-3 sm:p-3.5">
          <h2 className="truncate font-display text-xs font-bold uppercase tracking-wide text-white">
            {game.name}
          </h2>
          <PlayButton glow={game.glow} onClick={() => onPlay(game)} fullWidth compact />
        </div>
      </div>
    </motion.article>
  )
}
