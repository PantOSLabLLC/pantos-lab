import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FORM_ENDPOINT = 'https://formsubmit.co/lt.alexanderpahomow@gmail.com'

interface RequestModalProps {
  isOpen: boolean
  onClose: () => void
  requestType: string
}

export function RequestModal({ isOpen, onClose, requestType }: RequestModalProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set('_subject', `Request: ${requestType}`)
    formData.set('_captcha', 'false')

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.message || 'Failed to send')
        setStatus('error')
      }
    } catch {
      setError('Network error')
      setStatus('error')
    }
  }

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onEsc)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onEsc)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop - click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative panel w-full max-w-md rounded-2xl p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              aria-label="Close"
            >
              <span className="text-2xl">×</span>
            </button>

            <h3 className="font-heading text-xl font-medium text-white mb-2">
              {requestType}
            </h3>
            <p className="text-sm text-white/60 mb-8">
              Fill out the form and we will get back to you.
            </p>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <p className="text-[#00d4aa] font-medium mb-4">Message sent</p>
                <p className="text-white/60 text-sm mb-6">
                  We will be in touch shortly.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl font-mono text-sm tracking-[0.15em] text-white/80 hover:text-[#00d4aa] transition-colors"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="request_type" value={requestType} />
                <div>
                  <label htmlFor="email" className="block text-xs font-mono tracking-[0.15em] text-white/50 mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 focus:border-[#00d4aa]/50 focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-xs font-mono tracking-[0.15em] text-white/50 mb-2">
                    Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 focus:border-[#00d4aa]/50 focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-mono tracking-[0.15em] text-white/50 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 focus:border-[#00d4aa]/50 focus:outline-none transition-colors resize-none"
                    placeholder="Your message..."
                  />
                </div>
                {error && (
                  <p className="text-red-400/90 text-sm">{error}</p>
                )}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex-1 py-4 px-6 rounded-xl font-mono text-sm tracking-[0.15em] bg-[#00d4aa]/20 text-[#00d4aa] hover:bg-[#00d4aa]/30 disabled:opacity-50 transition-colors"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-4 rounded-xl font-mono text-sm tracking-[0.15em] text-white/60 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
