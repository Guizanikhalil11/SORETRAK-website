import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Edit, Trash2, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function AdminNews() {
  const { t } = useTranslation()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const emptyForm = { titleAr: '', titleFr: '', contentAr: '', contentFr: '', image: '', published: true }
  const [form, setForm] = useState(emptyForm)

  const token = localStorage.getItem('adminToken')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchNews = () => {
    axios.get('/api/news/all', { headers })
      .then(res => { setNews(res.data.news || res.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchNews() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await axios.put(`/api/news/${editingItem.id}`, form, { headers })
        toast.success(t('common.success'))
      } else {
        await axios.post('/api/news', form, { headers })
        toast.success(t('common.success'))
      }
      setShowModal(false)
      setEditingItem(null)
      setForm(emptyForm)
      fetchNews()
    } catch {
      toast.error(t('common.error'))
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setForm({
      titleAr: item.titleAr || '',
      titleFr: item.titleFr || '',
      contentAr: item.contentAr || '',
      contentFr: item.contentFr || '',
      image: item.image || '',
      published: item.published !== false
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm(t('common.confirmDelete'))) return
    try {
      await axios.delete(`/api/news/${id}`, { headers })
      toast.success(t('common.success'))
      fetchNews()
    } catch {
      toast.error(t('common.error'))
    }
  }

  const togglePublished = async (item) => {
    try {
      await axios.put(`/api/news/${item.id}`, { published: !item.published }, { headers })
      fetchNews()
    } catch {
      toast.error(t('common.error'))
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">{t('nav.news')}</h1>
        <button
          onClick={() => { setEditingItem(null); setForm(emptyForm); setShowModal(true) }}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t('common.add')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-light">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">العنوان (AR)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Titre (FR)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">التاريخ</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">الحالة</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {news.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-dark font-medium">{item.titleAr}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.titleFr}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => togglePublished(item)} className={`px-3 py-1 rounded-full text-xs font-medium ${item.published !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.published !== false ? 'منشور' : 'مسودة'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-dark">{editingItem ? t('common.edit') : t('common.add')}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان (عربي)</label>
                  <input type="text" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre (Français)</label>
                  <input type="text" value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المحتوى (عربي)</label>
                  <textarea value={form.contentAr} onChange={(e) => setForm({ ...form, contentAr: e.target.value })} rows={4} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contenu (Français)</label>
                  <textarea value={form.contentFr} onChange={(e) => setForm({ ...form, contentFr: e.target.value })} rows={4} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary resize-none" />
                </div>
              </div>
              <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="رابط الصورة (اختياري)" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-700">منشور</span>
              </label>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-300">{t('common.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
