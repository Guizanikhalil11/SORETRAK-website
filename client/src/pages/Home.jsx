import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { GraduationCap, Bus, DollarSign, KeyRound, Shield, Heart, Globe, CheckCircle, ArrowRight, Star, Zap, Award } from 'lucide-react'
import Hero from '../components/Hero'
import SectionTitle from '../components/SectionTitle'
import axios from 'axios'

export default function Home() {
  const { t } = useTranslation()
  const [news, setNews] = useState([])
  const [routes, setRoutes] = useState([])

  useEffect(() => {
    axios.get('/api/news?limit=3').then(res => setNews(res.data.news || res.data || [])).catch(() => {})
    axios.get('/api/routes?limit=6').then(res => setRoutes(res.data.routes || res.data || [])).catch(() => {})
  }, [])

  const services = [
    { icon: GraduationCap, title: t('home.services.student.title'), desc: t('home.services.student.description'), color: 'from-primary to-primary-dark', image: '/images/student-transport.jpg' },
    { icon: Bus, title: t('home.services.passenger.title'), desc: t('home.services.passenger.description'), color: 'from-secondary to-secondary-dark', image: '/images/passenger-transport.jpg' },
    { icon: DollarSign, title: t('home.services.currency.title'), desc: t('home.services.currency.description'), color: 'from-[#1565C0] to-[#0D47A1]', image: '/images/currency-transport.jpg' },
    { icon: KeyRound, title: t('home.services.rental.title'), desc: t('home.services.rental.description'), color: 'from-[#6A1B9A] to-[#4A148C]', image: '/images/bus-rental.jpg' },
  ]

  const features = [
    { icon: Shield, title: t('home.features.reliability.title'), desc: t('home.features.reliability.description'), color: 'text-primary' },
    { icon: Heart, title: t('home.features.comfort.title'), desc: t('home.features.comfort.description'), color: 'text-secondary' },
    { icon: Globe, title: t('home.features.coverage.title'), desc: t('home.features.coverage.description'), color: 'text-primary' },
    { icon: CheckCircle, title: t('home.features.safety.title'), desc: t('home.features.safety.description'), color: 'text-secondary' },
  ]

  return (
    <div>
      <Hero />

      <section className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('home.servicesTitle')} subtitle={t('home.servicesSubtitle')} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 group"
              >
                <div className="h-44 overflow-hidden relative">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                </div>
                <div className="p-6 relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-4 -mt-11 relative z-10 shadow-xl`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-dark mb-2">{service.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {routes.length > 0 && (
        <section className="py-24 bg-light relative overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <SectionTitle title={t('home.popularRoutesTitle')} subtitle={t('home.popularRoutesSubtitle')} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((route, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 group hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="text-center">
                      <div className="font-bold text-dark text-lg">{route.departure}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{route.departureTime || '08:00'}</div>
                    </div>
                    <div className="flex-1 px-4">
                      <div className="border-t-2 border-dashed border-gray-200 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
                          <Bus className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-dark text-lg">{route.arrival}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{route.arrivalTime || '12:00'}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Zap className="w-4 h-4 text-secondary" />
                      <span>{route.schedule}</span>
                    </div>
                    <span className="text-secondary font-bold text-lg">{route.price} <span className="text-sm font-normal text-gray-500">د.ت</span></span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/routes"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                {t('home.viewAll')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {news.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title={t('home.newsTitle')} subtitle={t('home.newsSubtitle')} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 group hover:-translate-y-1"
                >
                  {item.image && (
                    <div className="h-48 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-sm text-secondary font-medium mb-2">{new Date(item.createdAt || item.date).toLocaleDateString()}</div>
                    <h3 className="text-lg font-bold text-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">{item.titleAr || item.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3">{(item.contentAr || item.content || '').substring(0, 150)}...</p>
                    <Link
                      to={`/news/${item._id || item.id}`}
                      className="inline-flex items-center gap-1 text-secondary font-medium mt-4 hover:gap-2 transition-all duration-300 group/link"
                    >
                      {t('home.readMore')} <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 bg-light relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionTitle title={t('home.whyTitle')} subtitle={t('home.whySubtitle')} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 group"
              >
                <div className="w-16 h-16 bg-light rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-primary via-primary-dark to-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/soretrak-bus.jpg')] bg-cover bg-center opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Award className="w-4 h-4 text-secondary" />
            {t('about.heroSubtitle').includes('histoire') ? 'Depuis plus de 30 ans' : 'منذ أكثر من 30 عاماً'}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('home.ctaTitle')}</h2>
          <p className="text-xl text-white/80 mb-8">{t('home.ctaSubtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/subscriptions"
              className="bg-gradient-to-r from-secondary to-secondary-dark text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-secondary/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              {t('home.ctaButton')}
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white/40 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-all duration-300 hover:border-white/60"
            >
              {t('nav.contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
