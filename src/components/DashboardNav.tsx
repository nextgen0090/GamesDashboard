import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { games, searchGames } from '../data/games'
import { PORTAL_NOTIFICATIONS } from '../data/portalContent'
import type { Game } from '../types/game'

type DashboardNavProps = {
  shellClass: string
  pageTitle: string
  searchQuery: string
  onSearchChange: (q: string) => void
  onSearchPick: (game: Game) => void
  onMenuOpen: () => void
}

export function DashboardNav({
  shellClass,
  pageTitle,
  searchQuery,
  onSearchChange,
  onSearchPick,
  onMenuOpen,
}: DashboardNavProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const results =
    searchQuery.trim().length >= 1 ? searchGames(searchQuery).slice(0, 6) : []

  return (
    <nav className="glass-nav sticky top-0 z-20 w-full border-b border-white/[0.08]">
      <div
        className={`flex w-full min-w-0 flex-wrap items-center gap-2 py-2.5 sm:gap-3 sm:py-3 ${shellClass}`}
      >
        <button
          type="button"
          onClick={onMenuOpen}
          className="glass-icon-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-300 hover:text-white"
          aria-label="Open portal menu"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#ffc947]/20 bg-white/[0.04] sm:flex"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-[#ffc947]" role="presentation">
              <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-display truncate text-sm font-bold tracking-wide text-white">{pageTitle}</p>
            <p className="truncate text-[9px] uppercase tracking-[0.2em] text-zinc-500">WebGL Lobby</p>
          </div>
        </div>

        <div ref={searchRef} className="relative order-3 w-full sm:order-none sm:mx-auto sm:max-w-xs sm:flex-1">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search games…"
            className="glass-input w-full rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600"
            aria-label="Search games"
          />
          <AnimatePresence>
            {results.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="glass-panel absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg"
              >
                {results.map((g) => (
                  <li key={g.id}>
                    <button
                      type="button"
                      className="flex w-full px-3 py-2 text-left text-xs text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                      onClick={() => {
                        onSearchPick(g)
                        onSearchChange('')
                      }}
                    >
                      {g.name}
                      <span className="ml-2 text-zinc-600">{g.category}</span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <span className="hidden rounded-full border border-[#ffc947]/20 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-[#ffc947] sm:inline">
            1,250
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              className="glass-icon-btn flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-white"
              aria-label="Notifications"
            >
              🔔
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.22 }}
                  className="glass-panel absolute right-0 top-full z-30 mt-1 w-64 rounded-lg p-2"
                >
                  {PORTAL_NOTIFICATIONS.map((n) => (
                    <div key={n.id} className="border-b border-white/[0.05] px-2 py-2 last:border-0">
                      <p className="text-xs font-medium text-white">{n.title}</p>
                      <p className="text-[10px] text-zinc-500">{n.body}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e84a9a]/30 bg-[#e84a9a]/15 text-[10px] font-bold text-white"
            title="Guest player"
          >
            GM
          </div>
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400/85 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/90" />
            {games.length} live
          </span>
        </div>
      </div>
    </nav>
  )
}
