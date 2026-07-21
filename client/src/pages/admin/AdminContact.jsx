import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, Trash2, X, Loader2, Mail, Phone, User } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function AdminContact() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMsg, setSelectedMsg] = useState(null)

  const token = localStorage.getItem('adminToken')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchMessages = () => {
    axios.get('/api/contact', { headers })
      .then(res => { setMessages(res.data.messages || res.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchMessages() }, [])

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/contact/${id}`, { read: true }, { headers })
      fetchMessages()
    } catch {
      toast.error(t('common.error'))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm(t('common.confirmDelete'))) return
    try {
      await axios.delete(`/api/contact/${id}`, { headers })
      toast.success(t('common.success'))
      setSelectedMsg(null)
      fetchMessages()
    } catch {
      toast.error(t('common.error'))
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-dark mb-6">{t('nav.contact')}</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-light">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">الاسم</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">البريد</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">الموضوع</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">التاريخ</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {messages.map((msg) => (
              <tr key={msg._id || msg.id} className={`hover:bg-gray-50 ${!msg.read ? 'bg-primary-light/30' : ''}`}>
                <td className="px-6 py-4 text-sm text-dark font-medium">{msg.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{msg.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{msg.subject}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedMsg(msg); if (!msg.read) markAsRead(msg._id || msg.id) }} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(msg._id || msg.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMsg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-dark">تفاصيل الرسالة</h2>
              <button onClick={() => setSelectedMsg(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-light rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-dark font-medium">{selectedMsg.name}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-light rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-dark">{selectedMsg.email}</span>
              </div>
              {selectedMsg.phone && (
                <div className="flex items-center gap-3 p-3 bg-light rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-dark">{selectedMsg.phone}</span>
                </div>
              )}
              <div className="p-3 bg-light rounded-lg">
                <div className="text-sm text-gray-500 mb-1">الموضوع: {selectedMsg.subject}</div>
              </div>
              <div className="p-4 bg-light rounded-lg">
                <p className="text-dark leading-relaxed">{selectedMsg.message}</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setSelectedMsg(null)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">{t('common.cancel')}</button>
              <button onClick={() => handleDelete(selectedMsg._id || selectedMsg.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300">{t('common.delete')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
