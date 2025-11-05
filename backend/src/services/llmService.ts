import axios from 'axios'

export interface TripPlanRequest {
  destination: string
  startDate: string
  endDate: string
  budget: number
  travelers: number
  preferences: string[]
  description?: string
}

export interface Activity {
  time: string
  title: string
  location: string
  description: string
  estimatedCost: number
  duration: string
}

export interface DayPlan {
  day: number
  date: string
  activities: Activity[]
}

export interface BudgetItem {
  category: string
  amount: number
  description: string
}

export interface TripPlanResponse {
  itinerary: DayPlan[]
  budgetBreakdown: BudgetItem[]
  tips: string[]
  recommendations?: string[]
}

export class LLMService {
  private apiKey: string
  private model: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.DASHSCOPE_API_KEY || ''
    this.model = process.env.LLM_MODEL || 'qwen-turbo'
    this.baseUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'
  }

  /**
   * 生成旅行计划
   */
  async generateTripPlan(request: TripPlanRequest): Promise<TripPlanResponse> {
    const prompt = this.buildPrompt(request)

    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: this.model,
          input: {
            messages: [
              {
                role: 'system',
                content: '你是一个专业的旅行规划助手，擅长根据用户需求制定详细的旅行计划。你的回答应该包含每日行程、预算分配、实用建议等信息。请以 JSON 格式返回结果。'
              },
              {
                role: 'user',
                content: prompt
              }
            ]
          },
          parameters: {
            result_format: 'message',
            temperature: 0.7,
            max_tokens: 2000
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.output && response.data.output.choices) {
        const content = response.data.output.choices[0].message.content
        return this.parseLLMResponse(content, request)
      }

      throw new Error('LLM 返回数据格式错误')
    } catch (error: any) {
      console.error('LLM API 调用失败:', error.response?.data || error.message)
      // 返回默认计划作为降级
      return this.generateDefaultPlan(request)
    }
  }

  /**
   * 构建提示词
   */
  private buildPrompt(request: TripPlanRequest): string {
    const days = this.calculateDays(request.startDate, request.endDate)
    const dailyBudget = request.budget / days

    return `
请为以下旅行需求制定详细的旅行计划：

**目的地**: ${request.destination}
**出行日期**: ${request.startDate} 至 ${request.endDate} (共 ${days} 天)
**出行人数**: ${request.travelers} 人
**总预算**: ¥${request.budget} (人均每日约 ¥${dailyBudget.toFixed(0)})
**旅行偏好**: ${request.preferences.join('、') || '无特殊偏好'}
${request.description ? `**特殊需求**: ${request.description}` : ''}

请提供以下内容：

1. **每日详细行程** (包括时间、地点、活动、预估费用、游玩时长)
2. **预算分配建议** (住宿、餐饮、交通、门票、购物等)
3. **实用旅行建议** (最佳游玩路线、注意事项、美食推荐等)

请严格按照以下 JSON 格式返回（只返回 JSON，不要其他文字）:
{
  "itinerary": [
    {
      "day": 1,
      "date": "2024-01-01",
      "activities": [
        {
          "time": "09:00",
          "title": "参观景点",
          "location": "具体位置",
          "description": "活动描述",
          "estimatedCost": 100,
          "duration": "2小时"
        }
      ]
    }
  ],
  "budgetBreakdown": [
    {
      "category": "住宿",
      "amount": 1000,
      "description": "描述"
    }
  ],
  "tips": [
    "旅行建议1",
    "旅行建议2"
  ]
}
`
  }

  /**
   * 解析 LLM 返回的内容
   */
  private parseLLMResponse(content: string, request: TripPlanRequest): TripPlanResponse {
    try {
      // 尝试提取 JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return parsed
      }

      // 如果无法解析 JSON，返回默认结构
      return this.generateDefaultPlan(request)
    } catch (error) {
      console.error('解析 LLM 响应失败:', error)
      return this.generateDefaultPlan(request)
    }
  }

  /**
   * 生成默认计划（作为降级方案）
   */
  private generateDefaultPlan(request: TripPlanRequest): TripPlanResponse {
    const days = this.calculateDays(request.startDate, request.endDate)
    const itinerary: DayPlan[] = []

    for (let i = 0; i < days; i++) {
      const date = new Date(request.startDate)
      date.setDate(date.getDate() + i)

      itinerary.push({
        day: i + 1,
        date: date.toISOString().split('T')[0],
        activities: [
          {
            time: '09:00',
            title: `${request.destination}景点游览`,
            location: request.destination,
            description: '探索当地著名景点',
            estimatedCost: 100,
            duration: '3小时'
          },
          {
            time: '12:00',
            title: '午餐时间',
            location: '当地特色餐厅',
            description: '品尝当地美食',
            estimatedCost: 80,
            duration: '1小时'
          },
          {
            time: '14:00',
            title: '自由活动',
            location: request.destination,
            description: '自由探索或休息',
            estimatedCost: 50,
            duration: '2小时'
          }
        ]
      })
    }

    return {
      itinerary,
      budgetBreakdown: [
        { category: '住宿', amount: request.budget * 0.35, description: '酒店住宿费用' },
        { category: '餐饮', amount: request.budget * 0.30, description: '餐饮费用' },
        { category: '交通', amount: request.budget * 0.15, description: '交通费用' },
        { category: '门票', amount: request.budget * 0.10, description: '景点门票' },
        { category: '购物', amount: request.budget * 0.10, description: '购物和其他' }
      ],
      tips: [
        '提前查看天气预报，准备合适的衣物',
        '提前预订热门景点门票',
        '保管好贵重物品',
        '了解当地的风俗习惯'
      ]
    }
  }

  /**
   * 计算天数
   */
  private calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + 1
  }
}
