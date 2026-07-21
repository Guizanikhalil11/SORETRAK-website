import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, Newspaper, Route, HelpCircle, Bus, CreditCard, MessageSquare, Settings, LogOut, Menu, X, Bus as BusIcon } from 'lucide-react'

export default function AdminLayout() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { icon: LayoutDashboard, label: t('admin.sidebar.dashboard'), path: '/admin/dashboard' },
    { icon: Newspaper, label: t('admin.sidebar.news'), path: '/admin/news' },
    { icon: Route, label: t('admin.sidebar.routes'), path: '/admin/routes' },
    { icon: HelpCircle, label: t('admin.sidebar.faq'), path: '/admin/faq' },
    { icon: Bus, label: t('admin.sidebar.activities'), path: '/admin/activities' },
    { icon: CreditCard, label: t('admin.sidebar.subscriptions'), path: '/admin/subscriptions' },
    { icon: MessageSquare, label: t('admin.sidebar.messages'), path: '/admin/contact' },
    { icon: Settings, label: t('admin.sidebar.settings'), path: '/admin/settings' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-light flex">
      <aside className={`bg-dark text-white transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-0 md:w-20'} overflow-hidden`}>
        <div className="p-4 flex items-center gap-3 border-b border-gray-700">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <BusIcon className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && <span className="text-xl font-bold">SORETRAK</span>}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">{t('admin.sidebar.logout')}</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-4">
            <Link to="/" target="_blank" className="text-sm text-gray-600 hover:text-primary">
              زيارة الموقع
            </Link>
            <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-sm">A</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
