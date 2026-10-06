import { useMemo, useState } from 'react'
import {
  leaderboardForPeriod,
  type LeaderboardPeriod,
  type LeaderboardRow,
} from '../data/portalContent'
import { getRecentlyPlayed } from '../utils/portalStorage'

const PERIODS: { id: LeaderboardPeriod; label: string }[] = [
  { id: 'global', label: 'Global' },
  { id: 'today', label: 'Today' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'allTime', label: 'All Time' },
]

type LeaderboardSectionProps = {
  onViewFull: () => void
}

function medal(rank: number) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return rank
}

function Row({ row }: { row: LeaderboardRow }) {
  const highlight = row.player === 'You'
  return (
    <tr
      className={`border-b border-white/[0.04] text-[11px] sm:text-xs ${highlight ? 'bg-[#e84a9a]/8' : ''}`}
    >
      <td className="py-2 pl-2 font-display font-bold text-zinc-300">{medal(row.rank)}</td>
      <td className="py-2 font-medium text-white">{row.player}</td>
      <td className="hidden py-2 text-zinc-500 sm:table-cell">{row.gamesPlayed}</td>
      <td className="py-2 text-[#ffc947]">{row.score.toLocaleString()}</td>
      <td className="hidden py-2 text-zinc-500 md:table-cell">{row.wins}</td>
      <td className="hidden py-2 pr-2 text-zinc-500 lg:table-cell">Lv {row.level}</td>
    </tr>
  )
}

export function LeaderboardSection({ onViewFull }: LeaderboardSectionProps) {
  const [period, setPeriod] = useState<LeaderboardPeriod>('global')
  const rows = useMemo(() => leaderboardForPeriod(period).slice(0, 10), [period])
  const recent = getRecentlyPlayed()
  const you = rows.find((r) => r.player === 'You')

  return (
    <section id="section-leaderboard" className="lobby-section-in mb-8 sm:mb-9" aria-label="Leaderboard">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xs font-bold uppercase tracking-[0.16em] text-white sm:text-sm">
            Global Leaderboard
          </h2>
          <p className="mt-0.5 text-[11px] text-zinc-500">Sample rankings · connect API when ready</p>
        </div>
        <button
          type="button"
          onClick={onViewFull}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400 transition-colors hover:border-[#e84a9a]/30 hover:text-white"
        >
          View full
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
        <div className="glass-panel overflow-hidden rounded-xl">
          <div className="flex gap-1 overflow-x-auto border-b border-white/[0.06] p-2">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${period === p.id ? 'bg-[#e84a9a]/15 text-white' : 'text-zinc-500'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-left">
              <thead>
                <tr className="text-[9px] uppercase tracking-wider text-zinc-600">
                  <th className="py-2 pl-2">Rank</th>
                  <th className="py-2">Player</th>
                  <th className="hidden py-2 sm:table-cell">Played</th>
                  <th className="py-2">Score</th>
                  <th className="hidden py-2 md:table-cell">Wins</th>
                  <th className="hidden py-2 pr-2 lg:table-cell">Level</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <Row key={`${period}-${row.rank}`} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-[#e84a9a]">
            Your stats
          </p>
          <dl className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between gap-2">
              <dt className="text-zinc-500">Rank</dt>
              <dd className="font-semibold text-white">#{you?.rank ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-zinc-500">Games played</dt>
              <dd className="text-white">{you?.gamesPlayed ?? recent.length}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-zinc-500">Recent score</dt>
              <dd className="text-[#ffc947]">{you?.score.toLocaleString() ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-zinc-500">Favorite game</dt>
              <dd className="truncate text-white">{recent[0]?.name ?? '—'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

export function LeaderboardFullModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [period, setPeriod] = useState<LeaderboardPeriod>('global')
  const rows = useMemo(() => leaderboardForPeriod(period), [period])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[45] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/75" aria-label="Close" onClick={onClose} />
      <div className="relative max-h-[85dvh] w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#12101f]">
        <header className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
          <h2 className="font-display text-sm font-bold uppercase text-white">Full leaderboard</h2>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white">
            ✕
          </button>
        </header>
        <div className="flex gap-1 overflow-x-auto border-b border-white/[0.06] p-2">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${period === p.id ? 'bg-[#e84a9a]/15 text-white' : 'text-zinc-500'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="max-h-[60dvh] overflow-auto p-2">
          <table className="w-full text-left text-xs">
            <tbody>
              {rows.map((row) => (
                <Row key={`full-${period}-${row.rank}`} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
