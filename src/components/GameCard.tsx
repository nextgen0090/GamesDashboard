import { useState, type CSSProperties, type MouseEvent } from 'react'
import { displayRating } from '../data/portalContent'
import { useCardPointer } from '../hooks/useCardPointer'
import { getUserRating } from '../utils/portalStorage'
import type { Game } from '../types/game'
import { PlayButton } from './PlayButton'

type GameCardProps = {
  game: Game
  index: number
  onPlay: (game: Game) => void
  onDetail?: (game: Game) => void
  isFavorite?: boolean
  onToggleFavorite?: (gameId: string) => void
  compact?: boolean
  skipEnterAnimation?: boolean
  enterDelayMs?: number
}

const FALLBACK_ART = '/icons.svg'

export function GameCard({
  game,
  index,
  onPlay,
  onDetail,
  isFavorite = false,
  onToggleFavorite,
  compact = false,
  skipEnterAnimation = false,
  enterDelayMs,
}: GameCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgSrc, setImgSrc] = useState(game.image)
  const { onPointerMove, onPointerLeave } = useCardPointer()

  const badge = game.isNew ? 'New' : game.popular ? 'Popular' : game.featured ? 'Featured' : null
  const rating = displayRating(game.id, getUserRating(game.id))

  const openDetail = () => onDetail?.(game)

  const stopBubble = (e: MouseEvent) => {
    e.stopPropagation()
  }

  const delay =
    enterDelayMs ??
    (skipEnterAnimation ? 0 : Math.min(index, 12) * 40)

  return (
    <article
      style={
        {
          ['--card-glow' as string]: game.glow,
          ...(skipEnterAnimation
            ? {}
            : { animationDelay: `${delay}ms` }),
        } as CSSProperties
      }
      className={`${skipEnterAnimation ? '' : 'lobby-card-in'} lobby-card-tilt group card-glow-ring card-spotlight relative flex h-full flex-col rounded-lg ${onDetail ? 'cursor-pointer' : ''} ${compact ? 'compact-card' : ''}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onDetail ? openDetail : undefined}
      onKeyDown={
        onDetail
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openDetail()
              }
            }
          : undefined
      }
      tabIndex={onDetail ? 0 : undefined}
    >
      <div className="lobby-card-panel glass-panel relative flex h-full flex-col overflow-hidden rounded-lg">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
          {!imgLoaded && <div className="card-thumb-shimmer absolute inset-0 bg-[#1a1730]" aria-hidden />}
          <img
            src={imgSrc}
            alt={game.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              if (imgSrc !== FALLBACK_ART) setImgSrc(FALLBACK_ART)
              setImgLoaded(true)
            }}
            className={`lobby-card-image pointer-events-none absolute inset-0 h-full w-full object-cover object-center ${imgLoaded ? 'is-loaded' : ''}`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07070f]/90 via-transparent to-transparent" />

          <span className="pointer-events-none absolute left-2 top-2 rounded border border-white/10 bg-[#07070f]/75 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-zinc-300 sm:text-[9px]">
            {game.category}
          </span>
          {badge && (
            <span className="pointer-events-none absolute right-2 top-2 rounded border border-[#ffc947]/25 bg-[#ffc947]/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#ffc947] sm:text-[9px]">
              {badge}
            </span>
          )}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                stopBubble(e)
                onToggleFavorite(game.id)
              }}
              className={`absolute bottom-2 right-2 z-[2] flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#07070f]/80 text-sm transition-colors ${isFavorite ? 'text-[#e84a9a]' : 'text-zinc-500 hover:text-white'}`}
              aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
            >
              ♥
            </button>
          )}
        </div>

        <div className={`relative z-[1] flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 ${compact ? 'p-2.5' : 'sm:p-3.5'}`}>
          <p className="truncate text-left font-display text-[11px] font-bold uppercase tracking-wide text-white sm:text-xs">
            {game.name}
          </p>
          {!compact && (
            <p className="line-clamp-2 text-[10px] leading-snug text-zinc-500 sm:text-[11px]">{game.tagline}</p>
          )}
          <p className="text-[10px] text-zinc-500">
            <span className="text-[#ffc947]">★</span> {rating.toFixed(1)}
          </p>
          <div className="mt-auto pt-1" onClick={stopBubble}>
            <PlayButton glow={game.glow} onClick={() => onPlay(game)} fullWidth compact />
          </div>
        </div>
      </div>
    </article>
  )
}
