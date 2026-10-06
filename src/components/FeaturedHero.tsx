import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { featuredSliderGames } from '../data/games'
import type { Game } from '../types/game'
import { StarRating } from './PortalSections'
import { PlayButton } from './PlayButton'

const AUTO_MS = 6000

type FeaturedHeroProps = {
  onPlay: (game: Game) => void
  onDetail: (game: Game) => void
  reducedMotionPref?: boolean
}

const slides = featuredSliderGames

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function FeaturedHero({ onPlay, onDetail, reducedMotionPref = false }: FeaturedHeroProps) {
  const systemReduced = useReducedMotion()
  const reduced = reducedMotionPref || systemReduced

  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})

  const sliderRef = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const parallaxRaf = useRef(0)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const game = slides[index] ?? slides[0]
  const count = slides.length

  const go = useCallback(
    (next: number) => {
      if (count <= 1) return
      setIndex((next + count) % count)
    },
    [count],
  )

  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  useEffect(() => {
    const nextIdx = (index + 1) % count
    const img = new Image()
    img.src = slides[nextIdx]?.image ?? ''
  }, [index, count])

  useEffect(() => {
    if (count <= 1 || hovered || reduced) return

    autoplayRef.current = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      setIndex((i) => (i + 1) % count)
    }, AUTO_MS)

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
    }
  }, [count, hovered, reduced, index])

  useEffect(() => {
    const el = sliderRef.current
    if (!el || reduced) return

    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return

    let px = 0
    let py = 0
    let cx = 0
    let cy = 0
    let scheduled = false

    const flush = () => {
      scheduled = false
      el.style.setProperty('--hero-px', px.toFixed(4))
      el.style.setProperty('--hero-py', py.toFixed(4))
      const glow = glowRef.current
      if (glow) {
        glow.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
      }
    }

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      cx = e.clientX - rect.left
      cy = e.clientY - rect.top
      px = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      py = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      if (!scheduled) {
        scheduled = true
        parallaxRaf.current = requestAnimationFrame(flush)
      }
    }

    el.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      el.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(parallaxRaf.current)
    }
  }, [reduced])

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? 0
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current
    if (Math.abs(dx) < 48) return
    if (dx < 0) next()
    else prev()
  }

  if (!game) return null

  const slideMotion = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.35 },
      }
    : {
        initial: { opacity: 0, x: 20, scale: 1.03 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: -20, scale: 1.01 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
      }

  return (
    <section
      ref={sliderRef}
      className="featured-slider glass-panel relative mb-7 w-full rounded-2xl sm:mb-9"
      aria-label="Featured games"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div ref={glowRef} className="featured-slider-glow pointer-events-none absolute z-[1]" aria-hidden />

      <div className="featured-slider-grid relative z-[2] grid overflow-hidden rounded-2xl md:grid-cols-[1.35fr_0.65fr]">
        <div className="featured-slider-media relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={`bg-${game.id}`} className="absolute inset-0" {...slideMotion}>
              {!loaded[game.id] && (
                <div className="featured-slider-shimmer absolute inset-0 bg-[#1a1730]" aria-hidden />
              )}
              <div
                className="featured-slider-art absolute inset-[-6%]"
                style={
                  reduced
                    ? undefined
                    : {
                        transform:
                          'translate3d(calc(var(--hero-px, 0) * 6px), calc(var(--hero-py, 0) * 4px), 0) scale(1.06)',
                      }
                }
              >
                <img
                  src={game.image}
                  alt=""
                  className={`h-full w-full object-cover transition-opacity duration-500 ${loaded[game.id] ? 'opacity-100' : 'opacity-0'}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  onLoad={() => setLoaded((m) => ({ ...m, [game.id]: true }))}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#07070f] via-[#07070f]/35 to-transparent md:bg-gradient-to-r md:from-[#07070f]/20 md:via-[#07070f]/50 md:to-[#12101f]/95" />
          <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_30%_20%,rgba(232,74,154,0.12),transparent_55%)]" />

          {count > 1 && (
            <>
              <button
                type="button"
                className="featured-slider-arrow featured-slider-arrow-media left-3"
                aria-label="Previous slide"
                onClick={prev}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <button
                type="button"
                className="featured-slider-arrow featured-slider-arrow-media right-3"
                aria-label="Next slide"
                onClick={next}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="relative z-[3] flex flex-col justify-center border-t border-white/[0.06] p-5 sm:p-6 md:border-l md:border-t-0 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`copy-${game.id}`}
              variants={stagger}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="flex flex-col gap-3.5 sm:gap-4"
            >
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-[#ffc947]/25 bg-[#07070f]/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#ffc947]">
                  Featured
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.26em] text-[#e84a9a]">Spotlight</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-display text-xl font-extrabold uppercase leading-tight tracking-wide text-white sm:text-2xl lg:text-[1.75rem]"
              >
                {game.name}
              </motion.h1>

              <motion.p variants={fadeUp} className="max-w-md text-sm leading-relaxed text-zinc-500">
                {game.tagline}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-semibold uppercase tracking-wide text-zinc-400">
                  {game.category}
                </span>
                <StarRating gameId={game.id} />
                {game.popular && (
                  <span className="font-semibold uppercase tracking-wide text-[#ffc947]">Popular</span>
                )}
                {game.isNew && (
                  <span className="font-semibold uppercase tracking-wide text-[#e84a9a]">New</span>
                )}
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-2.5 pt-1">
                <PlayButton glow={game.glow} onClick={() => onPlay(game)} label="Play now" />
                <button
                  type="button"
                  onClick={() => onDetail(game)}
                  className="glass-icon-btn rounded-lg px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-300 hover:text-white sm:text-[11px]"
                >
                  Details
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {count > 1 && (
        <>
          <div className="featured-slider-controls pointer-events-none absolute inset-x-0 bottom-4 z-[4] flex flex-col items-center justify-center gap-2 px-4">
            <div className="featured-slider-progress pointer-events-auto w-full max-w-xs overflow-hidden rounded-full bg-white/10">
              <div
                key={`progress-${index}`}
                className={`featured-slider-progress-fill h-0.5 rounded-full bg-gradient-to-r from-[#ffc947] to-[#e84a9a] ${hovered || reduced ? 'paused' : ''}`}
                style={{ animationDuration: `${AUTO_MS}ms` }}
              />
            </div>
            <div className="pointer-events-auto flex items-center justify-center gap-1.5" role="tablist" aria-label="Slides">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Slide ${i + 1}: ${s.name}`}
                  onClick={() => go(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? 'w-6 bg-[#e84a9a]' : 'w-2 bg-white/25 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
