import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Edit, Trash2, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function AdminRoutes() {
  const { t } = useTranslation()
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const emptyForm = { nameAr: '', nameFr: '', descriptionAr: '', descriptionFr: '', departure: '', arrival: '', departureTime: '', arrivalTime: '', price: '', type: 'commercial', days: 'daily', active: true }
  const [form, setForm] = useState(emptyForm)

  const token = localStorage.getItem('adminToken')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchRoutes = () => {
    axios.get('/api/routes/all', { headers })
      .then(res => { setRoutes(res.data.routes || res.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchRoutes() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = { ...form, price: parseFloat(form.price) || 0 }
      if (editingItem) {
        await axios.put(`/api/routes/${editingItem.id}`, data, { headers })
      } else {
        await axios.post('/api/routes', data, { headers })
      }
      toast.success(t('common.success'))
      setShowModal(false)
      setEditingItem(null)
      setForm(emptyForm)
      fetchRoutes()
    } catch {
      toast.error(t('common.error'))
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setForm({
      nameAr: item.nameAr || '', nameFr: item.nameFr || '',
      descriptionAr: item.descriptionAr || '', descriptionFr: item.descriptionFr || '',
      departure: item.departure || '', arrival: item.arrival || '',
      departureTime: item.departureTime || '', arrivalTime: item.arrivalTime || '',
      price: item.price || '', type: item.type || 'commercial',
      days: item.days || 'daily', active: item.active !== false
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm(t('common.confirmDelete'))) return
    try {
      await axios.delete(`/api/routes/${id}`, { headers })
      toast.success(t('common.success'))
      fetchRoutes()
    } catch {
      toast.error(t('common.error'))
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">{t('nav.routes')}</h1>
        <button onClick={() => { setEditingItem(null); setForm(emptyForm); setShowModal(true) }} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-all duration-300 flex items-center gap-2">
          <Plus className="w-5 h-5" />{t('common.add')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-light">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">الاسم (AR)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nom (FR)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">النوع</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">السعر</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {routes.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-dark">{item.nameAr}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.nameFr}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${item.type === 'school' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{item.type}</span></td>
                <td className="px-6 py-4 text-sm text-dark">{item.price} د.ت</td>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم (عربي)</label>
                  <input type="text" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom (Français)</label>
                  <input type="text" value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (عربي)</label>
                  <textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={2} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Français)</label>
                  <textarea value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} rows={2} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary resize-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={form.departure} onChange={(e) => setForm({ ...form, departure: e.target.value })} placeholder="مدينة الانطلاق" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
                <input type="text" value={form.arrival} onChange={(e) => setForm({ ...form, arrival: e.target.value })} placeholder="مدينة الوصول" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} placeholder="موعد الانطلاق (06:00)" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
                <input type="text" value={form.arrivalTime} onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} placeholder="موعد الوصول (08:30)" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <input type="number" step="0.001" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="السعر (د.ت)" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                  <option value="school">مدرسي</option>
                  <option value="university">جامعي</option>
                  <option value="commercial">تجاري</option>
                </select>
                <select value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                  <option value="daily">يومي</option>
                  <option value="weekdays">أيام العمل</option>
                  <option value="thursday_sunday">الخميس - الأحد</option>
                  <option value="monday_thursday">الإثنين - الخميس</option>
                </select>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-700">نشط</span>
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
