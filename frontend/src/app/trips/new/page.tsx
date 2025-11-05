'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { MapPin, Calendar, DollarSign, Users, Mic, ArrowLeft, Sparkles } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/lib/api'
import AmapComponent from '@/components/AmapComponent'
import VoiceInput from '@/components/VoiceInput'

export default function NewTripPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [aiPlan, setAiPlan] = useState<any>(null)
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

  const handleVoiceResult = (transcript: string) => {
    setFormData(prev => ({
      ...prev,
      description: prev.description + (prev.description ? ' ' : '') + transcript
    }))
    setShowVoiceInput(false)
    toast.success('语音识别成功！')
  }

  // 智能创建行程：AI生成 + 自动保存
  const handleSmartCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      toast.error('请填写必填项：目的地和日期')
      return
    }

    setLoading(true)

    try {
      // 步骤1: 调用AI生成行程计划
      toast.loading('AI正在为您规划行程...', { id: 'ai-generate' })
      
      const aiResponse = await api.post('/api/ai/generate-plan', {
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: parseFloat(formData.budget) || 0,
        travelers: parseInt(formData.travelers),
        preferences: formData.preferences,
        description: formData.description
      })

      const generatedPlan = aiResponse.data.plan
      setAiPlan(generatedPlan)
      
      toast.success('行程规划完成！', { id: 'ai-generate' })
      
      // 步骤2: 自动创建行程并保存
      toast.loading('正在保存行程...', { id: 'create-trip' })
      
      const response = await api.post('/api/trips', {
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: parseFloat(formData.budget) || 0,
        travelers: parseInt(formData.travelers),
        preferences: formData.preferences,
        description: formData.description,
        status: 'planned',
        aiPlan: generatedPlan // 保存AI生成的完整计划
      })

      toast.success('智能行程创建成功！', { id: 'create-trip' })
      
      // 步骤3: 跳转到详情页
      router.push(`/trips/${response.data.id}`)
      
    } catch (error: any) {
      console.error('Smart create error:', error)
      toast.error(error.response?.data?.error || '智能创建失败，请重试')
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
            <form onSubmit={handleSmartCreate} className="space-y-6">
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

              {/* 行程描述 - 带语音输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎤 语音描述 / 文字描述
                  <button
                    type="button"
                    onClick={() => setShowVoiceInput(!showVoiceInput)}
                    className="ml-2 text-primary-600 hover:text-primary-700"
                    title="使用语音输入"
                  >
                    <Mic className="inline h-4 w-4" />
                  </button>
                </label>
                {showVoiceInput && (
                  <div className="mb-3">
                    <VoiceInput onResult={handleVoiceResult} />
                  </div>
                )}
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="例如：我想去日本，5天，预算1万元，喜欢美食和动漫，带孩子。AI将根据您的描述生成个性化行程..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                />
                <p className="mt-2 text-xs text-gray-500">
                  💡 提示：可以语音或文字描述您的旅行需求，AI会生成详细的行程规划
                </p>
              </div>

              {/* AI生成的计划预览 */}
              {aiPlan && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    ✨ AI生成的行程计划预览
                  </h3>
                  
                  {/* 行程安排 */}
                  {aiPlan.itinerary && aiPlan.itinerary.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">📅 行程安排：</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {aiPlan.itinerary.slice(0, 3).map((day: any, index: number) => (
                          <div key={index} className="bg-white rounded p-3 text-sm">
                            <div className="font-medium text-gray-900">{day.day}</div>
                            <ul className="mt-1 space-y-1 text-gray-600">
                              {day.activities && day.activities.slice(0, 2).map((activity: any, i: number) => (
                                <li key={i}>
                                  • {typeof activity === 'string' ? activity : (activity.title || activity.time || '活动')}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        {aiPlan.itinerary.length > 3 && (
                          <p className="text-xs text-gray-500 text-center">...还有 {aiPlan.itinerary.length - 3} 天行程</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 预算明细 */}
                  {aiPlan.budgetBreakdown && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">💰 预算明细：</h4>
                      <div className="bg-white rounded p-3 text-sm space-y-1">
                        {Object.entries(aiPlan.budgetBreakdown).slice(0, 4).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600">{key}：</span>
                            <span className="font-medium text-gray-900">¥{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-purple-600 mt-3">
                    ✓ 已生成完整计划，点击下方按钮保存
                  </p>
                </div>
              )}

              {/* 智能创建按钮 */}
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
                  className="flex-2 px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-primary-500 text-white rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  {loading ? (
                    <>
                      <span className="animate-pulse">AI规划中...</span>
                    </>
                  ) : (
                    '🚀 智能创建行程'
                  )}
                </button>
              </div>
              
              <p className="text-xs text-center text-gray-500">
                💡 点击后AI将自动生成个性化行程并保存
              </p>
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
