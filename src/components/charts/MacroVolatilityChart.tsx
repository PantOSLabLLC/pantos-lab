import { useRef, useEffect } from 'react'
import { useInView } from 'framer-motion'

/** Simple volatility / rates line - macro models */
const DATA = [18, 22, 19, 24, 21, 23, 25]
const W = 240
const H = 120
const P = { left: 32, right: 16, top: 16, bottom: 28 }

export function MacroVolatilityChart() {
  const ref = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const inView = useInView(ref, { amount: 0.1 })

  const min = Math.min(...DATA) - 2
  const max = Math.max(...DATA) + 2
  const xScale = (i: number) => P.left + (i / (DATA.length - 1)) * (W - P.left - P.right)
  const yScale = (v: number) => P.top + (H - P.top - P.bottom) - ((v - min) / (max - min)) * (H - P.top - P.bottom)

  const pathD = DATA.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`).join(' ')

  useEffect(() => {
    const path = pathRef.current
    if (!path || !inView) return
    const len = path.getTotalLength()
    path.style.strokeDasharray = `${len}`
    path.style.strokeDashoffset = `${len}`
    let start: number | null = null
    const animate = (now: number) => {
      if (!start) start = now
      const t = Math.min((now - start) / 800, 1)
      path.style.strokeDashoffset = `${len * (1 - t)}`
      if (t < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView])

  return (
    <div className="panel p-6 rounded-2xl" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[200px] lg:h-[240px] text-[#00d4aa]">
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {DATA.map((v, i) => (
          <circle
            key={i}
            cx={xScale(i)}
            cy={yScale(v)}
            r={2.5}
            className="fill-[#00d4aa]"
            style={{ opacity: 0.8 }}
          />
        ))}
        <line
          x1={P.left}
          y1={P.top}
          x2={P.left}
          y2={H - P.bottom}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1}
        />
        <line
          x1={P.left}
          y1={H - P.bottom}
          x2={W - P.right}
          y2={H - P.bottom}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1}
        />
        <text x={P.left - 4} y={P.top + 4} textAnchor="end" className="fill-white/40 text-[8px] font-mono">
          {max}%
        </text>
        <text x={P.left - 4} y={H - P.bottom + 4} textAnchor="end" className="fill-white/40 text-[8px] font-mono">
          {min}%
        </text>
      </svg>
      <p className="text-[10px] font-mono text-white/40 mt-2">Volatility · Rates</p>
    </div>
  )
}
