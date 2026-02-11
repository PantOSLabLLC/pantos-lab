import { useEffect, useRef } from 'react'

/**
 * Full-page background: graphite base + matte glass overlay + vertical flow animation.
 */
export function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollRef = useRef(0)
  const particlesRef = useRef<Array<{ x: number; y: number; speed: number; size: number }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let time = 0
    let w = window.innerWidth
    let h = window.innerHeight

    const initParticles = () => {
      particlesRef.current = Array.from({ length: 28 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: 0.4 + Math.random() * 0.6,
        size: 1 + Math.random() * 2,
      }))
    }

    const setSize = () => {
      w = window.innerWidth
      h = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    const draw = () => {
      w = window.innerWidth
      h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      const scrollY = scrollRef.current

      // Vertical flowing lines - scroll-linked
      const numLines = 14
      const lineSpacing = w / (numLines + 1)

      for (let i = 0; i < numLines; i++) {
        const baseX = lineSpacing * (i + 1)
        const seed = (scrollY * 0.02 + time * 0.5 + i * 0.7) % (Math.PI * 2)

        ctx.beginPath()
        ctx.strokeStyle = `rgba(0, 212, 170, ${0.03 + Math.sin(seed) * 0.025})`
        ctx.lineWidth = 1

        for (let y = -50; y < h + 50; y += 6) {
          const globalY = scrollY + y
          const noise = Math.sin(globalY * 0.008 + time * 0.3 + i) * 12 +
            Math.sin(globalY * 0.015) * 6
          const x = baseX + noise
          if (y === -50) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // Horizontal grid - scroll-linked
      const gridStep = 60
      const startY = -(scrollY % gridStep)
      for (let gy = startY; gy < h + gridStep; gy += gridStep) {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255,255,255,${0.015 + Math.sin(time * 0.1 + gy * 0.02) * 0.01})`
        ctx.lineWidth = 1
        ctx.moveTo(0, gy)
        ctx.lineTo(w, gy)
        ctx.stroke()
      }

      // Vertical center stream - subtle glowing line
      const streamX = w * 0.5 + Math.sin(time * 0.3) * 20
      ctx.beginPath()
      ctx.strokeStyle = `rgba(0, 212, 170, ${0.06 + Math.sin(time) * 0.02})`
      ctx.lineWidth = 2
      for (let sy = -20; sy < h + 20; sy += 4) {
        const gY = scrollY + sy
        const nx = streamX + Math.sin(gY * 0.01 + time * 0.4) * 8
        if (sy === -20) ctx.moveTo(nx, sy)
        else ctx.lineTo(nx, sy)
      }
      ctx.stroke()

      // Floating particles - drift down (viewport-relative)
      particlesRef.current.forEach((p) => {
        p.y -= p.speed
        if (p.y < -10) {
          p.y = h + 10
          p.x = Math.random() * w
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 212, 170, ${0.12 - p.size * 0.04})`
        ctx.fill()
      })

      time += 0.02
      rafId = requestAnimationFrame(draw)
    }

    const onScroll = () => {
      scrollRef.current = window.scrollY
    }

    setSize()
    initParticles()
    draw()
    window.addEventListener('scroll', onScroll, { passive: true })
    const onResize = () => {
      setSize()
      initParticles()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        aria-hidden
      />
      {/* Matte glass overlay - frosted tint */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            linear-gradient(180deg, rgba(10,11,13,0.4) 0%, transparent 30%, transparent 70%, rgba(10,11,13,0.5) 100%),
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,212,170,0.03) 0%, transparent 50%)
          `,
          backdropFilter: 'blur(0.5px)',
        }}
      />
    </>
  )
}
