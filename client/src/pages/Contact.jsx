import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function Contact() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await axios.post('/api/contact', form)
      toast.success(t('contact.form.success'))
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch {
      toast.error(t('contact.form.error'))
    } finally {
      setSending(false)
    }
  }

  const contactInfo = [
    { icon: Phone, label: t('contact.info.phone'), value: t('contact.phone1'), color: 'from-primary to-primary-dark' },
    { icon: Mail, label: t('contact.info.email'), value: t('contact.email1'), color: 'from-secondary to-secondary-dark' },
    { icon: MapPin, label: t('contact.info.address'), value: t('contact.address'), color: 'from-primary to-primary-dark' },
    { icon: Clock, label: t('contact.info.hours'), value: t('contact.hours'), color: 'from-secondary to-secondary-dark' },
  ]

  return (
    <div className="pt-[40px]">
      <div className="bg-gradient-to-r from-dark via-primary-dark to-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/soretrak-bus.jpg')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('contact.title')}</h1>
            <p className="text-xl text-white/80">{t('contact.heroSubtitle')}</p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-light rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.name')}</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.email')}</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.phone')}</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.subject')}</label>
                    <input type="text" name="subject" value={form.subject} onChange={handleChange} required
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white shadow-sm" />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.message')}</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent resize-none bg-white shadow-sm" />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-gradient-to-r from-secondary to-secondary-dark text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-secondary/30 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 hover:-translate-y-0.5"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('contact.form.send')}
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-light rounded-2xl p-6 flex items-start gap-4 hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark mb-1">{info.label}</h4>
                    <p className="text-gray-500 text-sm">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="h-96 bg-gray-200 rounded-t-3xl mx-4 overflow-hidden mb-0">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52921.24873720587!2d10.08937665!3d35.6781971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13022b41e4781b63%3A0x41b853739296fb9b!2sKairouan%2C%20Tunisia!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="SORETRAK Location"
        />
      </section>
    </div>
  )
}
