import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Vertical flow animation - animated line from top to bottom.
 * Progress reflects scroll position.
 */
export function VerticalFlow() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed left-6 top-0 bottom-0 z-[1] hidden lg:block pointer-events-none">
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/[0.06]">
        {/* Animated fill */}
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#00d4aa]/60 to-[#00d4aa]/20"
          style={{ height: `${progress * 100}%` }}
          initial={{ height: 0 }}
          animate={{ height: `${progress * 100}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 25 }}
        />
      </div>
      {/* Floating dot */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00d4aa] shadow-[0_0_12px_rgba(0,212,170,0.5)]"
        style={{ top: `${progress * 100}%` }}
        initial={{ top: 0 }}
        animate={{ top: `${progress * 100}%` }}
        transition={{ type: 'spring', stiffness: 80, damping: 25 }}
      />
    </div>
  )
}
