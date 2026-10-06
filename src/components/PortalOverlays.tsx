import { AnimatePresence, motion } from 'framer-motion'
import type { Game } from '../types/game'
import { PlayButton } from './PlayButton'
import { RateStarsInline, StarRating } from './PortalSections'
import type { PortalSettings } from '../utils/portalStorage'

export type ArticlePayload = { title: string; body: string; tag?: string; date?: string }

const overlayBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25 },
}

const panelSlideUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
}

const drawerSlide = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { type: 'spring' as const, stiffness: 360, damping: 34 },
}

export function ArticleModal({
  article,
  onClose,
}: {
  article: ArticlePayload | null
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {article && (
        <div className="fixed inset-0 z-[45] flex items-end justify-center sm:items-center sm:p-4" role="dialog">
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-[3px]"
            aria-label="Close"
            onClick={onClose}
            {...overlayBackdrop}
          />
          <motion.div
            className="glass-panel relative max-h-[85dvh] w-full max-w-lg overflow-auto rounded-t-xl p-5 sm:rounded-xl"
            {...panelSlideUp}
          >
            {article.tag && (
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#e84a9a]">
                {article.tag} {article.date ? `· ${article.date}` : ''}
              </p>
            )}
            <h2 className="mt-1 font-display text-lg font-bold text-white">{article.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{article.body}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 text-[10px] font-bold uppercase tracking-wide text-zinc-500 hover:text-white"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function SettingsPanel({
  open,
  settings,
  onChange,
  onClose,
}: {
  open: boolean
  settings: PortalSettings
  onChange: (s: PortalSettings) => void
  onClose: () => void
}) {
  const toggle = (key: keyof PortalSettings) => {
    onChange({ ...settings, [key]: !settings[key] })
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[45] flex justify-end" role="dialog" aria-label="Settings">
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={onClose}
            aria-label="Close"
            {...overlayBackdrop}
          />
          <motion.div className="glass-panel relative h-full w-full max-w-sm border-l p-5" {...drawerSlide}>
            <h2 className="font-display text-sm font-bold uppercase text-white">Settings</h2>
            <p className="mt-1 text-xs text-zinc-500">Dashboard only — does not affect WebGL games.</p>
            <ul className="mt-5 space-y-3 text-sm">
              {(
                [
                  ['soundUi', 'UI sound effects'],
                  ['reducedAnimations', 'Reduced animations'],
                  ['backgroundEffects', 'Background effects'],
                  ['compactCards', 'Compact cards'],
                ] as const
              ).map(([key, label]) => (
                <li key={key} className="flex items-center justify-between gap-3">
                  <span className="text-zinc-300">{label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings[key]}
                    onClick={() => toggle(key)}
                    className={`h-6 w-11 rounded-full border transition-colors duration-200 ${settings[key] ? 'border-[#e84a9a]/40 bg-[#e84a9a]/25' : 'border-white/15 bg-[#07070f]/80'}`}
                  >
                    <span
                      className={`block h-5 w-5 rounded-full bg-white transition-transform duration-200 ${settings[key] ? 'translate-x-5' : 'translate-x-0.5'}`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function GameDetailDrawer({
  game,
  isFavorite,
  onClose,
  onPlay,
  onToggleFavorite,
  onRated,
}: {
  game: Game | null
  isFavorite: boolean
  onClose: () => void
  onPlay: (game: Game) => void
  onToggleFavorite: (id: string) => void
  onRated: () => void
}) {
  return (
    <AnimatePresence>
      {game && (
        <div className="fixed inset-0 z-[40] flex justify-end" role="dialog" aria-label="Game details">
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
            aria-label="Close"
            {...overlayBackdrop}
          />
          <motion.div className="glass-panel relative h-full w-full max-w-md overflow-auto border-l p-5" {...drawerSlide}>
            <img src={game.image} alt="" className="aspect-video w-full rounded-lg object-cover" />
            <div className="mt-4 flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#e84a9a]">{game.category}</p>
                <h2 className="font-display text-lg font-bold uppercase text-white">{game.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => onToggleFavorite(game.id)}
                className={`text-xl transition-transform duration-200 hover:scale-110 ${isFavorite ? 'text-[#e84a9a]' : 'text-zinc-600'}`}
                aria-label="Toggle favorite"
              >
                ♥
              </button>
            </div>
            <p className="mt-2 text-sm text-zinc-400">{game.tagline}</p>
            <div className="mt-3">
              <StarRating gameId={game.id} />
            </div>
            <div className="mt-2">
              <RateStarsInline game={game} onRated={onRated} />
            </div>
            <div className="mt-6">
              <PlayButton glow={game.glow} onClick={() => onPlay(game)} label="Play now" fullWidth />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function HelpTopicModal({ topic, onClose }: { topic: string | null; onClose: () => void }) {
  const body =
    topic === 'Game loading help'
      ? 'Wait for the WebGL loader in the game modal. Slow networks may need a few extra seconds on first visit.'
      : topic === 'Read FAQ'
        ? 'Open FAQ from the portal menu for quick answers about play, favorites, and ratings.'
        : 'Use the Feedback page with the relevant type. Submissions are stored locally until an API is connected.'

  return (
    <AnimatePresence>
      {topic && (
        <div className="fixed inset-0 z-[45] flex items-center justify-center p-4">
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/65 backdrop-blur-[3px]"
            onClick={onClose}
            aria-label="Close"
            {...overlayBackdrop}
          />
          <motion.div className="glass-panel relative max-w-md rounded-xl p-5" {...panelSlideUp}>
            <h2 className="font-display text-sm font-bold text-white">{topic}</h2>
            <p className="mt-2 text-sm text-zinc-400">{body}</p>
            <button type="button" onClick={onClose} className="mt-4 text-xs font-bold uppercase text-[#e84a9a]">
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
