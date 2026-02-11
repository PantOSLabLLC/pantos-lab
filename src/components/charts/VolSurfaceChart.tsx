import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const STRIKES = [90, 95, 100, 105, 110]
const TENORS = ['1M', '3M', '6M', '1Y']
const IV_SURFACE: number[][] = [
  [22, 23, 24, 25],
  [18, 19, 20, 21],
  [16, 17, 18, 19],
  [18, 19, 20, 21],
  [22, 23, 24, 25],
]

const PADDING = { left: 44, right: 24, top: 24, bottom: 40 }
const WIDTH = 280
const HEIGHT = 180
const CELL_W = (WIDTH - PADDING.left - PADDING.right) / STRIKES.length
const CELL_H = (HEIGHT - PADDING.top - PADDING.bottom) / TENORS.length

function getIVColor(iv: number) {
  const min = 14
  const max = 26
  const t = (iv - min) / (max - min)
  return `rgba(0, 212, 170, ${0.25 + t * 0.6})`
}

export function VolSurfaceChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { amount: 0.1 })
  const [hovered, setHovered] = useState<{ strike: number; tenor: string; iv: number; x: number; y: number } | null>(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    if (inView && !animated) setAnimated(true)
  }, [inView, animated])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - PADDING.left
    const y = e.clientY - rect.top - PADDING.top

    if (x < 0 || y < 0 || x > CELL_W * STRIKES.length || y > CELL_H * TENORS.length) {
      setHovered(null)
      return
    }

    const col = Math.min(Math.floor(x / CELL_W), STRIKES.length - 1)
    const row = Math.min(Math.floor(y / CELL_H), TENORS.length - 1)

    setHovered({
      strike: STRIKES[col],
      tenor: TENORS[row],
      iv: IV_SURFACE[col][row],
      x: PADDING.left + col * CELL_W + CELL_W / 2,
      y: PADDING.top + row * CELL_H + CELL_H / 2,
    })
  }

  const handleMouseLeave = () => setHovered(null)

  return (
    <div className="panel p-6 rounded-2xl" ref={containerRef}>
      <div className="h-[240px] lg:h-[280px] relative" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
          {STRIKES.map((_, col) =>
            TENORS.map((_, row) => (
              <motion.rect
                key={`${col}-${row}`}
                x={PADDING.left + col * CELL_W + 1}
                y={PADDING.top + row * CELL_H + 1}
                width={CELL_W - 2}
                height={CELL_H - 2}
                fill={getIVColor(IV_SURFACE[col][row])}
                initial={{ opacity: 0 }}
                animate={animated ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: (col + row) * 0.05 }}
                style={{
                  opacity: hovered
                    ? hovered.strike === STRIKES[col] && hovered.tenor === TENORS[row]
                      ? 1
                      : 0.4
                    : undefined,
                }}
              />
            ))
          )}
          {STRIKES.map((s, i) => (
            <text
              key={s}
              x={PADDING.left + i * CELL_W + CELL_W / 2}
              y={HEIGHT - 12}
              textAnchor="middle"
              className="fill-white/40 text-[9px] font-mono"
            >
              {s}%
            </text>
          ))}
          {TENORS.map((t, i) => (
            <text
              key={t}
              x={PADDING.left - 6}
              y={PADDING.top + i * CELL_H + CELL_H / 2}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-white/40 text-[9px] font-mono"
            >
              {t}
            </text>
          ))}
          <line
            x1={PADDING.left}
            y1={PADDING.top}
            x2={PADDING.left}
            y2={PADDING.top + CELL_H * TENORS.length}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1}
          />
          <line
            x1={PADDING.left}
            y1={PADDING.top + CELL_H * TENORS.length}
            x2={PADDING.left + CELL_W * STRIKES.length}
            y2={PADDING.top + CELL_H * TENORS.length}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1}
          />
          {hovered && (
            <g>
              <rect
                x={hovered.x - 42}
                y={hovered.y - 32}
                width={84}
                height={28}
                rx={4}
                className="fill-[#0d0e10] stroke-white/20"
                strokeWidth={1}
              />
              <text
                x={hovered.x}
                y={hovered.y - 16}
                textAnchor="middle"
                className="fill-[#00d4aa] text-[10px] font-mono font-medium"
              >
                K {hovered.strike}% · {hovered.tenor}
              </text>
              <text
                x={hovered.x}
                y={hovered.y - 2}
                textAnchor="middle"
                className="fill-white/70 text-[10px] font-mono"
              >
                IV {hovered.iv}%
              </text>
            </g>
          )}
        </svg>
      </div>
      <p className="text-xs font-mono text-white/40 mt-3">IV surface · Strike × Tenor</p>
    </div>
  )
}
