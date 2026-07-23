import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, Loader2 } from 'lucide-react'
import axios from 'axios'

export default function News() {
  const { t, i18n } = useTranslation()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'ar'

  const getTitle = (item) => lang === 'fr' ? (item.titleFr || item.titleAr || '') : (item.titleAr || item.titleFr || '')
  const getContent = (item) => lang === 'fr' ? (item.contentFr || item.contentAr || '') : (item.contentAr || item.contentFr || '')

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/news?page=${page}&limit=9`)
      .then(res => {
        setNews(res.data.news || res.data || [])
        setTotalPages(res.data.totalPages || 1)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [page])

  return (
    <div className="pt-[40px]">
      <div className="bg-gradient-to-r from-dark via-primary-dark to-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('news.title')}</h1>
            <p className="text-xl text-white/80">{t('news.heroSubtitle')}</p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-light min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t('news.noNews')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group hover:-translate-y-1"
                  >
                    {item.image && (
                      <div className="h-48 overflow-hidden">
                        <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-secondary font-medium mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.createdAt || item.date).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-lg font-bold text-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">{getTitle(item)}</h3>
                      <p className="text-gray-500 text-sm line-clamp-3 mb-4">{getContent(item).substring(0, 150)}...</p>
                      <Link
                        to={`/news/${item._id || item.id}`}
                        className="inline-flex items-center gap-1 text-secondary font-medium hover:gap-2 transition-all duration-300"
                      >
                        {t('news.readMore')} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                        p === page
                          ? 'bg-gradient-to-r from-secondary to-secondary-dark text-white shadow-lg'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
