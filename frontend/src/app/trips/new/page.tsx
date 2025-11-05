'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { MapPin, Calendar, DollarSign, Users, Mic, ArrowLeft } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/lib/api'
import AmapComponent from '@/components/AmapComponent'

export default function NewTripPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: '1',
    preferences: [] as string[],
    description: ''
  })

  useEffect(() => {
    if (!token) {
      router.push('/login')
    }
  }, [token, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePreferenceToggle = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      toast.error('请填写必填项')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/api/trips', {
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: parseFloat(formData.budget) || 0,
        travelers: parseInt(formData.travelers),
        preferences: formData.preferences,
        description: formData.description,
        status: 'planning'
      })

      toast.success('行程创建成功！')
      router.push(`/trips/${response.data.id}`)
    } catch (error: any) {
      console.error('Create trip error:', error)
      toast.error(error.response?.data?.error || '创建行程失败')
    } finally {
      setLoading(false)
    }
  }

  const preferenceOptions = [
    '美食',
    '购物',
    '自然风光',
    '历史文化',
    '户外运动',
    '休闲放松',
    '摄影',
    '亲子活动'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">创建新行程</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 表单区域 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 目的地 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  目的地 *
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="例如：北京、上海、成都..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              {/* 日期选择 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    开始日期 *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    结束日期 *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              {/* 预算和人数 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    预算（元）
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    出行人数
                  </label>
                  <select
                    name="travelers"
                    value={formData.travelers}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} 人</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 旅行偏好 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  旅行偏好
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {preferenceOptions.map(preference => (
                    <button
                      key={preference}
                      type="button"
                      onClick={() => handlePreferenceToggle(preference)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.preferences.includes(preference)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {preference}
                    </button>
                  ))}
                </div>
              </div>

              {/* 行程描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  行程描述
                  <button
                    type="button"
                    className="ml-2 text-primary-600 hover:text-primary-700"
                    title="使用语音输入"
                  >
                    <Mic className="inline h-4 w-4" />
                  </button>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="描述一下你的旅行需求，AI 将为你生成个性化行程..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* 提交按钮 */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  {loading ? '创建中...' : '创建行程'}
                </button>
              </div>
            </form>
          </div>

          {/* 地图区域 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">目的地预览</h2>
            <div className="h-[600px] rounded-lg overflow-hidden">
              <AmapComponent destination={formData.destination} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
