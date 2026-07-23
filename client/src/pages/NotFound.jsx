import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'ar'

  return (
    <div className="pt-[40px] min-h-screen flex items-center justify-center bg-light">
      <div className="text-center px-4">
        <div className="text-[120px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary leading-none mb-4">
          404
        </div>
        <h1 className="text-3xl font-bold text-dark mb-4">
          {lang === 'fr' ? 'Page non trouvée' : 'الصفحة غير موجودة'}
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
          {lang === 'fr'
            ? 'La page que vous recherchez n\'existe pas ou a été déplacée.'
            : 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Home className="w-5 h-5" />
            {lang === 'fr' ? 'Retour à l\'accueil' : 'العودة للرئيسية'}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-600 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            {lang === 'fr' ? 'Page précédente' : 'الصفحة السابقة'}
          </button>
        </div>
      </div>
    </div>
  )
}
