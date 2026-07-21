export default function SectionTitle({ title, subtitle, light = false }) {
  return (
    <div className="text-center mb-12">
      <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-dark'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl mx-auto ${light ? 'text-gray-300' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="w-12 h-1 bg-primary rounded-full" />
        <div className="w-3 h-1 bg-secondary rounded-full" />
        <div className="w-12 h-1 bg-primary rounded-full" />
      </div>
    </div>
  )
}
