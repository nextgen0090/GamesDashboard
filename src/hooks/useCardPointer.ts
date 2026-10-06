import type { PointerEvent as ReactPointerEvent } from 'react'

function resetCardPointer(el: HTMLElement) {
  el.style.setProperty('--card-px', '0')
  el.style.setProperty('--card-py', '0')
  el.style.setProperty('--card-rx', '0deg')
  el.style.setProperty('--card-ry', '0deg')
}

function pointerDisabled() {
  return document.documentElement.classList.contains('portal-reduced-motion')
}

export function useCardPointer() {
  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (pointerDisabled() || e.pointerType === 'touch') return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) return
    const px = ((e.clientX - r.left) / r.width - 0.5) * 2
    const py = ((e.clientY - r.top) / r.height - 0.5) * 2
    el.style.setProperty('--card-px', px.toFixed(3))
    el.style.setProperty('--card-py', py.toFixed(3))
    el.style.setProperty('--card-rx', `${(py * -7).toFixed(2)}deg`)
    el.style.setProperty('--card-ry', `${(px * 9).toFixed(2)}deg`)
  }

  const onPointerLeave = (e: ReactPointerEvent<HTMLElement>) => {
    resetCardPointer(e.currentTarget)
  }

  return { onPointerMove, onPointerLeave }
}
