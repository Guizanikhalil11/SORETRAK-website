import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function BackToTop() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-6 z-40 w-12 h-12 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      aria-label={t('common.backToTop')}
      title={t('common.backToTop')}
    >
      <ChevronUp className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  )
}
