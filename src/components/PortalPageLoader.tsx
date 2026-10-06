import { motion } from 'framer-motion'
import { PAGE_TITLES, type PortalPage } from '../portal/pages'

type PortalPageLoaderProps = {
  page: PortalPage
}

export function PortalPageLoader({ page }: PortalPageLoaderProps) {
  const title = PAGE_TITLES[page]

  return (
    <motion.div
      className="portal-page-loader absolute inset-0 z-20 flex items-start justify-center pt-[min(28vh,12rem)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${title}`}
    >
      <div className="portal-page-loader-backdrop absolute inset-0" aria-hidden />
      <motion.div
        className="glass-panel relative mx-4 w-full max-w-sm rounded-xl px-6 py-5 text-center"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-500">Loading</p>
        <p className="mt-1.5 font-display text-sm font-bold uppercase tracking-wide text-white">{title}</p>
        <div className="portal-page-loader-track mx-auto mt-4 w-full max-w-[200px]">
          <motion.div
            className="portal-page-loader-fill h-0.5 rounded-full"
            initial={{ width: '8%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="mt-3 flex justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="portal-boot-dot h-1 w-1 rounded-full"
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.12 }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
