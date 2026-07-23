export default function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="text-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 group">
      <div className="w-14 h-14 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-secondary/20">
        <Icon className="w-6 h-6 text-secondary" />
      </div>
      <div className="text-4xl font-extrabold text-white mb-1 counter-value">{value}</div>
      <div className="text-white/60 text-sm font-medium">{label}</div>
    </div>
  )
}
