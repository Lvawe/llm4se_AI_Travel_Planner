'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Plus, Calendar, MapPin, DollarSign, Users, LogOut, Settings } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/lib/api'

interface Trip {
  id: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  travelers: number
  preferences: string[]
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, token, logout } = useAuthStore()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    fetchTrips()
  }, [token, router])

  const fetchTrips = async () => {
    try {
      const response = await api.get('/api/trips')
      setTrips(response.data)
    } catch (error: any) {
      console.error('Fetch trips error:', error)
      toast.error('获取行程列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('已退出登录')
    router.push('/')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: '草稿',
      planned: '已计划',
      ongoing: '进行中',
      completed: '已完成',
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      planned: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <MapPin className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Travel Planner</h1>
                <p className="text-sm text-gray-600">欢迎回来，{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/settings')}
                className="p-2 text-gray-600 hover:text-primary-600 transition"
                title="设置"
              >
                <Settings className="w-6 h-6" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition"
              >
                <LogOut className="w-5 h-5" />
                <span>退出</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">全部行程</p>
                <p className="text-3xl font-bold text-gray-900">{trips.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-primary-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">进行中</p>
                <p className="text-3xl font-bold text-green-600">
                  {trips.filter(t => t.status === 'ongoing').length}
                </p>
              </div>
              <MapPin className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已计划</p>
                <p className="text-3xl font-bold text-blue-600">
                  {trips.filter(t => t.status === 'planned').length}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已完成</p>
                <p className="text-3xl font-bold text-purple-600">
                  {trips.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">我的行程</h2>
          <button
            onClick={() => router.push('/trips/new')}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            创建新行程
          </button>
        </div>

        {/* Trips Grid */}
        {trips.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">还没有行程</h3>
            <p className="text-gray-600 mb-6">开始创建你的第一个旅行计划吧！</p>
            <button
              onClick={() => router.push('/trips/new')}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <Plus className="w-5 h-5 mr-2" />
              创建行程
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => router.push(`/trips/${trip.id}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition">
                      {trip.destination}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                      {getStatusText(trip.status)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">{trip.travelers} 人</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="text-sm">预算 ¥{trip.budget.toLocaleString()}</span>
                    </div>

                    {trip.preferences.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {trip.preferences.slice(0, 3).map((pref, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs"
                          >
                            {pref}
                          </span>
                        ))}
                        {trip.preferences.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                            +{trip.preferences.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    创建于 {formatDate(trip.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
