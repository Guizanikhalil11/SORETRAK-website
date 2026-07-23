import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { lazy, Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import BackToTop from './components/BackToTop'
import ProtectedRoute from './components/ProtectedRoute'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Activities = lazy(() => import('./pages/Activities'))
const Subscriptions = lazy(() => import('./pages/Subscriptions'))
const RoutesPage = lazy(() => import('./pages/Routes'))
const News = lazy(() => import('./pages/News'))
const NewsDetail = lazy(() => import('./pages/NewsDetail'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Contact = lazy(() => import('./pages/Contact'))
const Tenders = lazy(() => import('./pages/Tenders'))
const Partners = lazy(() => import('./pages/Partners'))
const SchoolTariffs = lazy(() => import('./pages/SchoolTariffs'))
const CommercialTariffs = lazy(() => import('./pages/CommercialTariffs'))
const NotFound = lazy(() => import('./pages/NotFound'))

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/Login'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminNews = lazy(() => import('./pages/admin/AdminNews'))
const AdminRoutesPage = lazy(() => import('./pages/admin/AdminRoutes'))
const AdminFAQ = lazy(() => import('./pages/admin/AdminFAQ'))
const AdminActivities = lazy(() => import('./pages/admin/AdminActivities'))
const AdminSubscriptions = lazy(() => import('./pages/admin/AdminSubscriptions'))
const AdminContact = lazy(() => import('./pages/admin/AdminContact'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Chargement...</p>
    </div>
  </div>
)

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <Chatbot />
      <BackToTop />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const { i18n } = useTranslation()

  useEffect(() => {
    const titles = {
      '/': 'SORETRAK - Transport de Kairouan',
      '/about': 'SORETRAK - À propos',
      '/activities': 'SORETRAK - Activités',
      '/routes': 'SORETRAK - Lignes et Tarifs',
      '/subscriptions': 'SORETRAK - Abonnements',
      '/news': 'SORETRAK - Actualités',
      '/faq': 'SORETRAK - Questions Fréquentes',
      '/contact': 'SORETRAK - Contact',
      '/tenders': 'SORETRAK - Appels d\'offres',
      '/partners': 'SORETRAK - Partenaires',
      '/school-tariffs': 'SORETRAK - Tarifs Scolaires',
      '/commercial-tariffs': 'SORETRAK - Tarifs Commerciaux',
    }
    document.title = titles[location.pathname] || 'SORETRAK - Transport de Kairouan'
  }, [location.pathname])

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        {i18n.language === 'fr' ? 'Aller au contenu principal' : 'انتقل إلى المحتوى الرئيسي'}
      </a>
      <Toaster position="top-center" />
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/activities" element={<PublicLayout><Activities /></PublicLayout>} />
          <Route path="/subscriptions" element={<PublicLayout><Subscriptions /></PublicLayout>} />
          <Route path="/routes" element={<PublicLayout><RoutesPage /></PublicLayout>} />
          <Route path="/news" element={<PublicLayout><News /></PublicLayout>} />
          <Route path="/news/:id" element={<PublicLayout><NewsDetail /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/tenders" element={<PublicLayout><Tenders /></PublicLayout>} />
          <Route path="/partners" element={<PublicLayout><Partners /></PublicLayout>} />
          <Route path="/school-tariffs" element={<PublicLayout><SchoolTariffs /></PublicLayout>} />
          <Route path="/commercial-tariffs" element={<PublicLayout><CommercialTariffs /></PublicLayout>} />
          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="routes" element={<AdminRoutesPage />} />
            <Route path="faq" element={<AdminFAQ />} />
            <Route path="activities" element={<AdminActivities />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1></div>} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}
