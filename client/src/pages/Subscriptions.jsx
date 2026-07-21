import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { GraduationCap, Building2, CreditCard, Download, FileText, Loader2, CheckCircle } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import axios from 'axios'

export default function Subscriptions() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)

  const subscriptionTypes = [
    { key: 'school', icon: GraduationCap, color: 'from-primary to-primary-dark', borderColor: 'border-primary' },
    { key: 'university', icon: GraduationCap, color: 'from-secondary to-secondary-dark', borderColor: 'border-secondary' },
    { key: 'commercial', icon: Building2, color: 'from-[#1565C0] to-[#0D47A1]', borderColor: 'border-[#1565C0]' },
    { key: 'currency', icon: CreditCard, color: 'from-[#6A1B9A] to-[#4A148C]', borderColor: 'border-[#6A1B9A]' },
  ]

  useEffect(() => {
    axios.get('/api/subscriptions')
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="pt-[40px]">
      <div className="bg-gradient-to-r from-dark via-primary-dark to-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('subscriptions.title')}</h1>
            <p className="text-xl text-white/80">{t('subscriptions.heroSubtitle')}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subscriptionTypes.map((sub) => (
                <div
                  key={sub.key}
                  className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border-t-4 ${sub.borderColor} hover:-translate-y-2 group`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${sub.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <sub.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-2">
                    {t(`subscriptions.${sub.key}.title`)}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {t(`subscriptions.${sub.key}.description`)}
                  </p>
                  <div className="text-secondary font-bold text-lg mb-4">
                    {t(`subscriptions.${sub.key}.price`)}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {[1, 2, 3].map((i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span>ميزة {i} للاشتراك</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-gradient-to-r from-secondary to-secondary-dark text-white py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-secondary/30 transition-all duration-300 hover:-translate-y-0.5">
                    {t('subscriptions.applyNow')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('subscriptions.downloadForms')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['school', 'university', 'commercial'].map((type) => (
              <div
                key={type}
                className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-secondary group-hover:to-secondary-dark transition-all duration-300">
                  <FileText className="w-6 h-6 text-secondary group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-dark">{t(`subscriptions.${type}.title`)}</h4>
                  <p className="text-sm text-gray-500">PDF</p>
                </div>
                <button className="p-2.5 text-secondary hover:bg-secondary-light rounded-xl transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
