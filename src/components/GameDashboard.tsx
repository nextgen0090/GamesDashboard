import { motion } from 'framer-motion'
import { useState } from 'react'
import { games } from '../data/games'
import type { Game } from '../types/game'
import { AmbientBackground } from './AmbientBackground'
import { DashboardHeader } from './DashboardHeader'
import { DashboardNav } from './DashboardNav'
import { GameCard } from './GameCard'
import { GamePlayerModal } from './GamePlayerModal'

const CONTENT_MAX = 'max-w-[1420px]'

export function GameDashboard() {
  const [activeGame, setActiveGame] = useState<Game | null>(null)

  return (
    <>
      <AmbientBackground />
      <DashboardNav contentMaxClass={CONTENT_MAX} />

      <motion.main
        className={`relative z-10 mx-auto w-full ${CONTENT_MAX} px-4 pb-6 pt-2 sm:px-6 sm:pb-8 lg:px-8`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <DashboardHeader />

        <motion.section
          className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5"
          aria-label="Game library"
        >
          {games.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} onPlay={setActiveGame} />
          ))}
        </motion.section>

        <p className="mt-6 text-center text-[10px] text-zinc-600" aria-hidden>
          {games.length} game{games.length === 1 ? '' : 's'} · config: src/data/games.ts · built{' '}
          {__APP_BUILD_TIME__.slice(0, 19).replace('T', ' ')} UTC
        </p>
      </motion.main>

      <GamePlayerModal game={activeGame} onClose={() => setActiveGame(null)} />
    </>
  )
}
