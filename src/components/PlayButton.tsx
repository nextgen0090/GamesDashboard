import { motion } from 'framer-motion'

type PlayButtonProps = {
  glow: string
  onClick: () => void
  label?: string
  fullWidth?: boolean
  compact?: boolean
  className?: string
}

export function PlayButton({
  glow,
  onClick,
  label = 'Play Now',
  fullWidth = false,
  compact = false,
  className = '',
}: PlayButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`play-btn relative z-10 flex items-center justify-center gap-1.5 overflow-hidden rounded-lg font-bold uppercase tracking-[0.1em] text-[#0a0614] ${
        compact ? 'px-3 py-2 text-[10px] sm:text-[11px]' : 'px-4 py-2.5 text-xs sm:text-[13px]'
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{
        background: `linear-gradient(135deg, #ffc947 0%, #ffb020 38%, color-mix(in srgb, ${glow} 70%, #ff9f1c) 100%)`,
        boxShadow: `0 2px 16px color-mix(in srgb, ${glow} 26%, transparent), inset 0 1px 0 rgba(255,255,255,0.32)`,
      }}
      whileHover={{
        y: -3,
        x: 1,
        rotate: -0.4,
        boxShadow: `0 6px 28px color-mix(in srgb, ${glow} 42%, transparent), 0 0 20px color-mix(in srgb, #ffc947 25%, transparent), inset 0 1px 0 rgba(255,255,255,0.45)`,
      }}
      whileTap={{
        y: 1,
        x: 0,
        rotate: 0,
        boxShadow: `0 2px 10px color-mix(in srgb, ${glow} 20%, transparent), inset 0 2px 4px rgba(0,0,0,0.15)`,
      }}
      transition={{ type: 'spring', stiffness: 420, damping: 24, mass: 0.75 }}
    >
      <span className="play-btn-shine pointer-events-none absolute inset-0" aria-hidden />
      <svg
        viewBox="0 0 24 24"
        className={`relative shrink-0 fill-[#0a0614] ${compact ? 'h-3 w-3' : 'h-3.5 w-3.5'}`}
        aria-hidden
      >
        <path d="M8 5v14l11-7z" />
      </svg>
      <span className="relative">{label}</span>
    </motion.button>
  )
}
