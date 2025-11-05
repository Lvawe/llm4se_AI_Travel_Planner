'use client'

import { MapPin, Clock, DollarSign, Info } from 'lucide-react'

interface Activity {
  time: string
  title: string
  description: string
  location: string
  duration?: string
  price?: string
}

interface DayPlan {
  day: string
  date: string
  activities: Activity[]
}

interface BudgetItem {
  category: string
  amount: number
  percentage: number
}

interface AITripPlanProps {
  destination: string
  itinerary: DayPlan[]
  budgetBreakdown: BudgetItem[]
  totalBudget: number
  tips?: string[]
}

export default function AITripPlan({ 
  destination, 
  itinerary, 
  budgetBreakdown, 
  totalBudget,
  tips = []
}: AITripPlanProps) {
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-xl p-8 border border-gray-100">
      {/* 标题 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          {destination}美食与文化之旅
        </h2>
        <p className="text-gray-600 text-sm">
          通过AI智能规划,为您推荐最佳旅行路线,让旅行更加便捷、舒适、愉快。
        </p>
      </div>

      {/* 日程安排 */}
      <div className="space-y-6 mb-8">
        {itinerary.map((day, dayIndex) => (
          <div key={dayIndex} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            {/* 日期标题 */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3">
              <h3 className="font-bold text-lg">{formatDate(day.date)}</h3>
              <p className="text-blue-100 text-sm">{day.day}</p>
            </div>

            {/* 活动列表 */}
            <div className="divide-y divide-gray-100">
              {day.activities.map((activity, actIndex) => (
                <div key={actIndex} className="p-6 hover:bg-gray-50 transition-colors">
                  {/* 时间和标题 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          {activity.time}
                        </span>
                        <h4 className="text-lg font-bold text-gray-900">{activity.title}</h4>
                      </div>
                      
                      {/* 描述 */}
                      <p className="text-gray-700 leading-relaxed mb-3">
                        {activity.description}
                      </p>

                      {/* 位置和时长 */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span>{activity.location}</span>
                        </div>
                        {activity.duration && (
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Clock className="h-4 w-4 text-green-500" />
                            <span>{activity.duration}</span>
                          </div>
                        )}
                        {activity.price && (
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <DollarSign className="h-4 w-4 text-orange-500" />
                            <span className="font-medium text-orange-600">{activity.price}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 费用概览 */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-green-600" />
          费用概览
        </h3>
        
        <div className="space-y-4">
          {/* 总预算 */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div>
              <p className="text-sm text-gray-600">预计总费用</p>
              <p className="text-3xl font-bold text-green-600">¥{totalBudget.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">当前已计划</p>
              <p className="text-2xl font-bold text-orange-600">
                ¥{budgetBreakdown.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* 费用明细 */}
          <div className="space-y-2">
            {budgetBreakdown.map((item, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm font-bold text-gray-900">
                    ¥{item.amount.toLocaleString()} / ¥{totalBudget.toLocaleString()}
                  </span>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500 group-hover:from-blue-500 group-hover:to-blue-700"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="flex justify-end mt-0.5">
                  <span className="text-xs text-gray-500">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 旅行建议 */}
      {tips && tips.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-amber-600" />
            温馨提示
          </h3>
          <ul className="space-y-2.5">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
