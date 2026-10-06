import { AnimatePresence, motion } from 'framer-motion'
import {
  filterGamesByCategory,
  gameCategories,
  games,
  newGames,
  popularGames,
  recommendedGames,
  searchGames,
} from '../data/games'
import type { Game } from '../types/game'
import type { PortalPage } from '../portal/pages'
import type { PortalSettings } from '../utils/portalStorage'
import { HomeScrollLayout } from './HomeScrollLayout'
import { LeaderboardSection } from './LeaderboardSection'
import {
  FAQSection,
  FeedbackSection,
  HelpSection,
  NewsSection,
  PortalFooter,
  UpdatesSection,
} from './PortalSections'
import { GameGridBlock } from './GameGridBlock'
import type { ArticlePayload } from './PortalOverlays'
import { ScrollReveal } from './ScrollReveal'

export type PortalViewProps = {
  page: PortalPage
  onPlay: (game: Game) => void
  onDetail: (game: Game) => void
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
  recentGames: Game[]
  category: string
  onCategoryChange: (c: string) => void
  searchQuery: string
  settings: PortalSettings
  onSettingsChange: (s: PortalSettings) => void
  onOpenArticle: (a: ArticlePayload) => void
  onOpenHelp: (topic: string) => void
  onViewFullLeaderboard: () => void
  onNavigate: (page: PortalPage) => void
  scrollToFaq: () => void
}

const pageMotion = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
}

export function PortalPageViews(props: PortalViewProps) {
  const {
    page,
    onPlay,
    onDetail,
    favorites,
    onToggleFavorite,
    recentGames,
    category,
    onCategoryChange,
    searchQuery,
    settings,
    onSettingsChange,
    onOpenArticle,
    onOpenHelp,
    onViewFullLeaderboard,
    onNavigate,
    scrollToFaq,
  } = props

  const filteredBrowse = searchGames(
    searchQuery,
    filterGamesByCategory(category, favorites),
  )
  const favoriteList = games.filter((g) => favorites.has(g.id))
  const revealOff = settings.reducedAnimations

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={page} {...pageMotion} className="portal-page">
          {page === 'home' && (
            <HomeScrollLayout
              reducedMotion={revealOff}
              onPlay={onPlay}
              onDetail={onDetail}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
            />
          )}

          {page === 'games' && (
            <>
              <ScrollReveal disabled={revealOff}>
              <div
                className="category-scroll -mx-1 mb-5 flex gap-2 overflow-x-auto pb-1"
                role="tablist"
                aria-label="Categories"
              >
                {gameCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={category === cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`category-chip glass-chip shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] sm:text-[11px] ${
                      category === cat ? 'glass-chip-active' : ''
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              </ScrollReveal>
              <GameGridBlock
                title={category === 'All' ? 'All games' : category}
                subtitle="Tap Play to launch in the lobby modal"
                games={filteredBrowse}
                onPlay={onPlay}
                onDetail={onDetail}
                favorites={favorites}
                onToggleFavorite={onToggleFavorite}
                compact={settings.compactCards}
                revealDisabled={revealOff}
                revealDelay={0.06}
                emptyMessage={
                  category === 'Favorites'
                    ? 'No favorites yet — tap ♥ on a card.'
                    : 'No games match this filter.'
                }
              />
            </>
          )}

          {page === 'popular' && (
            <GameGridBlock
              title="Popular games"
              subtitle="Most played in the lobby"
              games={popularGames}
              onPlay={onPlay}
              onDetail={onDetail}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              revealDisabled={revealOff}
            />
          )}

          {page === 'new' && (
            <GameGridBlock
              title="New games"
              subtitle="Added recently"
              games={newGames}
              onPlay={onPlay}
              onDetail={onDetail}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              revealDisabled={revealOff}
            />
          )}

          {page === 'favorites' && (
            <GameGridBlock
              title="Favorites"
              subtitle="Saved on this device"
              games={favoriteList}
              onPlay={onPlay}
              onDetail={onDetail}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              revealDisabled={revealOff}
              emptyMessage="No favorites yet — tap ♥ on any game card."
            />
          )}

          {page === 'recent' && (
            <GameGridBlock
              title="Recently played"
              subtitle="Your last sessions"
              games={recentGames}
              onPlay={onPlay}
              onDetail={onDetail}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              revealDisabled={revealOff}
              emptyMessage="Play a game to see it here."
            />
          )}

          {page === 'recommended' && (
            <GameGridBlock
              title="Recommended for you"
              subtitle="Featured & popular mix"
              games={recommendedGames}
              onPlay={onPlay}
              onDetail={onDetail}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              revealDisabled={revealOff}
            />
          )}

          {page === 'leaderboard' && (
            <ScrollReveal disabled={revealOff}>
              <LeaderboardSection onViewFull={onViewFullLeaderboard} />
            </ScrollReveal>
          )}

          {page === 'updates' && (
            <ScrollReveal disabled={revealOff}>
              <UpdatesSection onOpenArticle={onOpenArticle} />
            </ScrollReveal>
          )}

          {page === 'news' && (
            <ScrollReveal disabled={revealOff}>
              <NewsSection onOpenArticle={onOpenArticle} />
            </ScrollReveal>
          )}

          {page === 'feedback' && (
            <ScrollReveal disabled={revealOff}>
              <FeedbackSection />
            </ScrollReveal>
          )}

          {page === 'faq' && (
            <p className="mb-6 text-center text-xs text-zinc-500">
              Frequently asked questions are listed below on every page.
            </p>
          )}

          {page === 'help' && (
            <ScrollReveal disabled={revealOff}>
              <HelpSection
                onOpenHelp={(topic) => {
                  if (topic === 'Read FAQ') scrollToFaq()
                  else if (topic === 'Send feedback') onNavigate('feedback')
                  else onOpenHelp(topic)
                }}
              />
            </ScrollReveal>
          )}

          {page === 'settings' && (
            <ScrollReveal disabled={revealOff} className="portal-page-center">
              <div className="glass-panel w-full max-w-lg rounded-xl p-5">
                <h2 className="font-display text-sm font-bold uppercase text-white">Dashboard settings</h2>
                <p className="mt-1 text-xs text-zinc-500">Does not affect in-game WebGL audio.</p>
                <ul className="mt-5 space-y-4 text-sm">
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
                        onClick={() => onSettingsChange({ ...settings, [key]: !settings[key] })}
                        className={`h-6 w-11 rounded-full border transition-colors duration-200 ${settings[key] ? 'border-[#e84a9a]/40 bg-[#e84a9a]/25' : 'border-white/15 bg-[#07070f]/80'}`}
                      >
                        <span
                          className={`block h-5 w-5 rounded-full bg-white transition-transform duration-200 ${settings[key] ? 'translate-x-5' : 'translate-x-0.5'}`}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          )}
        </motion.div>
      </AnimatePresence>

      <ScrollReveal disabled={revealOff} className="portal-global-bottom mt-10 border-t border-white/[0.06] pt-8">
        <FAQSection />
        <PortalFooter onNavigate={onNavigate} onScrollToFaq={scrollToFaq} />
      </ScrollReveal>
    </>
  )
}
