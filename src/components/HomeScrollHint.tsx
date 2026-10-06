import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

const SHOW_AFTER_MS = 650
const VISIBLE_MS = 3000
const EXIT_MS = 480

const CHEVRON = 'M6 10l6 6 6-6'

function ScrollChevronStack() {
  return (
    <svg
      viewBox="0 0 24 28"
      className="home-scroll-hint-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path className="home-scroll-hint-chevron home-scroll-hint-chevron--trail-2" d={CHEVRON} transform="translate(0 -8)" />
      <path className="home-scroll-hint-chevron home-scroll-hint-chevron--trail-1" d={CHEVRON} transform="translate(0 -4)" />
      <path className="home-scroll-hint-chevron home-scroll-hint-chevron--lead" d={CHEVRON} />
    </svg>
  )
}

export function HomeScrollHint() {
  const [phase, setPhase] = useState<'waiting' | 'show' | 'hide' | 'done'>('waiting')

  const dismiss = useCallback(() => setPhase((p) => (p === 'done' || p === 'hide' ? p : 'hide')), [])

  useEffect(() => {
    const t = window.setTimeout(() => setPhase('show'), SHOW_AFTER_MS)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase !== 'show') return
    const t = window.setTimeout(() => setPhase('hide'), VISIBLE_MS)
    return () => window.clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'hide') return
    const t = window.setTimeout(() => setPhase('done'), EXIT_MS)
    return () => window.clearTimeout(t)
  }, [phase])

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 36) dismiss()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismiss])

  const scrollDown = () => {
    dismiss()
    window.scrollBy({
      top: Math.min(window.innerHeight * 0.4, 500),
      behavior: 'smooth',
    })
  }

  if (phase === 'done') return null

  return (
    <AnimatePresence mode="wait">
      {phase === 'show' || phase === 'hide' ? (
        <motion.div
          key="scroll-arrow-hint"
          className="home-scroll-hint-wrap"
          initial={{ opacity: 0, scale: 0.5, y: -8 }}
          animate={
            phase === 'hide'
              ? { opacity: 0, scale: 0.65, y: 16 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <button type="button" className="home-scroll-hint-btn" onClick={scrollDown} aria-label="Scroll down">
            <motion.span
              className="home-scroll-hint-btn-inner"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 0.95, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ScrollChevronStack />
            </motion.span>
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
