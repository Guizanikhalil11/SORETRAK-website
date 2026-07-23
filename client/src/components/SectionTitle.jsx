import { useTranslation } from 'react-i18next'

export default function SectionTitle({ title, subtitle, light = false }) {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-3 mb-4">
        <div className={`w-8 h-0.5 ${light ? 'bg-white/40' : 'bg-gradient-to-r from-transparent to-primary'}`} />
        <span className={`text-xs font-bold uppercase tracking-widest ${light ? 'text-secondary' : 'text-secondary'}`}>
          {isRTL ? 'SORETRAK' : 'SORETRAK'}
        </span>
        <div className={`w-8 h-0.5 ${light ? 'bg-white/40' : 'bg-gradient-to-l from-transparent to-primary'}`} />
      </div>
      <h2 className={`text-4xl md:text-[2.8rem] font-extrabold mb-4 leading-tight ${light ? 'text-white' : 'text-dark'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${light ? 'text-gray-300' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
      <div className="flex items-center justify-center gap-1.5 mt-6">
        <div className="w-10 h-1 bg-primary rounded-full" />
        <div className="w-3 h-3 bg-secondary rounded-full" />
        <div className="w-10 h-1 bg-primary rounded-full" />
      </div>
    </div>
  )
}
