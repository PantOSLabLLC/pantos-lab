import { useEffect, useRef } from 'react'

/**
 * Subtle flowing background - teal ribbons that match the site accent.
 * Smooth, continuous, non-distracting.
 */
export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let time = 0

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    const draw = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      // Soft teal ribbons - site accent #00d4aa, very low opacity
      const ribbons = 2
      for (let r = 0; r < ribbons; r++) {
        const phase = time * 0.05 + r * 1.5
        const baseY = h * (0.15 + r * 0.22) + Math.sin(phase) * 60

        const gradient = ctx.createLinearGradient(0, 0, w, 0)
        gradient.addColorStop(0, 'rgba(0, 212, 170, 0)')
        gradient.addColorStop(0.25, `rgba(0, 212, 170, ${0.015 + Math.sin(phase) * 0.008})`)
        gradient.addColorStop(0.5, `rgba(0, 212, 170, ${0.03 + Math.sin(phase * 1.1) * 0.01})`)
        gradient.addColorStop(0.75, `rgba(0, 212, 170, ${0.015 + Math.sin(phase * 0.9) * 0.008})`)
        gradient.addColorStop(1, 'rgba(0, 212, 170, 0)')

        ctx.beginPath()
        ctx.strokeStyle = gradient
        ctx.lineWidth = 160
        ctx.lineCap = 'round'

        for (let x = -80; x < w + 80; x += 60) {
          const wave =
            Math.sin(x * 0.004 + time * 0.15 + r) * 60 +
            Math.sin(x * 0.008 + time * 0.1) * 30
          const y = baseY + wave
          if (x === -80) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      time += 0.015
      rafId = requestAnimationFrame(draw)
    }

    setSize()
    draw()
    window.addEventListener('resize', setSize)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', setSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.7 }}
      aria-hidden
    />
  )
}
