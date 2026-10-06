import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { newGames, popularGames } from '../data/games'
import type { Game } from '../types/game'
import { FeaturedHero } from './FeaturedHero'
import { GameGridBlock } from './GameGridBlock'
import { HomeScrollHint } from './HomeScrollHint'
import { PortalAnnouncement } from './PortalAnnouncement'

type HomeScrollLayoutProps = {
  reducedMotion: boolean
  onPlay: (game: Game) => void
  onDetail: (game: Game) => void
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
}

export function HomeScrollLayout({
  reducedMotion,
  onPlay,
  onDetail,
  favorites,
  onToggleFavorite,
}: HomeScrollLayoutProps) {
  const stageRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end start'],
  })

  const heroScale = useTransform(scrollYProgress, [0, 1], [1.16, 1])
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -12])
  const heroShadow = useTransform(scrollYProgress, [0, 1], [0.45, 0.2])
  const heroFilter = useTransform(
    heroShadow,
    (v) => `drop-shadow(0 24px 48px rgba(0,0,0,${v}))`,
  )

  if (reducedMotion) {
    return (
      <>
        <div className="portal-home-announcement">
          <PortalAnnouncement />
        </div>
        <div className="featured-slider-wrap">
          <FeaturedHero onPlay={onPlay} onDetail={onDetail} reducedMotionPref />
        </div>
        <GameGridBlock
          title="Popular now"
          subtitle="Quick picks"
          games={popularGames.slice(0, 4)}
          onPlay={onPlay}
          onDetail={onDetail}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          revealDisabled
        />
        <GameGridBlock
          title="New arrivals"
          subtitle="Latest titles"
          games={newGames.slice(0, 4)}
          onPlay={onPlay}
          onDetail={onDetail}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          revealDisabled
        />
      </>
    )
  }

  return (
    <>
      <div className="portal-home-announcement">
        <PortalAnnouncement />
      </div>
      <div ref={stageRef} className="home-hero-scroll-stage">
        <div className="home-hero-scroll-sticky">
          <div className="featured-slider-wrap home-hero-slider-shell">
            <HomeScrollHint />
            <motion.div
              className="home-hero-scroll-slider w-full"
              style={{
                scale: heroScale,
                y: heroY,
                filter: heroFilter,
              }}
            >
              <FeaturedHero onPlay={onPlay} onDetail={onDetail} reducedMotionPref={false} />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="home-scroll-reveal-section">
        <GameGridBlock
          title="Popular now"
          subtitle="Quick picks"
          games={popularGames.slice(0, 4)}
          onPlay={onPlay}
          onDetail={onDetail}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          revealDelay={0.05}
        />
      </div>

      <div className="home-scroll-reveal-section">
        <GameGridBlock
          title="New arrivals"
          subtitle="Latest titles"
          games={newGames.slice(0, 4)}
          onPlay={onPlay}
          onDetail={onDetail}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          revealDelay={0.1}
        />
      </div>
    </>
  )
}
