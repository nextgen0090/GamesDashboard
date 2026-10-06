import { useState } from 'react'

type NavItem = { id: string; label: string; icon: string }

const ITEMS: NavItem[] = [
  { id: 'section-home', label: 'Home', icon: '⌂' },
  { id: 'section-games', label: 'Games', icon: '▦' },
  { id: 'section-leaderboard', label: 'Leaderboard', icon: '🏆' },
  { id: 'section-new', label: 'New', icon: '✦' },
  { id: 'section-recent', label: 'History', icon: '↺' },
  { id: 'section-games', label: 'Favorites', icon: '♥' },
  { id: 'section-updates', label: 'News', icon: '◈' },
  { id: 'section-feedback', label: 'Feedback', icon: '✎' },
  { id: 'section-faq', label: 'FAQ', icon: '?' },
  { id: 'portal-settings', label: 'Settings', icon: '⚙' },
]

type PortalUtilityNavProps = {
  onNavigate: (target: string) => void
  hidden?: boolean
}

export function PortalUtilityNav({ onNavigate, hidden }: PortalUtilityNavProps) {
  const [expanded, setExpanded] = useState(false)

  if (hidden) return null

  const scrollOrAction = (id: string) => {
    if (id === 'portal-settings') {
      onNavigate('settings')
      return
    }
    if (id === 'section-games' && ITEMS.find((i) => i.label === 'Favorites')) {
      // second games entry is favorites — handled via label in mobile; desktop uses data-nav
    }
    onNavigate(id)
  }

  return (
    <>
      <aside
        className="portal-rail fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        aria-label="Portal navigation"
      >
        <div
          className={`flex flex-col gap-1 rounded-xl border border-white/[0.08] bg-[#07070f]/85 p-1.5 shadow-lg backdrop-blur-md transition-[width] duration-200 ${expanded ? 'w-[148px]' : 'w-[44px]'}`}
        >
          {ITEMS.map((item, idx) => (
            <button
              key={`${item.id}-${item.label}-${idx}`}
              type="button"
              title={item.label}
              onClick={() => {
                if (item.label === 'Favorites') onNavigate('favorites')
                else scrollOrAction(item.id)
              }}
              className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.06] bg-[#12101f] text-xs">
                {item.icon}
              </span>
              <span
                className={`truncate text-[10px] font-semibold uppercase tracking-wide transition-opacity ${expanded ? 'opacity-100' : 'pointer-events-none w-0 opacity-0'}`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <nav
        className="portal-bottom-nav fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-white/[0.08] bg-[#07070f]/95 px-1 py-1.5 backdrop-blur-md lg:hidden"
        aria-label="Mobile portal navigation"
      >
        {ITEMS.slice(0, 5).map((item) => (
          <button
            key={`m-${item.label}`}
            type="button"
            className="flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-1 text-[9px] font-semibold uppercase tracking-wide text-zinc-500"
            onClick={() => {
              if (item.label === 'Favorites') onNavigate('favorites')
              else if (item.id === 'portal-settings') onNavigate('settings')
              else onNavigate(item.id)
            }}
          >
            <span className="text-sm leading-none">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
