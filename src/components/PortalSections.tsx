import { useState, type FormEvent } from 'react'
import { games } from '../data/games'
import {
  displayRating,
  FAQ_ITEMS,
  NEWS_ARTICLES,
  PORTAL_UPDATES,
  type NewsArticle,
  type PortalUpdate,
} from '../data/portalContent'
import { saveFeedback, getUserRating, setUserRating } from '../utils/portalStorage'
import type { Game } from '../types/game'

type ArticlePayload = { title: string; body: string; tag?: string; date?: string }

export function UpdatesSection({ onOpenArticle }: { onOpenArticle: (a: ArticlePayload) => void }) {
  return (
    <section id="section-updates" className="lobby-section-in mb-8 sm:mb-9" aria-label="Game updates">
      <h2 className="font-display text-xs font-bold uppercase tracking-[0.16em] text-white sm:text-sm">
        Game updates
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PORTAL_UPDATES.map((u: PortalUpdate) => (
          <button
            key={u.id}
            type="button"
            onClick={() =>
              onOpenArticle({ title: u.title, body: u.body, tag: u.kind, date: u.date })
            }
            className="rounded-lg border border-white/[0.07] bg-[#12101f]/80 p-3 text-left transition-colors hover:border-white/12"
          >
            <p className="text-[9px] font-bold uppercase tracking-wider text-[#e84a9a]">{u.kind}</p>
            <p className="mt-1 text-sm font-semibold text-white">{u.title}</p>
            <p className="mt-1 text-[11px] text-zinc-500">{u.summary}</p>
            <p className="mt-2 text-[10px] text-zinc-600">{u.date}</p>
          </button>
        ))}
      </div>
    </section>
  )
}

export function NewsSection({ onOpenArticle }: { onOpenArticle: (a: ArticlePayload) => void }) {
  return (
    <section id="section-news" className="lobby-section-in mb-8 sm:mb-9" aria-label="Latest news">
      <h2 className="font-display text-xs font-bold uppercase tracking-[0.16em] text-white sm:text-sm">
        From the lobby
      </h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {NEWS_ARTICLES.map((n: NewsArticle) => (
          <article
            key={n.id}
            className="rounded-lg border border-white/[0.07] bg-[#12101f]/80 p-4"
          >
            <p className="text-[9px] font-bold uppercase tracking-wider text-[#ffc947]">
              {n.tag} · {n.date}
            </p>
            <h3 className="mt-1 font-display text-sm font-bold text-white">{n.title}</h3>
            <p className="mt-2 text-xs text-zinc-500">{n.excerpt}</p>
            <button
              type="button"
              onClick={() => onOpenArticle({ title: n.title, body: n.body, tag: n.tag, date: n.date })}
              className="mt-3 text-[10px] font-bold uppercase tracking-wide text-[#e84a9a] hover:text-white"
            >
              Read more
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export function FeedbackSection() {
  const [type, setType] = useState('General')
  const [gameId, setGameId] = useState('')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    saveFeedback({
      type,
      gameId: gameId || null,
      rating,
      message,
    })
    if (gameId) setUserRating(gameId, rating)
    setSent(true)
    setMessage('')
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section id="section-feedback" className="lobby-section-in mb-8 sm:mb-9" aria-label="Feedback">
      <h2 className="font-display text-xs font-bold uppercase tracking-[0.16em] text-white sm:text-sm">
        Feedback
      </h2>
      <form
        onSubmit={submit}
        className="glass-panel mx-auto mt-3 w-full max-w-xl rounded-xl p-4"
      >
        <label className="block text-[10px] uppercase tracking-wide text-zinc-500">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-[#07070f] px-3 py-2 text-sm text-white"
        >
          {['General', 'Game Issue', 'Suggestion', 'UI/UX', 'New Game Request'].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <label className="mt-3 block text-[10px] uppercase tracking-wide text-zinc-500">Game</label>
        <select
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-[#07070f] px-3 py-2 text-sm text-white"
        >
          <option value="">Optional</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <label className="mt-3 block text-[10px] uppercase tracking-wide text-zinc-500">Rating</label>
        <div className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              className={`text-lg ${s <= rating ? 'text-[#ffc947]' : 'text-zinc-600'}`}
              aria-label={`${s} stars`}
            >
              ★
            </button>
          ))}
        </div>

        <label className="mt-3 block text-[10px] uppercase tracking-wide text-zinc-500">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={3}
          className="mt-1 w-full rounded-lg border border-white/10 bg-[#07070f] px-3 py-2 text-sm text-white"
        />

        <button
          type="submit"
          className="mt-4 rounded-lg bg-gradient-to-r from-[#ffc947] to-[#ffb020] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#07070f]"
        >
          Submit feedback
        </button>
        {sent && (
          <p className="mt-2 text-xs text-emerald-400/90">Thanks — feedback saved locally.</p>
        )}
      </form>
    </section>
  )
}

export function FAQSection() {
  const [open, setOpen] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null)

  return (
    <section id="section-faq" className="lobby-section-in mb-8 sm:mb-9" aria-label="FAQ">
      <h2 className="font-display text-xs font-bold uppercase tracking-[0.16em] text-white sm:text-sm">
        FAQ
      </h2>
      <ul className="mx-auto mt-3 max-w-2xl space-y-2">
        {FAQ_ITEMS.map((item) => {
          const isOpen = open === item.id
          return (
            <li key={item.id} className="rounded-lg border border-white/[0.07] bg-[#12101f]/80">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-white"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
              >
                {item.q}
                <span className="text-zinc-500">{isOpen ? '−' : '+'}</span>
              </button>
              <div
                className={`faq-panel overflow-hidden px-4 text-xs text-zinc-500 transition-all duration-200 ${isOpen ? 'max-h-40 pb-3 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                {item.a}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function HelpSection({ onOpenHelp }: { onOpenHelp: (topic: string) => void }) {
  const links = [
    'Report game problem',
    'Send feedback',
    'Read FAQ',
    'Game loading help',
  ]
  return (
    <section id="section-help" className="lobby-section-in mb-8 sm:mb-9" aria-label="Help">
      <h2 className="font-display text-xs font-bold uppercase tracking-[0.16em] text-white sm:text-sm">
        Need help?
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => onOpenHelp(label)}
            className="rounded-lg border border-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-400 hover:border-[#e84a9a]/25 hover:text-white"
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}

type FooterTarget = import('../portal/pages').PortalPage | 'scroll-faq'

export function PortalFooter({
  onNavigate,
  onScrollToFaq,
}: {
  onNavigate: (page: import('../portal/pages').PortalPage) => void
  onScrollToFaq: () => void
}) {
  const links: [string, FooterTarget][] = [
    ['Games', 'games'],
    ['Leaderboard', 'leaderboard'],
    ['New Games', 'new'],
    ['Updates', 'updates'],
    ['FAQ', 'scroll-faq'],
    ['Feedback', 'feedback'],
  ]

  return (
    <footer
      id="section-footer"
      className="lobby-section-in border-t border-white/[0.06] pt-6 pb-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="font-display text-sm font-bold text-white">WebGL Lobby</p>
          <p className="mt-1 text-[10px] text-zinc-600">
            Build {__APP_BUILD_TIME__.slice(0, 10)} · Portal UI
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-2">
          {links.map(([label, target]) => (
            <button
              key={`${label}-${target}`}
              type="button"
              onClick={() => {
                if (target === 'scroll-faq') onScrollToFaq()
                else onNavigate(target)
              }}
              className="text-[10px] uppercase tracking-wide text-zinc-500 hover:text-zinc-300"
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
      <p className="mt-4 text-[10px] text-zinc-600">
        Privacy & Terms — internal placeholders. Games play inside this dashboard only.
      </p>
    </footer>
  )
}

export function StarRating({ gameId }: { gameId: string }) {
  const current = getUserRating(gameId)
  const shown = displayRating(gameId, current)
  return (
    <span className="text-[10px] text-zinc-400">
      <span className="text-[#ffc947]">★</span> {shown.toFixed(1)}
      {current != null && <span className="text-zinc-600"> · you {current}★</span>}
    </span>
  )
}

export function RateStarsInline({
  game,
  onRated,
}: {
  game: Game
  onRated: () => void
}) {
  const current = getUserRating(game.id)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => {
            setUserRating(game.id, s)
            onRated()
          }}
          className={`text-base leading-none ${s <= (current ?? 0) ? 'text-[#ffc947]' : 'text-zinc-600 hover:text-zinc-400'}`}
          aria-label={`Rate ${s}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
