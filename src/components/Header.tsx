import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'software', label: 'Software' },
  { id: 'about', label: 'About' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'advisory', label: 'Advisory' },
  { id: 'cta', label: 'Contact' },
]

export function Header() {
  const [activeId, setActiveId] = useState('hero')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = SECTIONS.map((s) => ({
        ...s,
        el: document.getElementById(s.id),
      }))
      const viewportMiddle = window.scrollY + window.innerHeight / 2
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].el
        if (el && el.offsetTop <= viewportMiddle) {
          setActiveId(sections[i].id)
          break
        }
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'panel border-b border-white/[0.06]' : ''
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => scrollTo('hero')}
          className="flex flex-col items-start text-left text-[#00d4aa] hover:text-[#00d4aa]/80 transition-colors"
        >
          <span className="font-mono text-lg lg:text-xl tracking-[0.15em] font-bold">
            PANTOS LAB
          </span>
          <span className="font-mono text-[10px] lg:text-xs tracking-[0.15em] text-white/50 hover:text-white/70">
            PantOS Lab LLC
          </span>
        </button>

        <ul className="hidden md:flex items-center gap-8">
          {SECTIONS.slice(1, -1).map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => scrollTo(s.id)}
                className={`text-xs tracking-widest uppercase transition-colors ${
                  activeId === s.id ? 'text-[#00d4aa]' : 'text-white/50 hover:text-white/80'
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => scrollTo('cta')}
            className="hidden md:block text-xs tracking-widest uppercase text-white/70 hover:text-[#00d4aa] transition-colors"
          >
            Contact
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden w-10 h-10 flex flex-col justify-center gap-1.5"
            aria-label="Menu"
          >
            <span className={`w-5 h-px bg-white/70 transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-px bg-white/70 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-px bg-white/70 transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/[0.06] bg-[#0a0b0d]/98 backdrop-blur-xl overflow-hidden"
          >
          <ul className="py-4 px-6 space-y-4">
            {SECTIONS.slice(1).map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  className={`block w-full text-left text-sm tracking-widest uppercase ${
                    activeId === s.id ? 'text-[#00d4aa]' : 'text-white/70'
                  }`}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
