import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white relative overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src="/images/soretrak-logo.png" alt="SORETRAK" className="h-12 w-auto object-contain" />
              <div>
                <span className="text-lg font-extrabold block leading-tight text-white">SORETRAK</span>
                <span className="text-[10px] text-gray-400 leading-tight">
                  {t('about.heroSubtitle').includes('histoire')
                    ? 'Société Régionale de Transport de Kairouan'
                    : 'الشركة الجهوية للنقل بالقيروان'}
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-secondary transition-all duration-300 hover:scale-110">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-secondary transition-all duration-300 hover:scale-110">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-secondary transition-all duration-300 hover:scale-110">
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-5 text-white">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {['home', 'about', 'activities', 'routes', 'news', 'tenders', 'partners', 'contact'].map((key) => (
                <li key={key}>
                  <Link
                    to={`/${key === 'home' ? '' : key}`}
                    className="text-gray-400 hover:text-secondary text-sm transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full group-hover:bg-secondary transition-colors" />
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-5 text-white">{t('footer.contactInfo')}</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-secondary" />
                </div>
                <span>{t('footer.phone')}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-secondary" />
                </div>
                <span>{t('footer.email')}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-secondary" />
                </div>
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-secondary" />
                </div>
                <span>{t('footer.workingHours')}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-5 text-white">
              {t('about.heroSubtitle').includes('histoire') ? 'Nos Partenaires' : 'شركاؤنا'}
            </h3>
            <ul className="space-y-3">
              {[
                { fr: 'Ministère des Transports', ar: 'وزارة النقل', url: 'https://www.transports.gov.tn', external: true },
                { fr: 'SNTT', ar: 'الشركة الوطنية للنقل بالتنقل', url: '#' },
                { fr: 'SOGITRA', ar: 'شركة النقل الجماعي', url: '#' },
                { fr: 'Lignes de Kairouan', ar: 'خطوط القيروان', url: '#' },
              ].map((partner, i) => (
                <li key={i}>
                  {partner.external ? (
                    <a href={partner.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary text-sm transition-colors duration-300 flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                      {partner.fr}
                    </a>
                  ) : (
                    <Link to="/partners" className="text-gray-400 hover:text-secondary text-sm transition-colors duration-300 flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full group-hover:bg-secondary transition-colors" />
                      {partner.fr}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2">
            <img src="/images/tunisia-flag.svg" alt="Tunisia" className="w-5 h-3.5 object-cover rounded-sm" />
            <p className="text-center text-gray-500 text-sm">
              © {currentYear} {t('about.heroSubtitle').includes('histoire')
                ? 'République Tunisienne - Société Régionale de Transport de Kairouan - Tous droits réservés.'
                : 'الجمهورية التونسية - الشركة الجهوية للنقل بالقيروان - جميع الحقوق محفوظة.'}
            </p>
            <img src="/images/tunisia-flag.svg" alt="Tunisia" className="w-5 h-3.5 object-cover rounded-sm" />
          </div>
        </div>
      </div>
    </footer>
  )
}
