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

          <span className="lobby-card-category pointer-events-none absolute left-2 top-2 z-[3]">
            {game.category}
          </span>
          {badge && (
            <span className="lobby-card-status-badge pointer-events-none absolute right-2 top-2 z-[3]">
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

        <div
          className={`lobby-card-body relative z-[1] flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 ${compact ? 'p-2.5' : 'sm:p-3.5'}`}
        >
          <p className="lobby-card-title truncate text-left">{game.name}</p>
          {!compact && (
            <p className="lobby-card-tagline line-clamp-2 text-[11px] leading-snug sm:text-xs">{game.tagline}</p>
          )}
          <p className="lobby-card-rating">
            <span className="lobby-card-rating-star" aria-hidden>
              ★
            </span>
            <span className="lobby-card-rating-value">{rating.toFixed(1)}</span>
          </p>
          <div className="mt-auto pt-1" onClick={stopBubble}>
            <PlayButton glow={game.glow} onClick={() => onPlay(game)} fullWidth compact />
          </div>
        </div>
      </div>
    </article>
  )
}
