import { AnimatePresence } from 'framer-motion'
import { useCallback, useState } from 'react'
import { GameDashboard } from './components/GameDashboard'
import { PortalBootScreen } from './components/PortalBootScreen'

function readBootSeen() {
  try {
    return sessionStorage.getItem('lobby_boot') === '1'
  } catch {
    return false
  }
}

function App() {
  const [booting, setBooting] = useState(() => !readBootSeen())

  const finishBoot = useCallback(() => {
    try {
      sessionStorage.setItem('lobby_boot', '1')
    } catch {
      /* ignore */
    }
    setBooting(false)
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    })
  }, [])

  return (
    <>
      <AnimatePresence>
        {booting ? <PortalBootScreen key="boot" onFinish={finishBoot} /> : null}
      </AnimatePresence>
      <GameDashboard />
    </>
  )
}

export default App
