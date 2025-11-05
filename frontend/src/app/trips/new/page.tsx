'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { MapPin, Calendar, DollarSign, Users, Mic, ArrowLeft, Sparkles } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/lib/api'
import dynamic from 'next/dynamic'

// 动态导入使用浏览器 API 的组件，禁用 SSR
const AmapComponent = dynamic(() => import('@/components/AmapComponent'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64">加载地图中...</div>
})

const VoiceInput = dynamic(() => import('@/components/VoiceInput'), { 
  ssr: false
})

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

  const handleVoiceResult = async (transcript: string) => {
    setShowVoiceInput(false)
    toast.success('语音识别成功！正在解析您的需求...')
    
    // 解析语音内容，提取信息并填充表单
    await parseVoiceAndFillForm(transcript)
  }

  // 解析语音内容并填充表单
  const parseVoiceAndFillForm = async (voiceDescription: string) => {
    setLoading(true)

    try {
      toast.loading('AI正在理解您的需求...', { id: 'parse-voice' })
      
      // 使用简单的正则和关键词匹配来提取信息
      const text = voiceDescription.toLowerCase()
      
      // 提取目的地（常见格式：去xxx、想去xxx、到xxx）
      let destination = formData.destination
      const destMatch = text.match(/(?:去|到|想去|前往)[\s]*([^\s，,。、]{2,10})/)
      if (destMatch) {
        destination = destMatch[1]
      }
      
      // 提取天数（常见格式：X天、X日）
      let startDate = formData.startDate
      let endDate = formData.endDate
      const daysMatch = text.match(/(\d+)[\s]*[天日]/)
      if (daysMatch) {
        const days = parseInt(daysMatch[1])
        startDate = new Date().toISOString().split('T')[0]
        endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
      
      // 提取预算（常见格式：预算X元、X元、X块、X万）
      let budget = formData.budget
      const budgetMatch = text.match(/(?:预算|花费|费用)?[\s]*(\d+)[\s]*(?:元|块|万)/)
      if (budgetMatch) {
        let amount = parseInt(budgetMatch[1])
        // 如果是万，转换为元
        if (text.includes('万')) {
          amount = amount * 10000
        }
        budget = amount.toString()
      }
      
      // 提取人数（常见格式：X人、X个人）
      let travelers = formData.travelers
      const travelerMatch = text.match(/(\d+)[\s]*(?:人|个人)/)
      if (travelerMatch) {
        travelers = travelerMatch[1]
      }
      
      // 提取偏好
      const preferenceOptions = ['美食', '购物', '自然风光', '历史文化', '户外运动', '休闲放松', '摄影', '亲子活动']
      const extractedPreferences: string[] = []
      preferenceOptions.forEach(pref => {
        if (text.includes(pref.toLowerCase()) || text.includes(pref)) {
          extractedPreferences.push(pref)
        }
      })

      // 更新表单数据（不包含 description，语音内容不填充到补充描述）
      setFormData(prev => ({
        ...prev,
        destination: destination || prev.destination,
        startDate: startDate || prev.startDate,
        endDate: endDate || prev.endDate,
        budget: budget || prev.budget,
        travelers: travelers || prev.travelers,
        preferences: extractedPreferences.length > 0 ? extractedPreferences : prev.preferences
        // 注意：不更新 description 字段
      }))
      
      toast.success('已为您填充表单，请检查并确认信息', { id: 'parse-voice' })
      
      // 如果提取到了关键信息，自动生成预览
      if (destination || (startDate && endDate) || budget) {
        setTimeout(() => {
          toast.loading('正在生成行程预览...', { id: 'preview' })
        }, 500)
        
        // 生成行程预览（不保存）
        try {
          const aiResponse = await api.post('/api/ai/generate-plan', {
            destination: destination || '待定',
            startDate: startDate || new Date().toISOString().split('T')[0],
            endDate: endDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            budget: parseFloat(budget) || 5000,
            travelers: parseInt(travelers) || 1,
            preferences: extractedPreferences,
            description: voiceDescription
          })
          
          setAiPlan(aiResponse.data.plan)
          toast.success('行程预览已生成！请确认信息后点击下方按钮保存', { id: 'preview' })
        } catch (error) {
          toast.dismiss('preview')
        }
      }
      
    } catch (error: any) {
      console.error('Parse voice error:', error)
      toast.error('语音解析失败，请手动填写表单')
    } finally {
      setLoading(false)
    }
  }

  // 智能创建行程：AI生成 + 自动保存
  const handleSmartCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证必填项
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      toast.error('请填写必填项：目的地和日期')
      return
    }

    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      toast.error('请填写预算金额')
      return
    }

    if (!formData.travelers || parseInt(formData.travelers) <= 0) {
      toast.error('请选择出行人数')
      return
    }

    // 验证日期逻辑
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    
    if (endDate <= startDate) {
      toast.error('结束日期必须晚于开始日期')
      return
    }

    // 计算天数差异
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff > 30) {
      toast.error('行程时长不能超过30天')
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
                    min={new Date().toISOString().split('T')[0]}
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
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    max={formData.startDate ? new Date(new Date(formData.startDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined}
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
                    预算（元）*
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
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    出行人数 *
                  </label>
                  <select
                    name="travelers"
                    value={formData.travelers}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
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

              {/* 补充描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 补充描述
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="请补充更具体的要求。AI将根据您的描述生成个性化行程..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* 分隔线 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">或使用语音快速填写（推荐）</span>
                </div>
              </div>

              {/* 语音输入区域 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Mic className="h-4 w-4 text-blue-600" />
                      🎤 语音智能填写
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      说出您的旅行需求，AI 会自动识别并填充表单
                    </p>
                    <p className="text-xs text-blue-600 mt-1 font-medium">
                      例如："我想去北京，玩5天，预算10000元，喜欢历史文化，2个人"
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowVoiceInput(!showVoiceInput)}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium shadow-md"
                  >
                    <Mic className="h-4 w-4" />
                    {showVoiceInput ? '关闭语音' : '开始语音'}
                  </button>
                </div>
                {showVoiceInput && (
                  <div className="mt-3 bg-white rounded-lg p-3">
                    <VoiceInput onResult={handleVoiceResult} />
                  </div>
                )}
              </div>

              {/* AI生成的计划预览 */}
              {aiPlan && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-300 shadow-md">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-base">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    ✨ AI生成的行程计划预览
                  </h3>
                  
                  {/* 行程安排 */}
                  {aiPlan.itinerary && aiPlan.itinerary.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-bold text-gray-800 mb-2">📅 行程安排：</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {aiPlan.itinerary.slice(0, 3).map((day: any, index: number) => (
                          <div key={index} className="bg-white rounded-lg p-3 text-sm shadow-sm border border-gray-200">
                            <div className="font-bold text-gray-900">{day.day}</div>
                            <ul className="mt-1 space-y-1 text-gray-700">
                              {day.activities && day.activities.slice(0, 2).map((activity: any, i: number) => (
                                <li key={i} className="font-medium">
                                  • {typeof activity === 'string' ? activity : (activity.title || activity.time || '活动')}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        {aiPlan.itinerary.length > 3 && (
                          <p className="text-xs text-gray-600 text-center font-medium">...还有 {aiPlan.itinerary.length - 3} 天行程</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 预算明细 */}
                  {aiPlan.budgetBreakdown && Array.isArray(aiPlan.budgetBreakdown) && (
                    <div className="mb-3">
                      <h4 className="text-sm font-bold text-gray-800 mb-2">💰 预算明细：</h4>
                      <div className="bg-white rounded-lg p-3 text-sm space-y-1 shadow-sm border border-gray-200">
                        {aiPlan.budgetBreakdown.slice(0, 4).map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-gray-700 font-medium">{item.category || `项目${idx + 1}`}：</span>
                            <span className="font-bold text-gray-900">¥{item.amount || 0}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 flex flex-col gap-2">
                    <p className="text-sm text-purple-700 font-bold">
                      ✓ 已生成完整计划，请确认信息后保存
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          // 直接保存当前的表单和AI计划
                          if (!formData.destination || !formData.startDate || !formData.endDate || !formData.budget) {
                            toast.error('请先完善表单信息')
                            return
                          }
                          
                          setLoading(true)
                          try {
                            toast.loading('正在保存行程...', { id: 'save-trip' })
                            
                            const response = await api.post('/api/trips', {
                              destination: formData.destination,
                              startDate: formData.startDate,
                              endDate: formData.endDate,
                              budget: parseFloat(formData.budget),
                              travelers: parseInt(formData.travelers),
                              preferences: formData.preferences,
                              description: formData.description,
                              status: 'planned',
                              aiPlan: aiPlan
                            })
                            
                            toast.success('行程保存成功！', { id: 'save-trip' })
                            router.push(`/trips/${response.data.id}`)
                          } catch (error: any) {
                            toast.error(error.response?.data?.error || '保存失败，请重试', { id: 'save-trip' })
                          } finally {
                            setLoading(false)
                          }
                        }}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <Sparkles className="h-5 w-5" />
                        💾 保存行程
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAiPlan(null)
                          toast.success('已清除预览，可重新规划')
                        }}
                        className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        重新规划
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 智能创建按钮 - 只在没有预览时显示 */}
              {!aiPlan && (
                <>
                  <div className="flex gap-3 items-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-primary-500 text-white rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
                    >
                      <Sparkles className="h-6 w-6" />
                      {loading ? (
                        <>
                          <span className="animate-pulse">AI规划中...</span>
                        </>
                      ) : (
                        '🚀 智能创建行程'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push('/dashboard')}
                      className="px-4 py-3 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                  
                  <p className="text-xs text-center text-gray-500">
                    💡 点击后AI将自动生成个性化行程并保存
                  </p>
                </>
              )}
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
