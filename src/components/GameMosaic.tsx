import { useEffect, useMemo, useRef, useState } from 'react'
import { games, searchGames } from '../data/games'
import type { Game } from '../types/game'
import { TileArt } from './TileArt'

type GameMosaicProps = {
  onPlay: (game: Game) => void
}

type PlacedTile = {
  game: Game
  cols: number
  rows: number
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

export function GameMosaic({ onPlay }: GameMosaicProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  const tiles = useMemo(() => layoutMosaic(query.trim() ? searchGames(query) : games), [query])

  const closeSearch = () => {
    setQuery('')
    setSearchOpen(false)
  }

  return (
    <div className="mosaic">
      <div className={`mosaic-cell mosaic-span-c${searchOpen ? 3 : 1} mosaic-span-r1`}>
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
                  if (e.key === 'Escape') closeSearch()
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

      {tiles.map(({ game, cols, rows }) => (
        <div key={game.id} className={`mosaic-cell mosaic-span-c${cols} mosaic-span-r${rows}`}>
          <button type="button" className="mosaic-tile" aria-label={`Play ${game.name}`} onClick={() => onPlay(game)}>
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
        </div>
      ))}

      {tiles.length === 0 && <p className="mosaic-empty">No games match “{query.trim()}”.</p>}
    </div>
  )
}
