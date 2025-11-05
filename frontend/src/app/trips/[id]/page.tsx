'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Trash2,
  Plus,
  Check,
  X
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/lib/api'
import AmapComponent from '@/components/AmapComponent'
import AITripPlan from '@/components/AITripPlan'
import { Trip, Expense } from '@/types'

export default function TripDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { token } = useAuthStore()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [expenseForm, setExpenseForm] = useState({
    category: '餐饮',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    if (params.id) {
      fetchTrip()
      fetchExpenses()
    }
  }, [token, params.id])

  const fetchTrip = async () => {
    try {
      const response = await api.get(`/api/trips/${params.id}`)
      
      // 🔍 调试输出 - 查看完整响应数据
      console.log('===== API 响应数据 =====')
      console.log('完整响应:', response.data)
      console.log('itinerary 字段:', response.data.itinerary)
      console.log('itinerary 类型:', typeof response.data.itinerary)
      console.log('itinerary 是否为数组:', Array.isArray(response.data.itinerary))
      if (response.data.itinerary) {
        console.log('itinerary.itinerary 字段:', response.data.itinerary.itinerary)
        console.log('itinerary.budgetBreakdown:', response.data.itinerary.budgetBreakdown)
        console.log('itinerary.tips:', response.data.itinerary.tips)
      }
      console.log('=======================')
      
      setTrip(response.data)
    } catch (error: any) {
      console.error('Fetch trip error:', error)
      toast.error('获取行程详情失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchExpenses = async () => {
    try {
      const response = await api.get(`/api/trips/${params.id}/expenses`)
      setExpenses(response.data)
    } catch (error: any) {
      console.error('Fetch expenses error:', error)
    }
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await api.post(`/api/trips/${params.id}/expenses`, {
        ...expenseForm,
        amount: parseFloat(expenseForm.amount)
      })

      toast.success('费用记录添加成功')
      setShowExpenseForm(false)
      setExpenseForm({
        category: '餐饮',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
      fetchExpenses()
    } catch (error: any) {
      console.error('Add expense error:', error)
      toast.error('添加费用记录失败')
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('确定要删除这条费用记录吗？')) return

    try {
      await api.delete(`/api/expenses/${expenseId}`)
      toast.success('费用记录删除成功')
      fetchExpenses()
    } catch (error: any) {
      console.error('Delete expense error:', error)
      toast.error('删除费用记录失败')
    }
  }

  const handleDeleteTrip = async () => {
    if (!confirm('确定要删除这个行程吗？此操作无法撤销。')) return

    try {
      await api.delete(`/api/trips/${params.id}`)
      toast.success('行程删除成功')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Delete trip error:', error)
      toast.error('删除行程失败')
    }
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const remainingBudget = trip ? trip.budget - totalExpenses : 0

  const categoryOptions = ['餐饮', '住宿', '交通', '门票', '购物', '娱乐', '其他']

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">行程不存在</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{trip.destination}</h1>
            </div>
            <button
              onClick={handleDeleteTrip}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              删除行程
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：行程信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本信息卡片 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">行程信息</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">出行日期</p>
                    <p className="font-medium text-gray-900">
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">出行人数</p>
                    <p className="font-medium text-gray-900">{trip.travelers} 人</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">预算</p>
                    <p className="font-medium text-gray-900">¥{trip.budget.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">剩余预算</p>
                    <p className={`font-medium ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ¥{remainingBudget.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {trip.preferences.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">旅行偏好</p>
                  <div className="flex flex-wrap gap-2">
                    {trip.preferences.map(pref => (
                      <span key={pref} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {trip.description && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">行程描述</p>
                  <p className="text-gray-700">{trip.description}</p>
                </div>
              )}
            </div>

            {/* AI 生成的行程计划 - 调试版本 */}
            {trip.itinerary && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  🤖 AI 生成的行程计划
                </h2>
                
                {/* 调试信息 */}
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <p className="text-sm font-mono text-gray-700 mb-2">
                    <strong>调试信息:</strong>
                  </p>
                  <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-auto max-h-96">
                    {JSON.stringify(trip.itinerary, null, 2)}
                  </pre>
                </div>

                {/* 简单文本展示 */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">原始数据类型:</h3>
                    <p className="text-sm text-gray-600">
                      itinerary 类型: {typeof trip.itinerary} <br/>
                      是否为数组: {Array.isArray(trip.itinerary) ? '是' : '否'} <br/>
                      是否有 itinerary 字段: {trip.itinerary.itinerary ? '有' : '无'} <br/>
                      是否有 budgetBreakdown 字段: {trip.itinerary.budgetBreakdown ? '有' : '无'} <br/>
                      是否有 tips 字段: {trip.itinerary.tips ? '有' : '无'}
                    </p>
                  </div>

                  {/* 如果有 itinerary.itinerary 数组 */}
                  {trip.itinerary.itinerary && Array.isArray(trip.itinerary.itinerary) && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">日程安排:</h3>
                      {trip.itinerary.itinerary.map((day: any, idx: number) => (
                        <div key={idx} className="bg-blue-50 p-3 rounded mb-2">
                          <p className="font-medium">天数: {day.day || `第${idx + 1}天`}</p>
                          <p className="text-sm">日期: {day.date || '未设置'}</p>
                          {day.activities && Array.isArray(day.activities) && (
                            <ul className="mt-2 space-y-1">
                              {day.activities.map((act: any, i: number) => (
                                <li key={i} className="text-sm text-gray-700">
                                  • {act.title || act.activity || act.time || '活动'}
                                  {act.location && ` - ${act.location}`}
                                  {act.estimatedCost && ` - ¥${act.estimatedCost}`}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 如果有预算分解 */}
                  {trip.itinerary.budgetBreakdown && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">预算明细:</h3>
                      <div className="bg-green-50 p-3 rounded">
                        {Array.isArray(trip.itinerary.budgetBreakdown) ? (
                          <ul className="space-y-1">
                            {trip.itinerary.budgetBreakdown.map((item: any, idx: number) => (
                              <li key={idx} className="text-sm">
                                {item.category || `项目${idx + 1}`}: ¥{item.amount || 0}
                                {item.description && ` - ${item.description}`}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <pre className="text-xs">{JSON.stringify(trip.itinerary.budgetBreakdown, null, 2)}</pre>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 如果有建议 */}
                  {trip.itinerary.tips && Array.isArray(trip.itinerary.tips) && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">旅行建议:</h3>
                      <ul className="bg-yellow-50 p-3 rounded space-y-1">
                        {trip.itinerary.tips.map((tip: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-700">
                            💡 {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 费用管理卡片 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">费用记录</h2>
                <button
                  onClick={() => setShowExpenseForm(!showExpenseForm)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  添加费用
                </button>
              </div>

              {/* 添加费用表单 */}
              {showExpenseForm && (
                <form onSubmit={handleAddExpense} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">类别</label>
                      <select
                        value={expenseForm.category}
                        onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                      >
                        {categoryOptions.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">金额</label>
                      <input
                        type="number"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                        placeholder="0.00"
                        step="0.01"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                      <input
                        type="date"
                        value={expenseForm.date}
                        onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">说明</label>
                      <input
                        type="text"
                        value={expenseForm.description}
                        onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                        placeholder="简要说明"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      保存
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowExpenseForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      取消
                    </button>
                  </div>
                </form>
              )}

              {/* 费用列表 */}
              <div className="space-y-3">
                {expenses.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">暂无费用记录</p>
                ) : (
                  expenses.map(expense => (
                    <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                            {expense.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(expense.date).toLocaleDateString()}
                          </span>
                        </div>
                        {expense.description && (
                          <p className="text-sm text-gray-600 mt-1">{expense.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-gray-900">
                          ¥{expense.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
                {expenses.length > 0 && (
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-gray-700 font-medium">总计</span>
                    <span className="text-xl font-bold text-gray-900">
                      ¥{totalExpenses.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：地图 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">目的地位置</h2>
              <div className="h-[500px] rounded-lg overflow-hidden">
                <AmapComponent destination={trip.destination} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
