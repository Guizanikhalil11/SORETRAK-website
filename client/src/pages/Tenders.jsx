import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Loader2, FileText, Briefcase, HelpCircle, Bell } from 'lucide-react'
import axios from 'axios'

const categories = [
  { key: 'tenders', icon: FileText },
  { key: 'consultation', icon: HelpCircle },
  { key: 'jobs', icon: Briefcase },
  { key: 'other', icon: Bell },
]

export default function Tenders() {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState('tenders')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'ar'
  const getTitle = (item) => lang === 'fr' ? (item.titleFr || item.titleAr || '') : (item.titleAr || item.titleFr || '')
  const getContent = (item) => lang === 'fr' ? (item.contentFr || item.contentAr || '') : (item.contentAr || item.contentFr || '')

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/tenders?category=${activeTab}`)
      .then(res => {
        setItems(res.data.tenders || res.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [activeTab])

  return (
    <div className="pt-[40px]">
      <div className="bg-gradient-to-r from-dark via-primary-dark to-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('tenders.title')}</h1>
            <p className="text-xl text-white/80">{t('tenders.heroSubtitle')}</p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-light min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === cat.key
                    ? 'bg-gradient-to-r from-secondary to-secondary-dark text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {t(`tenders.categories.${cat.key}`)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t('common.noData')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <div
                  key={item._id || index}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-secondary font-medium mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(item.createdAt || item.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-dark mb-2 group-hover:text-primary transition-colors">{getTitle(item)}</h3>
                    <p className="text-gray-500 text-sm line-clamp-4">{getContent(item)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
