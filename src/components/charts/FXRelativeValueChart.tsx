import { useRef, useEffect } from 'react'
import { useInView } from 'framer-motion'

/** Nominal vs real exchange rate - FX relative value */
const NOMINAL = [1.02, 1.05, 1.03, 1.08, 1.06, 1.04, 1.07]
const REAL = [0.98, 1.0, 0.99, 1.02, 1.01, 1.0, 1.03]
const W = 240
const H = 120
const P = { left: 40, right: 20, top: 16, bottom: 32 }

export function FXRelativeValueChart() {
  const ref = useRef<HTMLDivElement>(null)
  const path1Ref = useRef<SVGPathElement>(null)
  const path2Ref = useRef<SVGPathElement>(null)
  const inView = useInView(ref, { amount: 0.1 })

  const all = [...NOMINAL, ...REAL]
  const min = Math.min(...all) - 0.02
  const max = Math.max(...all) + 0.02
  const xScale = (i: number) => P.left + (i / (NOMINAL.length - 1)) * (W - P.left - P.right)
  const yScale = (v: number) => P.top + (H - P.top - P.bottom) - ((v - min) / (max - min)) * (H - P.top - P.bottom)

  const path1D = NOMINAL.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`).join(' ')
  const path2D = REAL.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`).join(' ')

  useEffect(() => {
    const p1 = path1Ref.current
    const p2 = path2Ref.current
    if (!inView || !p1 || !p2) return
    const len1 = p1.getTotalLength()
    const len2 = p2.getTotalLength()
    p1.style.strokeDasharray = `${len1}`
    p1.style.strokeDashoffset = `${len1}`
    p2.style.strokeDasharray = `${len2}`
    p2.style.strokeDashoffset = `${len2}`
    let start: number | null = null
    const animate = (now: number) => {
      if (!start) start = now
      const t = Math.min((now - start) / 1000, 1)
      p1.style.strokeDashoffset = `${len1 * (1 - t)}`
      p2.style.strokeDashoffset = `${len2 * (1 - Math.min(t * 1.2, 1))}`
      if (t < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView])

  return (
    <div className="panel p-6 rounded-2xl" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[200px] lg:h-[240px]">
        <path
          ref={path1Ref}
          d={path1D}
          fill="none"
          stroke="#00d4aa"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.9 }}
        />
        <path
          ref={path2Ref}
          d={path2D}
          fill="none"
          stroke="rgba(0,212,170,0.5)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 4"
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
        <text x={W - P.right - 2} y={yScale(NOMINAL[NOMINAL.length - 1]) - 4} textAnchor="end" className="fill-[#00d4aa] text-[7px] font-mono">
          nominal
        </text>
        <text x={W - P.right - 2} y={yScale(REAL[REAL.length - 1]) + 10} textAnchor="end" className="fill-[#00d4aa]/60 text-[7px] font-mono">
          real
        </text>
      </svg>
      <p className="text-[10px] font-mono text-white/40 mt-2">Nominal vs real · FX</p>
    </div>
  )
}
