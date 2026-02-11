import { useRef, useEffect } from 'react'
import { useInView } from 'framer-motion'

/** Call option payoff diagram - options pricing */
const W = 240
const H = 120
const P = { left: 36, right: 20, top: 20, bottom: 32 }
const K = 100 // strike

export function OptionsPayoffChart() {
  const ref = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const inView = useInView(ref, { amount: 0.1 })

  const xScale = (s: number) => P.left + ((s - 85) / (115 - 85)) * (W - P.left - P.right)
  const chartH = H - P.top - P.bottom
  const yScale = (p: number) => H - P.bottom - (p / 25) * chartH

  // Call payoff: max(S-K, 0)
  const points: { s: number; p: number }[] = []
  for (let s = 85; s <= 115; s += 2) {
    points.push({ s, p: Math.max(s - K, 0) })
  }
  const pathD = points.map(({ s, p }, i) => `${i === 0 ? 'M' : 'L'} ${xScale(s)} ${yScale(p)}`).join(' ')

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
        <line
          x1={xScale(K)}
          y1={P.top}
          x2={xScale(K)}
          y2={H - P.bottom}
          stroke="rgba(0,212,170,0.3)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <text x={xScale(K)} y={H - 8} textAnchor="middle" className="fill-[#00d4aa]/70 text-[8px] font-mono">
          K
        </text>
        <text x={P.left - 4} y={P.top + 4} textAnchor="end" className="fill-white/40 text-[8px] font-mono">
          P/L
        </text>
      </svg>
      <p className="text-[10px] font-mono text-white/40 mt-2">Call payoff · Strike</p>
    </div>
  )
}
