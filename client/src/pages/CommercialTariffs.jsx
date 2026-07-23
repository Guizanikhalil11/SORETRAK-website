import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Clock } from 'lucide-react'
import axios from 'axios'

export default function CommercialTariffs() {
  const { i18n } = useTranslation()
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'ar'
  const getName = (item) => lang === 'fr' ? (item.nameFr || item.nameAr || '') : (item.nameAr || item.nameFr || '')

  useEffect(() => {
    axios.get('/api/routes?type=commercial')
      .then(res => {
        setRoutes(res.data.routes || res.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const title = lang === 'fr' ? 'Tarifs Commerciaux' : 'أسعار النقل التجاري'
  const subtitle = lang === 'fr'
    ? 'Consultez les tarifs et horaires des lignes commerciales interurbaines'
    : 'اطّلع على أسعار ومواعيد الخطوط التجارية بين المدن'
  const colRoute = lang === 'fr' ? 'Trajet' : 'الخط'
  const colDeparture = lang === 'fr' ? 'Départ' : 'الانطلاق'
  const colArrival = lang === 'fr' ? 'Arrivée' : 'الوصول'
  const colPrice = lang === 'fr' ? 'Prix (DT)' : 'السعر (د.ت)'
  const colDays = lang === 'fr' ? 'Jours' : 'الأيام'

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            </div>
          ) : routes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{lang === 'fr' ? 'Aucune ligne disponible' : 'لا توجد خطوط متاحة حالياً'}</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-primary-dark text-white">
                      <th className="px-6 py-4 text-start text-sm font-bold">{colRoute}</th>
                      <th className="px-6 py-4 text-center text-sm font-bold">{colDeparture}</th>
                      <th className="px-6 py-4 text-center text-sm font-bold">{colArrival}</th>
                      <th className="px-6 py-4 text-center text-sm font-bold">{colPrice}</th>
                      <th className="px-6 py-4 text-end text-sm font-bold">{colDays}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((route, index) => (
                      <tr
                        key={route._id || index}
                        className={`border-b border-gray-100 transition-colors hover:bg-secondary-light/30 ${index % 2 === 0 ? 'bg-white' : 'bg-light/50'}`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-dark">{getName(route)}</td>
                        <td className="px-6 py-4 text-sm text-center">
                          <span className="inline-flex items-center gap-1.5 text-gray-600">
                            <Clock className="w-3.5 h-3.5 text-secondary" />
                            {route.departureTime || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          <span className="inline-flex items-center gap-1.5 text-gray-600">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            {route.arrivalTime || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-center font-bold text-secondary">{route.price} DT</td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-end">{route.days || '-'}</td>
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
