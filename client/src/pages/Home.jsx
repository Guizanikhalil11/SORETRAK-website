import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { GraduationCap, Bus, Users, KeyRound, Shield, Heart, Globe, CheckCircle, ArrowRight, Star, Zap, Award, Quote } from 'lucide-react'
import Hero from '../components/Hero'
import SectionTitle from '../components/SectionTitle'
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal'
import axios from 'axios'

export default function Home() {
  const { t, i18n } = useTranslation()
  const [news, setNews] = useState([])
  const [routes, setRoutes] = useState([])

  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'ar'
  const getTitle = (item) => lang === 'fr' ? (item.titleFr || item.titleAr || '') : (item.titleAr || item.titleFr || '')
  const getContent = (item) => lang === 'fr' ? (item.contentFr || item.contentAr || '') : (item.contentAr || item.contentFr || '')

  const servicesRef = useScrollReveal()
  const routesRef = useScrollReveal()
  const newsRef = useScrollReveal()
  const testimonialsRef = useScrollReveal()
  const partnersRef = useScrollReveal()
  const featuresRef = useScrollReveal()
  const ctaRef = useScrollReveal()

  useEffect(() => {
    axios.get('/api/news?limit=3').then(res => setNews(res.data.news || res.data || [])).catch(() => {})
    axios.get('/api/routes?limit=6').then(res => setRoutes(res.data.routes || res.data || [])).catch(() => {})
  }, [])

  const services = [
    { icon: GraduationCap, title: t('home.services.student.title'), desc: t('home.services.student.description'), color: 'from-primary to-primary-dark', image: '/images/student-transport.jpg', link: '/subscriptions' },
    { icon: Bus, title: t('home.services.passenger.title'), desc: t('home.services.passenger.description'), color: 'from-secondary to-secondary-dark', image: '/images/passenger-transport.jpg', link: '/routes' },
    { icon: Users, title: t('home.services.currency.title'), desc: t('home.services.currency.description'), color: 'from-[#1565C0] to-[#0D47A1]', image: '/images/currency-transport.jpg', link: '/contact' },
    { icon: KeyRound, title: t('home.services.rental.title'), desc: t('home.services.rental.description'), color: 'from-[#6A1B9A] to-[#4A148C]', image: '/images/bus-rental.jpg', link: '/contact' },
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

      <section ref={servicesRef} className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('home.servicesTitle')} subtitle={t('home.servicesSubtitle')} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 group hover-lift"
              >
                <div className="h-44 overflow-hidden relative">
                  <img src={service.image} alt={service.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                </div>
                <div className="p-6 relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-4 -mt-11 relative z-10 shadow-xl`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-dark mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
                  <span className="inline-flex items-center gap-1 text-secondary font-medium text-sm mt-3 group-hover:gap-2 transition-all duration-300">
                    {i18n.language === 'fr' ? 'En savoir plus' : 'المزيد من التفاصيل'} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {routes.length > 0 && (
        <section ref={routesRef} className="py-24 bg-light relative overflow-hidden">
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
        <section ref={newsRef} className="py-24 bg-white">
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
                      <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-sm text-secondary font-medium mb-2">{new Date(item.createdAt || item.date).toLocaleDateString()}</div>
                    <h3 className="text-lg font-bold text-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">{getTitle(item)}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3">{getContent(item).substring(0, 150)}...</p>
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

      <section ref={testimonialsRef} className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionTitle
            title={lang === 'fr' ? 'Ce que disent nos voyageurs' : 'ماذا يقول مسافرونا'}
            subtitle={lang === 'fr' ? 'Témoignages de nos clients fidèles' : 'شهادات من عملائنا المخلصين'}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(lang === 'fr' ? [
              { name: 'Ahmed B.', role: 'Régulier Kairouan-Tunis', text: 'Service très fiable et ponctuel. Les bus sont confortables et bien entretenus. Je voyage depuis 5 ans avec SORETRAK sans aucun problème.' },
              { name: 'Fatma M.', role: 'Étudiante à l\'Université', text: 'L\'abonnement étudiant est très pratique et abordable. Les chauffeurs sont professionnels et la sécurité est assurée.' },
              { name: 'Mohamed S.', role: 'Commerçant', text: 'J\'utilise le service de transport de devises depuis 3 ans. Excellent service, ponctuel et très sécurisé. Je recommande vivement.' },
            ] : [
              { name: 'أحمد ب.', role: 'مسافر منتظم القيروان-تونس', text: 'خدمة موثوقة ومنتظمة جداً. الحافلات مريحة ومجهزة بشكل جيد. أسافر منذ 5 سنوات مع سوريترأك بدون أي مشكلة.' },
              { name: 'فاطمة م.', role: 'طالبة جامعية', text: 'الاشتراك الطلابي عملي جداً وبسعر مناسب. السائقون محترفون والسلامة مضمونة.' },
              { name: 'محمد س.', role: 'تاجر', text: 'أستخدم خدمة نقل العملات منذ 3 سنوات. خدمة ممتازة ومنتظمة وآمنة جداً. أنصح بها بشدة.' },
            ]).map((testimonial, index) => (
              <div
                key={index}
                className="bg-light rounded-2xl p-8 relative hover:shadow-xl transition-all duration-500 border border-gray-100 group hover:-translate-y-1"
              >
                <Quote className="w-10 h-10 text-secondary/20 absolute top-6 right-6" />
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-4 h-4 text-secondary fill-secondary" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-dark text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={partnersRef} className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title={lang === 'fr' ? 'Nos Partenaires' : 'شركاؤنا'}
            subtitle={lang === 'fr' ? 'Ensemble pour un meilleur transport public' : 'معاً من أجل نقل عام أفضل'}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              { name: lang === 'fr' ? 'Ministère des Transports' : 'وزارة النقل', url: 'https://www.transports.gov.tn' },
              { name: 'SNTT', url: '#' },
              { name: 'SOGITRA', url: '#' },
              { name: lang === 'fr' ? 'Gouvernorat de Kairouan' : 'ولاية القيروان', url: '#' },
            ].map((partner, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-center h-24 hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                <span className="text-gray-400 font-bold text-center group-hover:text-secondary transition-colors">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="py-24 bg-light relative overflow-hidden">
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

      <section ref={ctaRef} className="py-24 bg-gradient-to-r from-primary via-primary-dark to-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10" />
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
