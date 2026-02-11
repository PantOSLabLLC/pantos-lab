import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Vertical scroll progress indicator - fixed on the right edge.
 */
export function ScrollProgress() {
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
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="w-px h-32 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="w-full bg-[#00d4aa]"
          style={{ height: `${progress * 100}%` }}
          initial={{ height: 0 }}
          animate={{ height: `${progress * 100}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  )
}
