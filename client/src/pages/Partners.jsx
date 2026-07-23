import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, ExternalLink } from 'lucide-react'
import axios from 'axios'

export default function Partners() {
  const { i18n } = useTranslation()
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)

  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'ar'
  const getName = (item) => lang === 'fr' ? (item.nameFr || item.nameAr || '') : (item.nameAr || item.nameFr || '')

  useEffect(() => {
    axios.get('/api/partners')
      .then(res => {
        setPartners(res.data.partners || res.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const title = lang === 'fr' ? 'Nos Partenaires' : 'شركاؤنا'
  const subtitle = lang === 'fr'
    ? 'Découvrez nos partenaires de transport à travers la Tunisie'
    : 'تعرّف على شركائنا في النقل عبر تونس'

  return (
    <div className="pt-[40px]">
      <div className="bg-gradient-to-r from-dark via-primary-dark to-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
            <p className="text-xl text-white/80">{subtitle}</p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-light min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{lang === 'fr' ? 'Aucun partenaire disponible' : 'لا يوجد شركاء متاحون حالياً'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner, index) => (
                <a
                  key={partner._id || index}
                  href={partner.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group hover:-translate-y-1 p-6 flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {partner.logo ? (
                      <img src={partner.logo} alt={getName(partner)} loading="lazy" className="w-12 h-12 object-contain" />
                    ) : (
                      <ExternalLink className="w-7 h-7 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-dark group-hover:text-primary transition-colors truncate">{getName(partner)}</h3>
                    {partner.url && (
                      <p className="text-sm text-gray-400 truncate">{partner.url}</p>
                    )}
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-secondary transition-colors flex-shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
