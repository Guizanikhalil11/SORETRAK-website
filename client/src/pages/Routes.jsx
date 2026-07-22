import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, MapPin, Clock, Bus, Loader2 } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import axios from 'axios'

export default function Routes() {
  const { t } = useTranslation()
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('school')
  const [searchTerm, setSearchTerm] = useState('')
  const [fromCity, setFromCity] = useState('')
  const [toCity, setToCity] = useState('')

  const cities = [
    'القيروان', 'تونس', 'صفاقس', 'سوسة', 'المنستير',
    'بنزرت', 'قابس', 'قفصة', 'نابل', 'المهدية',
    'باجة', 'جندوبة', 'الكاف', 'سليانة', 'زغوان'
  ]

  useEffect(() => {
    axios.get('/api/routes')
      .then(res => {
        setRoutes(res.data.routes || res.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = !searchTerm ||
      route.departure?.includes(searchTerm) ||
      route.arrival?.includes(searchTerm)
    const matchesFrom = !fromCity || route.departure === fromCity
    const matchesTo = !toCity || route.arrival === toCity
    const matchesType = activeTab === 'all' || route.type === activeTab
    return matchesSearch && matchesFrom && matchesTo && matchesType
  })

  return (
    <div className="pt-[40px]">
      <div className="bg-gradient-to-r from-dark via-primary-dark to-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/soretrak-bus.jpg')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('routes.title')}</h1>
            <p className="text-xl text-white/80">{t('routes.heroSubtitle')}</p>
          </div>
        </div>
      </div>

      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('routes.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent shadow-sm"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent shadow-sm"
              >
                <option value="">{t('routes.departure')}</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent shadow-sm"
              >
                <option value="">{t('routes.arrival')}</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            {['school', 'commercial'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-secondary to-secondary-dark text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t(`routes.${tab}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-light min-h-[400px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            </div>
          ) : filteredRoutes.length === 0 ? (
            <div className="text-center py-20">
              <Bus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{t('routes.noRoutes')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRoutes.map((route, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row items-center gap-4 border border-gray-100 group hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-center min-w-[80px]">
                      <div className="font-bold text-dark text-lg">{route.departure}</div>
                      <div className="text-sm text-gray-400">{route.departureTime || '08:00'}</div>
                    </div>
                    <div className="flex-1 px-4">
                      <div className="border-t-2 border-dashed border-gray-200 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
                          <Bus className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="text-center min-w-[80px]">
                      <div className="font-bold text-dark text-lg">{route.arrival}</div>
                      <div className="text-sm text-gray-400">{route.arrivalTime || '12:00'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{route.duration || '4 ساعات'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{route.type === 'school' ? t('routes.school') : t('routes.commercial')}</span>
                    </div>
                    <div className="text-secondary font-bold text-lg">
                      {route.price} <span className="text-sm font-normal text-gray-500">د.ت</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('routes.scheduleInfo')} />
          <div className="bg-light rounded-2xl p-8 text-center max-w-2xl mx-auto border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600">{t('routes.scheduleInfoText')}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
