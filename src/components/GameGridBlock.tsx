import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { Game } from '../types/game'
import { GameCard } from './GameCard'

type GameGridBlockProps = {
  title: string
  subtitle?: string
  games: Game[]
  onPlay: (game: Game) => void
  onDetail: (game: Game) => void
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
  compact?: boolean
  emptyMessage?: string
  revealDisabled?: boolean
  revealDelay?: number
}

const cardScaleIn = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export function GameGridBlock({
  title,
  subtitle,
  games,
  onPlay,
  onDetail,
  favorites,
  onToggleFavorite,
  compact,
  emptyMessage,
  revealDisabled = false,
  revealDelay = 0,
}: GameGridBlockProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [motionReady, setMotionReady] = useState(revealDisabled)

  const inView = useInView(gridRef, {
    once: true,
    amount: 0.08,
    margin: '0px 0px -20px 0px',
  })

  useEffect(() => {
    if (revealDisabled) return
    const t = window.setTimeout(() => setMotionReady(true), 80)
    return () => window.clearTimeout(t)
  }, [revealDisabled])

  const playStagger = !revealDisabled && motionReady && inView

  const staggerWithDelay = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.11,
        delayChildren: revealDelay + 0.06,
      },
    },
  }

  return (
    <section className="mb-8 sm:mb-9" aria-label={title}>
      <div className="mb-3.5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-xs font-bold uppercase tracking-[0.16em] text-white sm:text-sm">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-[11px] text-zinc-500 sm:text-xs">{subtitle}</p>}
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
          {games.length} title{games.length === 1 ? '' : 's'}
        </span>
      </div>
      {games.length === 0 ? (
        <p className="glass-panel rounded-xl border border-dashed border-white/10 py-10 text-center text-xs text-zinc-500">
          {emptyMessage ?? 'Nothing here yet.'}
        </p>
      ) : revealDisabled ? (
        <div className="game-grid items-stretch">
          {games.map((game, index) => (
            <GameCard
              key={game.id}
              game={game}
              index={index}
              onPlay={onPlay}
              onDetail={onDetail}
              isFavorite={favorites.has(game.id)}
              onToggleFavorite={onToggleFavorite}
              compact={compact}
              skipEnterAnimation
            />
          ))}
        </div>
      ) : (
        <motion.div
          ref={gridRef}
          className="game-grid items-stretch"
          variants={staggerWithDelay}
          initial="hidden"
          animate={playStagger ? 'show' : 'hidden'}
        >
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              variants={cardScaleIn}
              className="game-grid-card-reveal h-full min-h-0"
              style={{ transformOrigin: 'center center' }}
            >
              <GameCard
                game={game}
                index={index}
                onPlay={onPlay}
                onDetail={onDetail}
                isFavorite={favorites.has(game.id)}
                onToggleFavorite={onToggleFavorite}
                compact={compact}
                skipEnterAnimation
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  )
}
