import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, Bus, Route, Users, Clock, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from './StatCard'

const tunisianCities = [
  'القيروان', 'تونس', 'صفاقس', 'سوسة', 'المنستير',
  'بنزرت', 'قابس', 'قفصة', 'نابل', 'المهدية',
  'باجة', 'جندوبة', 'الكاف', 'سليانة', 'زغوان',
  'بن عروس', 'أريانة', 'منوبة', 'تطاوين', 'مدنين',
  'توزر', 'قبلي', 'سيدي بوزيد', 'القصرين'
]

export default function Hero() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    if (date) params.set('date', date)
    navigate(`/routes?${params.toString()}`)
  }

  const stats = [
    { icon: Bus, value: '200+', label: t('home.stats.buses') },
    { icon: Route, value: '50+', label: t('home.stats.routes') },
    { icon: Users, value: '10K+', label: t('home.stats.passengers') },
    { icon: Clock, value: '30+', label: t('home.stats.years') },
  ]

  return (
    <div className="relative pt-[40px]">
      <div className="relative min-h-[650px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-primary-dark/90 to-primary/80" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInLeft">
              <span className="inline-flex items-center gap-2 bg-secondary/15 text-secondary text-xs font-bold px-5 py-2.5 rounded-full mb-6 border border-secondary/25 backdrop-blur-sm">
                <img src="/images/tunisia-flag.svg" alt="Tunisia" className="w-5 h-3.5 object-cover rounded-sm" />
                {t('about.heroSubtitle').includes('histoire')
                  ? 'République Tunisienne - Ministère des Transports'
                  : 'الجمهورية التونسية - وزارة النقل'}
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-[4.2rem] font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                {t('home.heroTitle')}
              </h1>
              <p className="text-2xl text-white/70 mb-10 leading-relaxed max-w-lg">
                {t('home.heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/routes"
                  className="bg-gradient-to-r from-secondary to-secondary-dark hover:from-secondary-dark hover:to-secondary text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-300 text-center shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 hover:-translate-y-0.5"
                >
                  {t('home.searchButton')}
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-white/40 text-white hover:bg-white/10 font-bold py-3.5 px-8 rounded-xl transition-all duration-300 text-center hover:border-white/60"
                >
                  {t('nav.about')}
                </Link>
              </div>
            </div>

            <div className="hidden lg:block animate-slideInRight">
              <form onSubmit={handleSearch} className="glass-premium rounded-3xl shadow-2xl p-8 border border-white/20">
                <h3 className="text-dark font-extrabold text-xl mb-5 flex items-center gap-2">
                  <Search className="w-5 h-5 text-secondary" />
                  {t('home.searchButton')}
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                    <select
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent appearance-none bg-white text-sm shadow-sm"
                      required
                    >
                      <option value="">{t('home.searchFrom')}</option>
                      {tunisianCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                    <select
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent appearance-none bg-white text-sm shadow-sm"
                      required
                    >
                      <option value="">{t('home.searchTo')}</option>
                      {tunisianCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent text-sm shadow-sm"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-secondary to-secondary-dark hover:from-secondary-dark hover:to-secondary text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <Search className="w-5 h-5" />
                    {t('home.searchButton')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-dark via-darker to-dark relative -mt-1 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatCard key={index} icon={stat.icon} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
