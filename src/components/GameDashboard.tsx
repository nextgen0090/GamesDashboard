import { AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { games } from '../data/games'
import { PAGE_TITLES, type PortalPage } from '../portal/pages'
import type { Game } from '../types/game'
import {
  addRecentlyPlayed,
  getFavorites,
  getRecentlyPlayed,
  getSettings,
  saveSettings,
  toggleFavorite,
  type PortalSettings,
} from '../utils/portalStorage'
import { AmbientBackground } from './AmbientBackground'
import { DashboardNav } from './DashboardNav'
import { GamePlayerModal } from './GamePlayerModal'
import { LeaderboardFullModal } from './LeaderboardSection'
import {
  ArticleModal,
  GameDetailDrawer,
  HelpTopicModal,
  type ArticlePayload,
} from './PortalOverlays'
import { PortalCursor } from './PortalCursor'
import { PortalPageLoader } from './PortalPageLoader'
import { PortalPageViews } from './PortalPageViews'
import { PortalSideMenu } from './PortalSideMenu'
import { PORTAL_CONTENT, PORTAL_SHELL } from '../portal/layout'

export function GameDashboard() {
  const [page, setPage] = useState<PortalPage>('home')
  const [contentPage, setContentPage] = useState<PortalPage>('home')
  const [pageLoading, setPageLoading] = useState(false)
  const pageLoadTimer = useRef(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeGame, setActiveGame] = useState<Game | null>(null)
  const [detailGame, setDetailGame] = useState<Game | null>(null)
  const [category, setCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<string[]>(() => getFavorites())
  const [recent, setRecent] = useState(() => getRecentlyPlayed())
  const [settings, setSettings] = useState<PortalSettings>(() => getSettings())
  const [article, setArticle] = useState<ArticlePayload | null>(null)
  const [helpTopic, setHelpTopic] = useState<string | null>(null)
  const [leaderboardFull, setLeaderboardFull] = useState(false)
  const [, setRatingTick] = useState(0)
  const [finePointer, setFinePointer] = useState(false)
  const cursorGlowRef = useRef<HTMLDivElement>(null)
  const pointerRaf = useRef(0)
  const mainRef = useRef<HTMLElement>(null)

  const favoriteSet = useMemo(() => new Set(favorites), [favorites])

  const handlePlay = useCallback((game: Game) => {
    setRecent(addRecentlyPlayed(game))
    setActiveGame(game)
  }, [])

  const handleToggleFavorite = useCallback((id: string) => {
    setFavorites(toggleFavorite(id))
  }, [])

  const scrollPortalTop = useCallback((behavior: ScrollBehavior = 'auto') => {
    window.scrollTo({ top: 0, left: 0, behavior })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    mainRef.current?.scrollTo({ top: 0, left: 0, behavior })
  }, [])

  const scrollToFaq = useCallback(() => {
    const behavior = settings.reducedAnimations ? ('auto' as const) : ('smooth' as const)
    document.getElementById('section-faq')?.scrollIntoView({ behavior, block: 'start' })
  }, [settings.reducedAnimations])

  const navigate = useCallback(
    (next: PortalPage) => {
      if (next === 'favorites') setCategory('Favorites')
      if (next === 'games' && category === 'Favorites' && page === 'favorites') setCategory('All')

      if (next === 'faq') {
        setPage(next)
        setContentPage(next)
        requestAnimationFrame(() => scrollToFaq())
        return
      }

      const scrollTop = () => {
        scrollPortalTop(settings.reducedAnimations ? 'auto' : 'smooth')
      }

      if (next === page && !pageLoading) {
        scrollTop()
        return
      }

      window.clearTimeout(pageLoadTimer.current)
      setPage(next)
      scrollTop()

      if (settings.reducedAnimations) {
        setPageLoading(false)
        setContentPage(next)
        return
      }

      setPageLoading(true)
      pageLoadTimer.current = window.setTimeout(() => {
        setContentPage(next)
        setPageLoading(false)
      }, 480)
    },
    [category, page, pageLoading, scrollPortalTop, scrollToFaq, settings.reducedAnimations],
  )

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    setPage('home')
    setContentPage('home')
    setPageLoading(false)

    const snapTop = () => scrollPortalTop('auto')
    snapTop()
    const raf = requestAnimationFrame(snapTop)
    const t = window.setTimeout(snapTop, 0)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
      window.clearTimeout(pageLoadTimer.current)
    }
  }, [scrollPortalTop])

  useEffect(() => {
    if (pageLoading || contentPage === 'faq') return
    scrollPortalTop('auto')
  }, [contentPage, pageLoading, scrollPortalTop])

  useEffect(() => {
    saveSettings(settings)
    document.documentElement.classList.toggle('portal-reduced-motion', settings.reducedAnimations)
    document.documentElement.classList.toggle('portal-compact', settings.compactCards)
  }, [settings])

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const update = () => setFinePointer(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--lobby-px', '0')
    root.style.setProperty('--lobby-py', '0')

    let mx = 0
    let my = 0
    let cx = 0
    let cy = 0
    let scheduled = false

    const flush = () => {
      scheduled = false
      root.style.setProperty('--lobby-px', mx.toFixed(4))
      root.style.setProperty('--lobby-py', my.toFixed(4))
      const glow = cursorGlowRef.current
      if (glow) {
        glow.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
      }
    }

    const onMove = (e: MouseEvent) => {
      cx = e.clientX
      cy = e.clientY
      mx = (e.clientX / window.innerWidth - 0.5) * 2
      my = (e.clientY / window.innerHeight - 0.5) * 2
      if (!scheduled) {
        scheduled = true
        pointerRaf.current = requestAnimationFrame(flush)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(pointerRaf.current)
    }
  }, [])

  useEffect(() => {
    if (menuOpen || activeGame) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, activeGame])

  const recentGames = useMemo(() => {
    return recent
      .map((r) => games.find((g) => g.id === r.id))
      .filter((g): g is Game => g != null)
  }, [recent])

  const showCursorGlow = finePointer && !activeGame && !menuOpen && settings.backgroundEffects
  const showPremiumCursor =
    finePointer && !activeGame && !menuOpen && !settings.reducedAnimations
  const showBackground = settings.backgroundEffects

  return (
    <>
      <PortalCursor active={showPremiumCursor} />
      {showBackground && <AmbientBackground />}
      <div
        ref={cursorGlowRef}
        className={`cursor-glow pointer-events-none fixed z-[1] ${showCursorGlow ? 'md:block' : 'hidden'}`}
        aria-hidden
      />

      <PortalSideMenu
        open={menuOpen}
        activePage={page}
        onClose={() => setMenuOpen(false)}
        onNavigate={navigate}
      />

      <DashboardNav
        shellClass={PORTAL_SHELL}
        pageTitle={PAGE_TITLES[page]}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchPick={(g) => {
          setDetailGame(g)
          navigate('games')
        }}
        onMenuOpen={() => setMenuOpen(true)}
      />

      <main
        ref={mainRef}
        className={`portal-main relative z-10 ${PORTAL_SHELL} pb-10 pt-1 sm:pt-1.5`}
      >
        <div className={`${PORTAL_CONTENT} relative min-h-[50vh]`}>
          <AnimatePresence>{pageLoading ? <PortalPageLoader key="portal-page-load" page={page} /> : null}</AnimatePresence>
          <div
            className={`transition-opacity duration-300 ease-out ${pageLoading ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
            aria-busy={pageLoading}
          >
            <PortalPageViews
          page={contentPage}
          onPlay={handlePlay}
          onDetail={setDetailGame}
          favorites={favoriteSet}
          onToggleFavorite={handleToggleFavorite}
          recentGames={recentGames}
          category={category}
          onCategoryChange={setCategory}
          searchQuery={searchQuery}
          settings={settings}
          onSettingsChange={setSettings}
          onOpenArticle={setArticle}
          onOpenHelp={setHelpTopic}
          onViewFullLeaderboard={() => setLeaderboardFull(true)}
          onNavigate={navigate}
          scrollToFaq={scrollToFaq}
        />
          </div>
        </div>
      </main>

      <GamePlayerModal game={activeGame} onClose={() => setActiveGame(null)} />

      <GameDetailDrawer
        game={detailGame}
        isFavorite={detailGame ? favoriteSet.has(detailGame.id) : false}
        onClose={() => setDetailGame(null)}
        onPlay={(g) => {
          setDetailGame(null)
          handlePlay(g)
        }}
        onToggleFavorite={handleToggleFavorite}
        onRated={() => setRatingTick((t) => t + 1)}
      />

      <ArticleModal article={article} onClose={() => setArticle(null)} />
      <LeaderboardFullModal open={leaderboardFull} onClose={() => setLeaderboardFull(false)} />
      <HelpTopicModal topic={helpTopic} onClose={() => setHelpTopic(null)} />
    </>
  )
}
