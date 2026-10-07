import { AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { games } from '../data/games'
import type { PortalPage } from '../portal/pages'
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
import { GamePlayerModal } from './GamePlayerModal'
import { LeaderboardFullModal } from './LeaderboardSection'
import {
  ArticleModal,
  GameDetailDrawer,
  HelpTopicModal,
  type ArticlePayload,
} from './PortalOverlays'
import { PortalPageLoader } from './PortalPageLoader'
import { PortalPageViews } from './PortalPageViews'

export function GameDashboard() {
  const [page, setPage] = useState<PortalPage>('home')
  const [contentPage, setContentPage] = useState<PortalPage>('home')
  const [pageLoading, setPageLoading] = useState(false)
  const pageLoadTimer = useRef(0)
  const [activeGame, setActiveGame] = useState<Game | null>(null)
  const [detailGame, setDetailGame] = useState<Game | null>(null)
  const [category, setCategory] = useState<string>('All')
  const [searchQuery] = useState('')
  const [favorites, setFavorites] = useState<string[]>(() => getFavorites())
  const [recent, setRecent] = useState(() => getRecentlyPlayed())
  const [settings, setSettings] = useState<PortalSettings>(() => getSettings())
  const [article, setArticle] = useState<ArticlePayload | null>(null)
  const [helpTopic, setHelpTopic] = useState<string | null>(null)
  const [leaderboardFull, setLeaderboardFull] = useState(false)
  const [, setRatingTick] = useState(0)
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
    if (activeGame) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeGame])

  const recentGames = useMemo(() => {
    return recent
      .map((r) => games.find((g) => g.id === r.id))
      .filter((g): g is Game => g != null)
  }, [recent])

  return (
    <>
      <div className="mosaic-backdrop" aria-hidden>
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <rect width="1440" height="900" fill="#c3f4ea" />
          <polygon points="980,430 1440,300 1440,900 860,900" fill="#b4eee3" />
          <polygon points="1120,560 1440,470 1440,900 1040,900" fill="#d7faf4" />
          <polygon points="0,640 260,560 220,900 0,900" fill="#b7efe4" />
          <polygon points="0,760 160,900 0,900" fill="#dffaf6" />
          <polygon points="1280,0 1440,0 1440,180" fill="#d9faf5" />
        </svg>
      </div>

      <main ref={mainRef} className="mosaic-main">
        <div className="relative min-h-[50vh]">
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
