import { motion } from 'framer-motion'

const orbs = [
  { size: 520, x: '-5%', y: '-10%', color: '#7c3aed', delay: 0 },
  { size: 440, x: '70%', y: '-5%', color: '#db2777', delay: 0.5 },
  { size: 380, x: '55%', y: '55%', color: '#6d28d9', delay: 1 },
  { size: 320, x: '-8%', y: '60%', color: '#f59e0b', delay: 1.4 },
]

const stars = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  top: `${(i * 23 + 11) % 100}%`,
  size: i % 3 === 0 ? 2 : 1,
  opacity: 0.12 + (i % 5) * 0.06,
}))

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#0a0614]" />

      <motion.div
        className="ambient-gradient absolute inset-0 opacity-90"
        animate={{ opacity: [0.75, 0.95, 0.75] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}
      {orbs.map((orb) => (
        <motion.div
          key={`${orb.x}-${orb.y}`}
          className="absolute rounded-full blur-[120px]"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
            opacity: 0.32,
          }}
          animate={{
            x: [0, 22, -14, 0],
            y: [0, -16, 12, 0],
            scale: [1, 1.08, 0.96, 1],
            opacity: [0.28, 0.38, 0.3, 0.28],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0614]/25 via-transparent to-[#0a0614]/80" />
    </div>
  )
}
