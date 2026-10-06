import { useEffect, useRef } from 'react'

function motionReduced() {
  return (
    document.documentElement.classList.contains('portal-reduced-motion') ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let disposed = false
    let raf = 0
    let frame = 0
    let visible = document.visibilityState === 'visible'
    let disposeThree: (() => void) | undefined

    const isCoarse = window.matchMedia('(pointer: coarse)').matches

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', onVisibility)

    import('three').then((THREE) => {
      if (disposed) return

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      })
      renderer.setClearColor(0x000000, 0)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 80)
      camera.position.z = 14

      const makeField = (count: number, spread: [number, number, number], size: number, opacity: number) => {
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        /* #9d6bff, #e84a9a, #ffc947, deep panel purple */
        const palette = [
          [0.616, 0.42, 1],
          [0.91, 0.29, 0.604],
          [1, 0.788, 0.278],
          [0.42, 0.38, 0.72],
        ] as const

        for (let i = 0; i < count; i++) {
          positions[i * 3] = (Math.random() - 0.5) * spread[0]
          positions[i * 3 + 1] = (Math.random() - 0.5) * spread[1]
          positions[i * 3 + 2] = (Math.random() - 0.5) * spread[2]
          const c = palette[Math.floor(Math.random() * palette.length)]
          colors[i * 3] = c[0]
          colors[i * 3 + 1] = c[1]
          colors[i * 3 + 2] = c[2]
        }

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        const material = new THREE.PointsMaterial({
          size,
          transparent: true,
          opacity,
          depthWrite: false,
          sizeAttenuation: true,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
        })
        return new THREE.Points(geometry, material)
      }

      const reduced = motionReduced()
      const mainCount = reduced ? 90 : isCoarse ? 180 : 300
      const dustCount = reduced ? 0 : isCoarse ? 60 : 100

      const mainField = makeField(mainCount, [26, 14, 12], isCoarse ? 0.028 : 0.022, 0.26)
      const dustField = dustCount > 0 ? makeField(dustCount, [32, 18, 16], 0.012, 0.14) : null

      scene.add(mainField)
      if (dustField) scene.add(dustField)

      const resize = () => {
        const w = window.innerWidth
        const h = window.innerHeight
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      resize()
      window.addEventListener('resize', resize)

      const readParallax = () => {
        const root = getComputedStyle(document.documentElement)
        const px = Number.parseFloat(root.getPropertyValue('--lobby-px')) || 0
        const py = Number.parseFloat(root.getPropertyValue('--lobby-py')) || 0
        return { px, py }
      }

      const tick = () => {
        raf = requestAnimationFrame(tick)
        if (!visible) return

        const { px, py } = readParallax()
        const reducedNow = motionReduced()

        camera.position.x = px * 0.32
        camera.position.y = py * 0.22
        camera.lookAt(px * 0.15, py * 0.1, 0)

        if (!reducedNow) {
          frame += 0.0035
          mainField.rotation.y = frame * 0.14 + px * 0.08
          mainField.rotation.x = py * 0.06
          if (dustField) {
            dustField.rotation.y = -frame * 0.09 + px * 0.05
            dustField.rotation.x = -py * 0.04
          }
        }

        renderer.render(scene, camera)
      }
      tick()

      disposeThree = () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', resize)
        mainField.geometry.dispose()
        ;(mainField.material as { dispose: () => void }).dispose()
        if (dustField) {
          dustField.geometry.dispose()
          ;(dustField.material as { dispose: () => void }).dispose()
        }
        renderer.dispose()
      }

      if (disposed) disposeThree()
    })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibility)
      disposeThree?.()
    }
  }, [])

  return (
    <div className="ambient-root pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="ambient-base absolute inset-0" />
      <div className="ambient-parallax absolute inset-0">
        <div className="ambient-orb ambient-orb-a" />
        <div className="ambient-orb ambient-orb-b" />
        <div className="ambient-orb ambient-orb-c" />
      </div>
      <div className="ambient-grid absolute inset-0" />
      <canvas ref={canvasRef} className="ambient-canvas absolute inset-0 h-full w-full" />
      <div className="ambient-gradient absolute inset-0" />
      <div className="ambient-vignette absolute inset-0" />
      <div className="ambient-noise absolute inset-0" />
    </div>
  )
}
