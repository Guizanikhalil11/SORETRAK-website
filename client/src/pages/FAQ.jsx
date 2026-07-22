import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, ChevronDown, HelpCircle, Loader2 } from 'lucide-react'
import axios from 'axios'

export default function FAQ() {
  const { t, i18n } = useTranslation()
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [openIndex, setOpenIndex] = useState(null)

  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'ar'
  const categories = ['all', 'general', 'tickets', 'routes', 'subscriptions', 'luggage']

  useEffect(() => {
    axios.get('/api/faq')
      .then(res => {
        const data = res.data
        setFaqs(Array.isArray(data) ? data : data.faqs || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getQ = (faq) => lang === 'fr' ? (faq.questionFr || faq.questionAr || '') : (faq.questionAr || faq.questionFr || '')
  const getA = (faq) => lang === 'fr' ? (faq.answerFr || faq.answerAr || '') : (faq.answerAr || faq.answerFr || '')

  const filteredFaqs = faqs.filter(faq => {
    const q = getQ(faq).toLowerCase()
    const a = getA(faq).toLowerCase()
    const matchesSearch = !searchTerm || q.includes(searchTerm.toLowerCase()) || a.includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="pt-[40px]">
      <div className="bg-gradient-to-r from-dark via-primary-dark to-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('faq.title')}</h1>
            <p className="text-xl text-white/80">{t('faq.heroSubtitle')}</p>
          </div>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('faq.searchPlaceholder')}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-secondary focus:border-transparent text-lg shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-secondary to-secondary-dark text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t(`faq.${cat}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="text-center py-20">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{t('faq.noResults')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={faq._id || index}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
                  >
                    <span className="font-bold text-dark pr-4">{getQ(faq)}</span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${openIndex === index ? 'bg-secondary text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 animate-fadeIn">
                      {getA(faq)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
