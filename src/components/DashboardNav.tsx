import { motion } from 'framer-motion'
import { games } from '../data/games'

type DashboardNavProps = {
  contentMaxClass: string
}

export function DashboardNav({ contentMaxClass }: DashboardNavProps) {
  return (
    <motion.nav
      className="sticky top-0 z-20 w-full border-b border-white/[0.06] bg-[#0a0614]/80 py-3 backdrop-blur-xl sm:py-3.5"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`mx-auto flex w-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 ${contentMaxClass}`}>
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#ffc947]/25 bg-gradient-to-br from-[#ff2d95]/25 to-[#b026ff]/25 shadow-[0_0_18px_rgba(255,45,149,0.2)]"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#ffc947]" role="presentation">
              <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-display truncate text-sm font-bold tracking-wide text-white">
              WebGL Lobby
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#ff2d95]/85">
              Premium
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-500 sm:inline">
            {games.length} Live
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/18 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400/90">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            Online
          </span>
        </div>
      </div>
    </motion.nav>
  )
}
