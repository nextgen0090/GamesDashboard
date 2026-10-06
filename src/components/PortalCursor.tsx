import { useEffect, useRef } from 'react'

const TRAIL_COUNT = 7

type PortalCursorProps = {
  active: boolean
}

export function PortalCursor({ active }: PortalCursorProps) {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLSpanElement | null)[]>([])
  const target = useRef({ x: -100, y: -100 })
  const smooth = useRef({ x: -100, y: -100 })
  const trails = useRef(Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 })))
  useEffect(() => {
    document.documentElement.classList.toggle('portal-custom-cursor', active)
    return () => {
      document.documentElement.classList.remove('portal-custom-cursor')
    }
  }, [active])

  useEffect(() => {
    if (!active) return

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
    }

    const onDown = () => {
      ringRef.current?.classList.add('is-click')
      window.setTimeout(() => ringRef.current?.classList.remove('is-click'), 220)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)

    let raf = 0
    const tick = () => {
      const t = target.current
      smooth.current.x += (t.x - smooth.current.x) * 0.28
      smooth.current.y += (t.y - smooth.current.y) * 0.28

      ringRef.current?.style.setProperty(
        'transform',
        `translate3d(${smooth.current.x}px, ${smooth.current.y}px, 0) translate(-50%, -50%)`,
      )
      dotRef.current?.style.setProperty(
        'transform',
        `translate3d(${t.x}px, ${t.y}px, 0) translate(-50%, -50%)`,
      )

      let prevX = t.x
      let prevY = t.y
      trails.current.forEach((tr, i) => {
        const ease = 0.32 - i * 0.028
        tr.x += (prevX - tr.x) * ease
        tr.y += (prevY - tr.y) * ease
        prevX = tr.x
        prevY = tr.y
        const node = trailRefs.current[i]
        if (node) {
          node.style.transform = `translate3d(${tr.x}px, ${tr.y}px, 0) translate(-50%, -50%)`
          node.style.opacity = String(0.32 - i * 0.04)
        }
      })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      cancelAnimationFrame(raf)
    }
  }, [active])

  if (!active) return null

  return (
    <div className="portal-cursor-root pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el
          }}
          className="portal-cursor-trail"
          data-i={i}
        />
      ))}
      <div ref={ringRef} className="portal-cursor-ring" />
      <div ref={dotRef} className="portal-cursor-dot" />
    </div>
  )
}
