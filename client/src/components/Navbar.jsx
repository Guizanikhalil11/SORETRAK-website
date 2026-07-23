import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about' },
  { key: 'activities', path: '/activities' },
  { key: 'routes', path: '/routes', children: [
    { key: 'schoolTariffs', path: '/school-tariffs' },
    { key: 'commercialTariffs', path: '/commercial-tariffs' },
  ]},
  { key: 'news', path: '/news' },
  { key: 'faq', path: '/faq' },
  { key: 'contact', path: '/contact' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const isRTL = i18n.language === 'ar'
  const closeTimeout = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 10)
      if (currentY > 80) {
        if (currentY > lastScrollY.current + 5) {
          setHidden(true)
          setIsOpen(false)
        } else if (currentY < lastScrollY.current - 5) {
          setHidden(false)
        }
      } else {
        setHidden(false)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
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
      <div className={`h-1 bg-gradient-to-r from-primary via-secondary to-primary w-full fixed top-0 left-0 right-0 z-[60] transition-transform duration-300 ${hidden ? '-translate-y-full' : ''}`} />
      <nav className={`fixed top-1 left-0 right-0 z-50 transition-all duration-300 ${hidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'} ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group min-w-0">
              <img src="/images/soretrak-logo.png" alt="SORETRAK" className="h-10 w-auto object-contain flex-shrink-0 group-hover:scale-105 transition-transform duration-300" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-xs font-bold text-primary leading-tight whitespace-nowrap truncate">
                  {isRTL ? 'الشركة الجهوية للنقل بالقيروان' : 'Société Régionale de Transport de Kairouan'}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-dark tracking-wider leading-tight">SORETRAK</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <div
                  key={link.key}
                  className="relative"
                  onMouseEnter={() => {
                    if (closeTimeout.current) { clearTimeout(closeTimeout.current); closeTimeout.current = null }
                    if (link.children) setOpenDropdown(link.key)
                  }}
                  onMouseLeave={() => {
                    if (link.children) {
                      closeTimeout.current = setTimeout(() => setOpenDropdown(null), 150)
                    }
                  }}
                >
                  <Link
                    to={link.path}
                    className={`px-3.5 py-2 text-sm font-medium transition-all duration-200 rounded-lg relative flex items-center gap-1 ${
                      location.pathname === link.path
                        ? 'text-white bg-primary shadow-md'
                        : 'text-gray-700 hover:text-secondary hover:bg-secondary-light'
                    }`}
                    aria-expanded={link.children ? openDropdown === link.key : undefined}
                    aria-haspopup={link.children ? 'true' : undefined}
                  >
                    {t(`nav.${link.key}`)}
                    {link.children && (
                      <svg className={`w-3 h-3 transition-transform duration-200 ${openDropdown === link.key ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    )}
                  </Link>
                  {link.children && openDropdown === link.key && (
                    <div className="absolute top-full left-0 pt-3 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px] z-50 animate-fadeIn">
                      {link.children.map((child) => (
                        <Link
                          key={child.key}
                          to={child.path}
                          className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                            location.pathname === child.path
                              ? 'text-white bg-gradient-to-r from-primary to-primary-dark'
                              : 'text-gray-700 hover:bg-secondary-light hover:text-secondary'
                          }`}
                        >
                          {t(`nav.${child.key}`)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center text-sm font-medium border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => { if (i18n.language !== 'ar') toggleLanguage() }}
                  className={`px-3 py-1.5 transition-all duration-200 ${i18n.language === 'ar' ? 'bg-gradient-to-r from-primary to-primary-dark text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  aria-label="Switch to Arabic"
                >
                  AR
                </button>
                <span className="w-px h-5 bg-gray-200" />
                <button
                  onClick={() => { if (i18n.language !== 'fr') toggleLanguage() }}
                  className={`px-3 py-1.5 transition-all duration-200 ${i18n.language === 'fr' ? 'bg-gradient-to-r from-secondary to-secondary-dark text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  aria-label="Switch to French"
                >
                  FR
                </button>
              </div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
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
                <div key={link.key}>
                  <Link
                    to={link.path}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      location.pathname === link.path
                        ? 'text-white bg-gradient-to-r from-primary to-primary-dark shadow-md'
                        : 'text-gray-700 hover:bg-secondary-light hover:text-secondary'
                    }`}
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                  {link.children && link.children.map((child) => (
                    <Link
                      key={child.key}
                      to={child.path}
                      className={`block px-8 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                        location.pathname === child.path
                          ? 'text-white bg-gradient-to-r from-primary to-primary-dark shadow-md'
                          : 'text-gray-500 hover:bg-secondary-light hover:text-secondary'
                      }`}
                    >
                      {t(`nav.${child.key}`)}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
