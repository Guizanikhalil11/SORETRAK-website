export default function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="text-center p-5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className="w-11 h-11 bg-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
        <Icon className="w-5 h-5 text-secondary" />
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-white/60 text-sm">{label}</div>
    </div>
  )
}
