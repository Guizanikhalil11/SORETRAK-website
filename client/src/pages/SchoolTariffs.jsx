import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Info } from 'lucide-react'
import axios from 'axios'

export default function SchoolTariffs() {
  const { i18n } = useTranslation()
  const [tariffs, setTariffs] = useState([])
  const [loading, setLoading] = useState(true)

  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'ar'
  const getName = (item) => lang === 'fr' ? (item.nameFr || item.nameAr || '') : (item.nameAr || item.nameFr || '')
  const getDescription = (item) => lang === 'fr' ? (item.descriptionFr || item.descriptionAr || '') : (item.descriptionAr || item.descriptionFr || '')

  useEffect(() => {
    axios.get('/api/school-tariffs')
      .then(res => {
        setTariffs(res.data.tariffs || res.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const title = lang === 'fr' ? 'Tarifs Scolaires' : 'أسعار النقل المدرسي'
  const subtitle = lang === 'fr'
    ? 'Consultez les tarifs de transport scolaire'
    : 'اطّلع على أسعار خدمات النقل المدرسي'
  const colLine = lang === 'fr' ? 'Ligne' : 'الخط'
  const colPrice = lang === 'fr' ? 'Prix (DT)' : 'السعر (د.ت)'
  const colDesc = lang === 'fr' ? 'Description' : 'الوصف'

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-5 mb-10 flex items-start gap-3 border border-primary/20">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === 'fr'
                ? 'Les prix d\'abonnement sont de 200 DT/an pour le transport scolaire et 300 DT/an pour le transport universitaire.'
                : 'أسعار الاشتراك: 200 د.ت/سنة للنقل المدرسي، 300 د.ت/سنة للنقل الجامعي.'}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            </div>
          ) : tariffs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{lang === 'fr' ? 'Aucun tarif disponible' : 'لا توجد أسعار متاحة حالياً'}</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-primary-dark text-white">
                      <th className="px-6 py-4 text-start text-sm font-bold">{colLine}</th>
                      <th className="px-6 py-4 text-center text-sm font-bold">{colPrice}</th>
                      <th className="px-6 py-4 text-end text-sm font-bold">{colDesc}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tariffs.map((tariff, index) => (
                      <tr
                        key={tariff._id || index}
                        className={`border-b border-gray-100 transition-colors hover:bg-secondary-light/30 ${index % 2 === 0 ? 'bg-white' : 'bg-light/50'}`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-dark">{getName(tariff)}</td>
                        <td className="px-6 py-4 text-sm text-center font-bold text-secondary">{tariff.price} DT</td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-end">{getDescription(tariff)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
