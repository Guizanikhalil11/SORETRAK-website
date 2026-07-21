import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Bus } from 'lucide-react'

const navLinks = [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about' },
  { key: 'activities', path: '/activities' },
  { key: 'routes', path: '/routes' },
  { key: 'news', path: '/news' },
  { key: 'faq', path: '/faq' },
  { key: 'contact', path: '/contact' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isRTL = i18n.language === 'ar'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsOpen(false) }, [location])

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'fr' : 'ar'
    i18n.changeLanguage(newLang)
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLang
  }

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language, isRTL])

  return (
    <>
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary w-full fixed top-0 left-0 right-0 z-[60]" />
      <nav className={`fixed top-1 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-secondary group-hover:to-secondary-dark transition-all duration-300 shadow-md">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-dark leading-tight tracking-wide">SORETRAK</span>
                <span className="text-[10px] text-gray-500 leading-tight">{t('about.heroSubtitle').includes('histoire') ? 'Société Régionale de Transport' : 'الشركة الجهوية للنقل بالقيروان'}</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  to={link.path}
                  className={`px-3.5 py-2 text-sm font-medium transition-all duration-200 rounded-lg relative ${
                    location.pathname === link.path
                      ? 'text-white bg-primary shadow-md'
                      : 'text-gray-700 hover:text-secondary hover:bg-secondary-light'
                  }`}
                >
                  {t(`nav.${link.key}`)}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center text-sm font-medium border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => { if (i18n.language !== 'ar') toggleLanguage() }}
                  className={`px-3 py-1.5 transition-all duration-200 ${i18n.language === 'ar' ? 'bg-gradient-to-r from-primary to-primary-dark text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  AR
                </button>
                <span className="w-px h-5 bg-gray-200" />
                <button
                  onClick={() => { if (i18n.language !== 'fr') toggleLanguage() }}
                  className={`px-3 py-1.5 transition-all duration-200 ${i18n.language === 'fr' ? 'bg-gradient-to-r from-secondary to-secondary-dark text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  FR
                </button>
              </div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl animate-fadeIn">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-white bg-gradient-to-r from-primary to-primary-dark shadow-md'
                      : 'text-gray-700 hover:bg-secondary-light hover:text-secondary'
                  }`}
                >
                  {t(`nav.${link.key}`)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
