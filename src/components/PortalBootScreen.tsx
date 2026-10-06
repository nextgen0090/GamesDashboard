import { useEffect } from 'react'
import { motion } from 'framer-motion'

type PortalBootScreenProps = {
  onFinish: () => void
}

export function PortalBootScreen({ onFinish }: PortalBootScreenProps) {
  useEffect(() => {
    const t = window.setTimeout(onFinish, 1350)
    return () => window.clearTimeout(t)
  }, [onFinish])

  return (
    <motion.div
      className="portal-boot fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-[#07070f]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="font-display text-lg font-bold uppercase tracking-[0.2em] text-white sm:text-xl">
          WebGL Lobby
        </p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-zinc-500">Loading portal</p>
      </motion.div>

      <div className="portal-boot-track w-[min(280px,72vw)]">
        <motion.div
          className="portal-boot-fill h-1 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <motion.div
        className="flex gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="portal-boot-dot h-1.5 w-1.5 rounded-full"
            animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
            transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.14 }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
