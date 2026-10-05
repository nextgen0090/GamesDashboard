import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { useModalGameLayout } from '../hooks/useModalGameLayout'
import type { Game } from '../types/game'
import { MODAL_PAD_PX } from '../utils/gameViewport'
import { GamePlayerViewport } from './GamePlayerViewport'

type GamePlayerModalProps = {
  game: Game | null
  onClose: () => void
}

export function GamePlayerModal({ game, onClose }: GamePlayerModalProps) {
  const [loading, setLoading] = useState(true)
  const layout = useModalGameLayout(game)

  useEffect(() => {
    if (game) setLoading(true)
  }, [game])

  useEffect(() => {
    if (!game) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [game, onClose])

  const handleLoad = useCallback(() => setLoading(false), [])

  return (
    <AnimatePresence mode="wait">
      {game && (
        <motion.div
          key="game-modal-root"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ padding: MODAL_PAD_PX }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <motion.button
            type="button"
            aria-label="Close game"
            className="absolute inset-0 bg-[#050208]/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-player-title"
            className="relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#120a20]/95 shadow-2xl backdrop-blur-xl"
            style={{
              width: layout.width,
              height: layout.height,
              maxWidth: '98vw',
              maxHeight: '94dvh',
              boxShadow: `0 0 0 1px color-mix(in srgb, ${game.glow} 25%, transparent), 0 0 80px color-mix(in srgb, ${game.glow} 18%, transparent), 0 30px 60px -20px rgba(0,0,0,0.85)`,
            }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffc947] to-transparent opacity-70"
              aria-hidden
            />

            <header className="flex h-[52px] shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] px-4 sm:px-5">
              <div className="min-w-0">
                <p className="font-display text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff2d95]">
                  Now Playing
                </p>
                <h2
                  id="game-player-title"
                  className="truncate font-display text-sm font-bold uppercase tracking-wide text-white sm:text-base"
                >
                  {game.name}
                </h2>
              </div>
              <motion.button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400 transition-colors hover:border-[#ff2d95]/40 hover:text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </motion.button>
            </header>

            <div
              className="relative shrink-0 overflow-hidden bg-black"
              style={{ width: layout.gameWidth, height: layout.gameHeight }}
            >
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    key="loader"
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-[#0a0614]"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="h-16 w-16 rounded-full border-2 border-white/10"
                        style={{ borderTopColor: game.glow, borderRightColor: '#ffc947' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
                      />
                      <div
                        className="absolute inset-2 rounded-full opacity-40 blur-md"
                        style={{ background: game.glow }}
                      />
                    </div>
                    <p className="font-display text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Loading WebGL
                    </p>
                    <div className="h-1 w-44 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#ffc947] via-[#ff2d95] to-[#b026ff]"
                        initial={{ width: '8%' }}
                        animate={{ width: '92%' }}
                        transition={{ duration: 2.2, ease: 'easeInOut' }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <GamePlayerViewport
                game={game}
                width={layout.gameWidth}
                height={layout.gameHeight}
                onLoad={handleLoad}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
