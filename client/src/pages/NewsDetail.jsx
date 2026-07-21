import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link } from 'react-router-dom'
import { Calendar, ArrowLeft, Loader2 } from 'lucide-react'
import axios from 'axios'

export default function NewsDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/news/${id}`)
      .then(res => {
        setArticle(res.data.news || res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="pt-[40px] flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="pt-[40px] text-center py-20">
        <p className="text-gray-500 text-lg">{t('news.noNews')}</p>
      </div>
    )
  }

  return (
    <div className="pt-[40px]">
      <div className="bg-gradient-to-r from-primary to-primary-dark py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/news"
            target="_blank"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('news.backToList')}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {article.titleAr || article.title}
          </h1>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Calendar className="w-4 h-4" />
            <span>{t('news.publishedAt')} {new Date(article.createdAt || article.date).toLocaleDateString()}</span>
          </div>

          {article.image && (
            <img src={article.image} alt={article.title} className="w-full h-64 md:h-96 object-cover rounded-xl mb-8" />
          )}

          <div className="prose prose-lg max-w-none">
            {(article.contentAr || article.content || '').split('\n').map((paragraph, i) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>
            ))}
            {!(article.contentAr || article.content) && (
              <p className="text-gray-700 leading-relaxed">
                محتوى المقال غير متوفر حالياً.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
