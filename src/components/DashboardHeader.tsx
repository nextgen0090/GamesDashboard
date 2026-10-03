import { motion } from 'framer-motion'

export function DashboardHeader() {
  return (
    <motion.header
      className="relative mb-6 pt-2 text-center sm:mb-7 sm:pt-3 md:mb-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
    >
      <h1
        className="font-display text-[clamp(1.5rem,3.5vw,2.5rem)] font-extrabold uppercase leading-tight tracking-wide"
        style={{
          background: 'linear-gradient(180deg, #fff 0%, #e9d5ff 50%, #ff2d95 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 20px rgba(255,45,149,0.24))',
        }}
      >
        WebGL Games
      </h1>
      <p className="mx-auto mt-2.5 max-w-lg text-xs leading-relaxed text-zinc-500 sm:text-sm">
        Pick a game and play in-browser — no new tabs.
      </p>
      <div className="mx-auto mt-4 h-px w-28 bg-gradient-to-r from-transparent via-[#b026ff]/75 to-transparent" />
    </motion.header>
  )
}
