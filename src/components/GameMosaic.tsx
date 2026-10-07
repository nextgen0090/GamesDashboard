import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { games, searchGames } from '../data/games'
import type { Game } from '../types/game'
import { getViewportBoxSize } from '../utils/gameViewport'
import { GamePlayerViewport } from './GamePlayerViewport'
import { TileArt } from './TileArt'

type GameMosaicProps = {
  onPlayed?: (game: Game) => void
  reducedMotion?: boolean
}

type PlacedTile = {
  game: Game
  cols: number
  rows: number
}

type Span = { cols: number; rows: number }

type GridMetrics = {
  cols: number
  colW: number
  rowH: number
  gap: number
}

const POPULAR_SPANS: ReadonlyArray<readonly [number, number]> = [
  [2, 3],
  [3, 2],
  [2, 2],
  [2, 3],
  [3, 3],
  [2, 2],
  [3, 2],
  [2, 2],
  [2, 3],
  [3, 2],
  [2, 2],
  [3, 3],
]

const SMALL_BATCHES = [2, 4, 1, 3, 5, 2, 3, 2, 4, 1]

function layoutMosaic(pool: Game[]): PlacedTile[] {
  const popular = pool.filter((g) => g.popular)
  const normal = pool.filter((g) => !g.popular)
  const placed: PlacedTile[] = []
  let n = 0

  const takeSmall = (count: number) => {
    const end = Math.min(n + count, normal.length)
    for (; n < end; n++) placed.push({ game: normal[n], cols: 1, rows: 1 })
  }

  takeSmall(1)
  popular.forEach((game, i) => {
    const span = POPULAR_SPANS[i % POPULAR_SPANS.length]
    placed.push({ game, cols: span[0], rows: span[1] })
    takeSmall(SMALL_BATCHES[i % SMALL_BATCHES.length])
  })
  takeSmall(normal.length - n)
  return placed
}

function trackSize(count: number, size: number, gap: number) {
  return count * size + Math.max(0, count - 1) * gap
}

function readMetrics(grid: HTMLElement): GridMetrics | null {
  const style = getComputedStyle(grid)
  const gap = parseFloat(style.columnGap) || 0
  const tracks = style.gridTemplateColumns
    .split(' ')
    .map((part) => parseFloat(part))
    .filter((n) => Number.isFinite(n) && n > 0)
  if (tracks.length === 0) return null
  const rowH = parseFloat(style.gridAutoRows) || tracks[0]
  return { cols: tracks.length, colW: tracks[0], rowH, gap }
}

/** Largest grid span whose box matches the game canvas aspect ratio. */
function expandedSpan(game: Game, metrics: GridMetrics, viewportH: number): Span {
  const box = getViewportBoxSize(game)
  const aspect = box.width / Math.max(1, box.height)
  const maxH = Math.max(metrics.rowH * 2, Math.min(viewportH * 0.86, 1000))
  let best: Span & { err: number; area: number } = { cols: 1, rows: 1, err: Number.POSITIVE_INFINITY, area: 0 }

  for (let cols = 1; cols <= metrics.cols; cols++) {
    const w = trackSize(cols, metrics.colW, metrics.gap)
    const idealH = w / aspect
    let rows = Math.max(1, Math.round((idealH + metrics.gap) / (metrics.rowH + metrics.gap)))
    let h = trackSize(rows, metrics.rowH, metrics.gap)
    if (h > maxH) {
      rows = Math.max(1, Math.floor((maxH + metrics.gap) / (metrics.rowH + metrics.gap)))
      h = trackSize(rows, metrics.rowH, metrics.gap)
    }
    const err = Math.abs(w / Math.max(h, 1) - aspect) / aspect
    const area = w * h
    const betterFit = err < best.err - 0.04
    const similarAndLarger = Math.abs(err - best.err) <= 0.04 && area > best.area
    if (betterFit || similarAndLarger) best = { cols, rows, err, area }
  }

  return { cols: best.cols, rows: best.rows }
}

function runFlip(grid: HTMLElement, update: () => void, animate: boolean) {
  const selector = '[data-tile]'
  if (!animate) {
    update()
    return Promise.resolve()
  }

  const first = new Map<string, DOMRect>()
  grid.querySelectorAll<HTMLElement>(selector).forEach((node) => {
    const id = node.dataset.tile
    if (id) first.set(id, node.getBoundingClientRect())
  })

  flushSync(update)

  const animations: Animation[] = []
  grid.querySelectorAll<HTMLElement>(selector).forEach((node) => {
    const id = node.dataset.tile
    const before = id ? first.get(id) : undefined
    if (!before) return
    const after = node.getBoundingClientRect()
    const dx = before.left - after.left
    const dy = before.top - after.top
    const sx = before.width / Math.max(after.width, 1)
    const sy = before.height / Math.max(after.height, 1)
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) {
      return
    }
    node.getAnimations().forEach((anim) => anim.cancel())
    const lift = sx < 0.98 || sy < 0.98 || sx > 1.02 || sy > 1.02
    animations.push(
      node.animate(
        [
          {
            transformOrigin: 'top left',
            transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
            zIndex: lift ? 30 : 1,
          },
          { transformOrigin: 'top left', transform: 'none', zIndex: lift ? 30 : 1 },
        ],
        { duration: 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' },
      ),
    )
  })

  return Promise.all(animations.map((anim) => anim.finished.catch(() => undefined))).then(() => undefined)
}

function OpenStage({ game, onClose }: { game: Game; onClose: () => void }) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const measure = () => {
      const w = Math.floor(el.clientWidth)
      const h = Math.floor(el.clientHeight)
      setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="mosaic-stage" role="region" aria-label={`Playing ${game.name}`}>
      <div ref={canvasRef} className="mosaic-stage-canvas">
        {size.w > 0 && size.h > 0 && (
          <GamePlayerViewport game={game} width={size.w} height={size.h} onLoad={() => setLoading(false)} />
        )}
        {loading && (
          <div className="mosaic-stage-loader" aria-hidden>
            <span className="mosaic-stage-spinner" />
          </div>
        )}
      </div>
      <p className="mosaic-stage-name">{game.name}</p>
      <button ref={closeRef} type="button" className="mosaic-stage-close" aria-label={`Close ${game.name}`} onClick={onClose}>
        <svg viewBox="0 0 24 24" className="mosaic-icon" aria-hidden>
          <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

export function GameMosaic({ onPlayed, reducedMotion = false }: GameMosaicProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [openGame, setOpenGame] = useState<Game | null>(null)
  const [openSpan, setOpenSpan] = useState<Span | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mosaicRef = useRef<HTMLDivElement>(null)
  const openGameRef = useRef<Game | null>(null)

  useEffect(() => {
    openGameRef.current = openGame
  }, [openGame])

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  const tiles = useMemo(() => layoutMosaic(query.trim() ? searchGames(query) : games), [query])

  const motionOff =
    reducedMotion ||
    (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  const shift = useCallback(
    (update: () => void) => {
      const grid = mosaicRef.current
      if (!grid) {
        update()
        return Promise.resolve()
      }
      return runFlip(grid, update, !motionOff)
    },
    [motionOff],
  )

  const closeGame = useCallback(() => {
    if (!openGameRef.current) return
    void shift(() => {
      setOpenGame(null)
      setOpenSpan(null)
    })
  }, [shift])

  const openTile = useCallback(
    (game: Game) => {
      if (openGameRef.current?.id === game.id) return
      const metrics = mosaicRef.current ? readMetrics(mosaicRef.current) : null
      const span = metrics ? expandedSpan(game, metrics, window.innerHeight) : { cols: 4, rows: 3 }
      onPlayed?.(game)
      void shift(() => {
        setOpenGame(game)
        setOpenSpan(span)
      }).then(() => {
        const el = mosaicRef.current?.querySelector<HTMLElement>(`[data-tile="${CSS.escape(game.id)}"]`)
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (rect.top < 12 || rect.bottom > window.innerHeight - 12) {
          el.scrollIntoView({ block: 'start', behavior: motionOff ? 'auto' : 'smooth' })
        }
      })
    },
    [motionOff, onPlayed, shift],
  )

  useEffect(() => {
    if (!openGame) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeGame()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openGame, closeGame])

  useEffect(() => {
    if (!openGame) return
    if (!tiles.some((tile) => tile.game.id === openGame.id)) {
      setOpenGame(null)
      setOpenSpan(null)
    }
  }, [tiles, openGame])

  useEffect(() => {
    if (!openGame) return
    const onResize = () => {
      const grid = mosaicRef.current
      if (!grid) return
      const metrics = readMetrics(grid)
      if (!metrics) return
      setOpenSpan(expandedSpan(openGame, metrics, window.innerHeight))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [openGame])

  const closeSearch = () => {
    setQuery('')
    setSearchOpen(false)
  }

  return (
    <div ref={mosaicRef} className="mosaic">
      <div
        data-tile="brand"
        className={`mosaic-cell mosaic-span-c${searchOpen ? 3 : 1} mosaic-span-r1`}
      >
        <div className={`mosaic-brand${searchOpen ? ' is-search' : ''}`}>
          {searchOpen ? (
            <>
              <svg viewBox="0 0 24 24" className="mosaic-search-glyph" aria-hidden>
                <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M16 16.5 20 20.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                className="mosaic-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.stopPropagation()
                    closeSearch()
                  }
                }}
                placeholder="Search games"
                aria-label="Search games"
                autoComplete="off"
                spellCheck={false}
              />
              <button type="button" className="mosaic-search-btn" aria-label="Close search" onClick={closeSearch}>
                <svg viewBox="0 0 24 24" className="mosaic-icon" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <p className="mosaic-wordmark">play</p>
              <button
                type="button"
                className="mosaic-search-btn"
                aria-label="Search games"
                onClick={() => setSearchOpen(true)}
              >
                <svg viewBox="0 0 24 24" className="mosaic-icon" aria-hidden>
                  <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 16.5 20 20.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {tiles.map(({ game, cols, rows }) => {
        const open = openGame?.id === game.id && openSpan != null
        return (
          <div
            key={game.id}
            data-tile={game.id}
            className={
              open
                ? 'mosaic-cell is-open'
                : `mosaic-cell mosaic-span-c${cols} mosaic-span-r${rows}`
            }
            style={
              open
                ? { gridColumn: `span ${openSpan.cols}`, gridRow: `span ${openSpan.rows}` }
                : undefined
            }
          >
            {open ? (
              <OpenStage game={game} onClose={closeGame} />
            ) : (
              <button type="button" className="mosaic-tile" aria-label={`Play ${game.name}`} onClick={() => openTile(game)}>
                <TileArt game={game} />
                {game.isNew && (
                  <span className="mosaic-spark" aria-hidden>
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="#ffe566"
                        d="M12 1.5 14.2 8.2 21 9.2 16 13.6 17.6 20.5 12 16.8 6.4 20.5 8 13.6 3 9.2 9.8 8.2z"
                      />
                    </svg>
                  </span>
                )}
                <span className="mosaic-tile-label" aria-hidden>
                  {game.name}
                </span>
              </button>
            )}
          </div>
        )
      })}

      {tiles.length === 0 && <p className="mosaic-empty">No games match “{query.trim()}”.</p>}
    </div>
  )
}
