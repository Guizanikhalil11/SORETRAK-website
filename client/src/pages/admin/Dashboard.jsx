import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Newspaper, Route, HelpCircle, MessageSquare, Users, Loader2 } from 'lucide-react'
import axios from 'axios'

export default function Dashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState({ news: 0, routes: 0, faqs: 0, messages: 0 })
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const headers = { Authorization: `Bearer ${token}` }

    Promise.all([
      axios.get('/api/news', { headers }).catch(() => ({ data: { news: [] } })),
      axios.get('/api/routes', { headers }).catch(() => ({ data: { routes: [] } })),
      axios.get('/api/faq', { headers }).catch(() => ({ data: { faqs: [] } })),
      axios.get('/api/contact', { headers }).catch(() => ({ data: { messages: [] } })),
    ]).then(([newsRes, routesRes, faqRes, contactRes]) => {
      setStats({
        news: (newsRes.data.news || newsRes.data || []).length,
        routes: (routesRes.data.routes || routesRes.data || []).length,
        faqs: (faqRes.data.faqs || faqRes.data || []).length,
        messages: (contactRes.data.messages || contactRes.data || []).length,
      })
      setMessages((contactRes.data.messages || contactRes.data || []).slice(0, 5))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const statCards = [
    { icon: Newspaper, label: t('admin.dashboard.totalNews'), value: stats.news, color: 'bg-[#1565C0]' },
    { icon: Route, label: t('admin.dashboard.totalRoutes'), value: stats.routes, color: 'bg-primary' },
    { icon: HelpCircle, label: t('admin.dashboard.totalFAQs'), value: stats.faqs, color: 'bg-secondary' },
    { icon: MessageSquare, label: t('admin.dashboard.totalMessages'), value: stats.messages, color: 'bg-[#6A1B9A]' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-dark mb-6">{t('admin.dashboard.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-dark">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-dark mb-4">{t('admin.dashboard.recentMessages')}</h2>
        {messages.length === 0 ? (
          <p className="text-gray-500">{t('common.noData')}</p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-dark">{msg.name}</div>
                  <div className="text-sm text-gray-600 truncate">{msg.message}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
