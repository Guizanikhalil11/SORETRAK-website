import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import About from './pages/About'
import Activities from './pages/Activities'
import Subscriptions from './pages/Subscriptions'
import RoutesPage from './pages/Routes'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Tenders from './pages/Tenders'
import Partners from './pages/Partners'
import SchoolTariffs from './pages/SchoolTariffs'
import CommercialTariffs from './pages/CommercialTariffs'
import NotFound from './pages/NotFound'

import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminNews from './pages/admin/AdminNews'
import AdminRoutesPage from './pages/admin/AdminRoutes'
import AdminFAQ from './pages/admin/AdminFAQ'
import AdminActivities from './pages/admin/AdminActivities'
import AdminSubscriptions from './pages/admin/AdminSubscriptions'
import AdminContact from './pages/admin/AdminContact'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <ScrollToTop />
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
    </>
  )
}
