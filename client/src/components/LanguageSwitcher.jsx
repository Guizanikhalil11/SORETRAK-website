import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'fr' : 'ar'
    i18n.changeLanguage(newLang)
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLang
  }

  return (
    <div className="flex items-center text-sm font-medium border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={() => { if (i18n.language !== 'ar') toggleLanguage() }}
        className={`px-3 py-1.5 transition-all duration-200 ${i18n.language === 'ar' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        AR
      </button>
      <span className="w-px h-5 bg-gray-300" />
      <button
        onClick={() => { if (i18n.language !== 'fr') toggleLanguage() }}
        className={`px-3 py-1.5 transition-all duration-200 ${i18n.language === 'fr' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        FR
      </button>
    </div>
  )
}
