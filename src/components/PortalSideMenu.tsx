import { AnimatePresence, motion } from 'framer-motion'
import { PAGE_TITLES, PORTAL_NAV, type PortalPage } from '../portal/pages'

type PortalSideMenuProps = {
  open: boolean
  activePage: PortalPage
  onClose: () => void
  onNavigate: (page: PortalPage) => void
}

export function PortalSideMenu({ open, activePage, onClose, onNavigate }: PortalSideMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.aside
            className="glass-panel fixed left-0 top-0 z-50 flex h-full w-[min(100vw,280px)] flex-col border-r border-white/10 shadow-2xl"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            aria-label="Portal menu"
          >
            <div className="border-b border-white/[0.08] px-4 py-4">
              <p className="font-display text-sm font-bold uppercase tracking-wide text-white">WebGL Lobby</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Portal navigation</p>
            </div>
            <nav className="flex-1 overflow-y-auto p-2">
              <ul className="space-y-0.5">
                {PORTAL_NAV.map((item) => {
                  const active = activePage === item.page
                  return (
                    <li key={item.page}>
                      <motion.button
                        type="button"
                        onClick={() => {
                          onNavigate(item.page)
                          onClose()
                        }}
                        className={`portal-nav-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${
                          active
                            ? 'bg-[#e84a9a]/15 text-white shadow-[inset_0_0_0_1px_rgba(232,74,154,0.25)]'
                            : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white'
                        }`}
                        whileHover={{ x: 6 }}
                        whileTap={{ x: 2, y: 1 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                      >
                        <motion.span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sm"
                          whileHover={{ rotate: 5, y: -1 }}
                          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                        >
                          {item.icon}
                        </motion.span>
                        <span className="text-[11px] font-semibold uppercase tracking-wide">
                          {item.label}
                        </span>
                      </motion.button>
                    </li>
                  )
                })}
              </ul>
            </nav>
            <p className="border-t border-white/[0.08] px-4 py-3 text-[10px] text-zinc-600">
              {PAGE_TITLES[activePage]}
            </p>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
