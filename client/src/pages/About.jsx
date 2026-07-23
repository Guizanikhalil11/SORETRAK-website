import { useTranslation } from 'react-i18next'
import { Target, Eye, Heart, Calendar, Users, Bus, TrendingUp } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function About() {
  const { t, i18n } = useTranslation()

  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'ar'

  const aboutIntroRef = useScrollReveal()
  const timelineRef = useScrollReveal()
  const missionRef = useScrollReveal()

  const stats = [
    { icon: Bus, value: '200+', label: t('home.stats.buses') },
    { icon: Users, value: '500+', label: lang === 'fr' ? 'Employés' : 'موظف' },
    { icon: Calendar, value: '30+', label: t('home.stats.years') },
    { icon: TrendingUp, value: '10K+', label: t('home.stats.passengers') },
  ]

  const timeline = lang === 'fr' ? [
    { year: '1990', title: 'Fondation', desc: 'Création de la société dans le but de fournir des services de transport public aux citoyens de Kairouan et des régions environnantes.' },
    { year: '2000', title: 'Expansion', desc: 'Extension de la flotte et ouverture de nouvelles lignes reliant Kairouan aux grandes villes tunisiennes.' },
    { year: '2010', title: 'Modernisation', desc: 'Renouvellement de la flotte avec les derniers modèles de bus équipés des normes les plus élevées de sécurité et de confort.' },
    { year: '2014', title: 'Nouvelles lignes', desc: 'Lancement de la ligne Kairouan - Tunis via El Fahs et renforcement de la flotte avec 5 petits bus climatisés OTOKAR.' },
    { year: '2020', title: 'Numérisation', desc: 'Introduction des technologies modernes dans la gestion et amélioration des services numériques pour les voyageurs.' },
    { year: '2024', title: 'Innovation', desc: 'Mise en place d\'un site web moderne avec assistant virtuel et suivi en temps réel des bus.' },
  ] : [
    { year: '1990', title: 'التأسيس', desc: 'تأسيس الشركة بهدف توفير خدمات النقل العام لمواطني القيروان والمناطق المجاورة.' },
    { year: '2000', title: 'التوسع', desc: 'توسيع الأسطول وافتتاح خطوط جديدة تربط القيروان بالمدن الكبرى التونسية.' },
    { year: '2010', title: 'التحديث', desc: 'تحديث الأسطول بأحدث أنواع الحافلات المجهزة بأعلى معايير السلامة والراحة.' },
    { year: '2014', title: 'خطوط جديدة', desc: 'إطلاق خط القيروان - تونس عبر الفحص وتعزيز الأسطول ب 5 حافلات صغيرة مكيفة من نوع OTOKAR.' },
    { year: '2020', title: 'الرقمية', desc: 'إدخال التقنيات الحديثة في الإدارة وتحسين الخدمات الرقمية للمسافرين.' },
    { year: '2024', title: 'الابتكار', desc: 'إطلاق موقع إلكتروني حديث مع مساعد افتراضي وتتبع مباشر للحافلات.' },
  ]

  return (
    <div className="pt-[40px]">
      <div className="bg-gradient-to-r from-dark via-primary-dark to-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-15" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fadeInUp">
            <span className="inline-flex items-center gap-2 bg-secondary/20 text-secondary text-xs font-bold px-4 py-2 rounded-full mb-4 border border-secondary/30">
              <img src="/images/tunisia-flag.svg" alt="Tunisia" className="w-5 h-3.5 object-cover rounded-sm" />
              {t('about.heroSubtitle').includes('histoire') ? 'République Tunisienne - Ministère des Transports' : 'جمهورية تونس - وزارة النقل'}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('about.heroSubtitle').includes('histoire')
                ? 'Société Régionale de Transport de Kairouan'
                : 'الشركة الجهوية للنقل بالقيروان'}
            </h1>
            <p className="text-xl text-white/80">{t('about.heroSubtitle')}</p>
          </div>
        </div>
      </div>

      <section ref={aboutIntroRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-secondary-light text-secondary text-xs font-bold px-4 py-2 rounded-full mb-4">{t('about.whoWeAre')}</span>
              <h2 className="text-3xl font-bold text-dark mb-6">{t('about.heroSubtitle').includes('histoire') ? 'Qui Sommes-Nous?' : 'من نحن؟'}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{t('about.whoWeAreText')}</p>
              <p className="text-gray-600 leading-relaxed">{t('about.historyText')}</p>
            </div>
            <div className="relative rounded-2xl overflow-hidden animate-slideInRight">
              <img src="/images/about-company.jpg" alt="SORETRAK" className="w-full h-80 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center bg-white/95 backdrop-blur rounded-xl p-4 shadow-xl">
                    <stat.icon className="w-6 h-6 text-secondary mx-auto mb-1" />
                    <div className="text-xl font-bold text-dark">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={timelineRef} className="py-24 bg-light relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionTitle title={t('about.history')} />
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary via-secondary to-primary hidden md:block" />
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center gap-4 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="flex-1 text-center md:text-end">
                    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 inline-block border border-gray-100">
                      <div className="text-secondary font-bold text-xl mb-1">{item.year}</div>
                      <h3 className="text-lg font-bold text-dark mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 bg-gradient-to-br from-primary to-secondary rounded-full z-10 flex-shrink-0 shadow-lg border-2 border-white" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={missionRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: t('about.mission'), text: t('about.missionText'), color: 'from-primary to-primary-dark' },
              { icon: Eye, title: t('about.vision'), text: t('about.visionText'), color: 'from-secondary to-secondary-dark' },
              { icon: Heart, title: t('about.values'), text: t('about.valuesText'), color: 'from-[#1565C0] to-[#0D47A1]' },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-8 bg-light rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
