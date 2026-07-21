import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Edit, Trash2, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function AdminFAQ() {
  const { t } = useTranslation()
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const emptyForm = { questionAr: '', questionFr: '', answerAr: '', answerFr: '', category: 'general', order: 0 }
  const [form, setForm] = useState(emptyForm)

  const token = localStorage.getItem('adminToken')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchFaqs = () => {
    axios.get('/api/faq', { headers })
      .then(res => { setFaqs(res.data.faqs || res.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchFaqs() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await axios.put(`/api/faq/${editingItem.id}`, form, { headers })
      } else {
        await axios.post('/api/faq', form, { headers })
      }
      toast.success(t('common.success'))
      setShowModal(false)
      setEditingItem(null)
      setForm(emptyForm)
      fetchFaqs()
    } catch {
      toast.error(t('common.error'))
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setForm({
      questionAr: item.questionAr || '', questionFr: item.questionFr || '',
      answerAr: item.answerAr || '', answerFr: item.answerFr || '',
      category: item.category || 'general', order: item.order || 0
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm(t('common.confirmDelete'))) return
    try {
      await axios.delete(`/api/faq/${id}`, { headers })
      toast.success(t('common.success'))
      fetchFaqs()
    } catch {
      toast.error(t('common.error'))
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">{t('nav.faq')}</h1>
        <button onClick={() => { setEditingItem(null); setForm(emptyForm); setShowModal(true) }} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-all duration-300 flex items-center gap-2">
          <Plus className="w-5 h-5" />{t('common.add')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-light">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">السؤال (AR)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Question (FR)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">التصنيف</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {faqs.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-dark font-medium max-w-[200px] truncate">{item.questionAr}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">{item.questionFr}</td>
                <td className="px-6 py-4"><span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{item.category}</span></td>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">السؤال (عربي)</label>
                  <textarea value={form.questionAr} onChange={(e) => setForm({ ...form, questionAr: e.target.value })} rows={2} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question (Français)</label>
                  <textarea value={form.questionFr} onChange={(e) => setForm({ ...form, questionFr: e.target.value })} rows={2} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary resize-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الإجابة (عربي)</label>
                  <textarea value={form.answerAr} onChange={(e) => setForm({ ...form, answerAr: e.target.value })} rows={4} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Réponse (Français)</label>
                  <textarea value={form.answerFr} onChange={(e) => setForm({ ...form, answerFr: e.target.value })} rows={4} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary resize-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                  <option value="general">{t('faq.general')}</option>
                  <option value="schedules">المواعيد</option>
                  <option value="prices">الأسعار</option>
                  <option value="subscriptions">{t('faq.subscriptions')}</option>
                </select>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })} placeholder="الترتيب" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
              </div>
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
