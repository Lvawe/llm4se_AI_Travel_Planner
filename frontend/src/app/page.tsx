import Link from 'next/link'
import { ArrowRight, Map, Calendar, DollarSign, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Map className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-800">AI Travel Planner</span>
          </div>
          <div className="space-x-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-primary-600 hover:text-primary-700 transition"
            >
              登录
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              注册
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI 旅行规划师
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            智能规划每一次旅行，让旅途更加轻松愉快
          </p>
          <p className="text-lg text-gray-500 mb-10">
            通过 AI 语音输入您的需求，自动生成个性化旅行路线
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700 transition"
            >
              开始规划
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition"
            >
              立即登录
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">智能行程规划</h3>
            <p className="text-gray-600">
              AI 根据您的需求自动生成最优旅行路线
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">费用预算管理</h3>
            <p className="text-gray-600">
              智能分析预算，实时追踪旅行开销
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Map className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">地图导航</h3>
            <p className="text-gray-600">
              实时定位与路线导航，旅行无忧
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">多设备同步</h3>
            <p className="text-gray-600">
              云端同步，随时随地查看行程
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>© 2025 AI Travel Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
