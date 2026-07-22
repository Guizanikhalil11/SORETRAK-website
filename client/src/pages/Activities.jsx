import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { GraduationCap, Bus, DollarSign, KeyRound, CheckCircle, Loader2 } from 'lucide-react'
import axios from 'axios'

export default function Activities() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)

  const activityImages = [
    '/images/student-transport.jpg',
    '/images/passenger-transport.jpg',
    '/images/currency-transport.jpg',
    '/images/bus-rental.jpg',
  ]

  const defaultActivities = [
    {
      key: 'student',
      icon: GraduationCap,
      color: 'from-primary to-primary-dark',
      features: t('activities.student.features', { returnObjects: true })
    },
    {
      key: 'passenger',
      icon: Bus,
      color: 'from-secondary to-secondary-dark',
      features: t('activities.passenger.features', { returnObjects: true })
    },
    {
      key: 'currency',
      icon: DollarSign,
      color: 'from-[#1565C0] to-[#0D47A1]',
      features: t('activities.currency.features', { returnObjects: true })
    },
    {
      key: 'rental',
      icon: KeyRound,
      color: 'from-[#6A1B9A] to-[#4A148C]',
      features: t('activities.rental.features', { returnObjects: true })
    },
  ]

  useEffect(() => {
    axios.get('/api/activities')
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="pt-[40px]">
      <div className="bg-gradient-to-r from-dark via-primary-dark to-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('activities.title')}</h1>
            <p className="text-xl text-white/80">{t('activities.heroSubtitle')}</p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            </div>
          ) : (
            <div className="space-y-16">
              {defaultActivities.map((activity, index) => (
                <div
                  key={activity.key}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
                >
                  <div className={index % 2 === 0 ? 'order-1' : 'order-2'}>
                    <div className={`w-16 h-16 bg-gradient-to-br ${activity.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                      <activity.icon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-dark mb-4">
                      {t(`activities.${activity.key}.title`)}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {t(`activities.${activity.key}.description`)}
                    </p>
                    <ul className="space-y-3">
                      {activity.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={index % 2 === 0 ? 'order-2' : 'order-1'}>
                    <div className="rounded-2xl overflow-hidden shadow-xl h-72">
                      <img src={activityImages[index]} alt={t(`activities.${activity.key}.title`)} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
