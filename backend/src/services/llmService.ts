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
                content: '你是一个专业的旅行规划助手，擅长根据用户需求制定详细的旅行计划。你的回答应该包含每日行程、预算分配、实用建议等信息。请严格按照 JSON 格式返回结果,不要添加任何额外的文字说明。JSON 必须是有效的,不能有尾随逗号或格式错误。'
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
    const dailyBudget = request.budget / days / request.travelers

    return `
请为以下旅行需求制定**详细且实用**的旅行计划：

**目的地**: ${request.destination}
**出行日期**: ${request.startDate} 至 ${request.endDate} (共 ${days} 天)
**出行人数**: ${request.travelers} 人
**总预算**: ¥${request.budget} (人均每日约 ¥${dailyBudget.toFixed(0)})
**旅行偏好**: ${request.preferences.join('、') || '无特殊偏好'}
${request.description ? `**用户需求**: ${request.description}` : ''}

请作为专业旅行规划师，提供以下**完整详细**的内容：

### 1. 每日详细行程安排
- 必须包含：具体时间、景点/餐厅名称、详细地址、活动描述、预估费用、游玩时长
- 推荐具体的交通方式（如何从酒店到景点）
- 推荐具体的餐厅名称和特色菜品
- 推荐住宿区域和酒店类型
- 考虑实际游玩节奏，避免行程过于紧凑

### 2. 完整预算分配明细
- 住宿：推荐酒店档次和每晚价格范围
- 餐饮：早中晚餐预算，推荐人均消费
- 交通：往返大交通、当地交通（地铁/打车/租车）
- 门票：各景点门票价格
- 购物：特产、纪念品预算
- 其他：保险、应急费用等

### 3. 实用旅行建议
- 最佳游玩路线和交通攻略
- 必吃美食和推荐餐厅
- 必买特产和购物地点
- 天气穿衣建议
- 注意事项和安全提示
- 省钱小技巧

请严格按照以下 JSON 格式返回（只返回JSON，不要markdown代码块标记）:
{
  "itinerary": [
    {
      "day": 1,
      "date": "2024-01-01",
      "activities": [
        {
          "time": "09:00",
          "title": "游览故宫博物院",
          "location": "北京市东城区景山前街4号",
          "description": "参观世界最大的古代宫殿建筑群，游览太和殿、乾清宫等主要宫殿。建议从午门进入，按中轴线游览。",
          "estimatedCost": 60,
          "duration": "3-4小时"
        },
        {
          "time": "12:30",
          "title": "全聚德烤鸭午餐",
          "location": "和平门店，北京市西城区前门西大街14号",
          "description": "品尝正宗北京烤鸭，推荐套餐含烤鸭、鸭汤、配菜，人均约150元",
          "estimatedCost": 150,
          "duration": "1.5小时"
        }
      ]
    }
  ],
  "budgetBreakdown": [
    {
      "category": "住宿",
      "amount": 2000,
      "description": "4星级酒店，靠近地铁，含早餐，每晚约500元×4晚"
    },
    {
      "category": "餐饮",
      "amount": 1500,
      "description": "早餐酒店含，午餐人均80元，晚餐人均100元，5天×2人"
    },
    {
      "category": "大交通",
      "amount": 1200,
      "description": "往返高铁/飞机票，2人"
    },
    {
      "category": "当地交通",
      "amount": 300,
      "description": "地铁卡、公交、偶尔打车"
    },
    {
      "category": "门票",
      "amount": 800,
      "description": "主要景点门票，2人"
    },
    {
      "category": "购物",
      "amount": 500,
      "description": "特产、纪念品"
    }
  ],
  "tips": [
    "提前在官网预约故宫门票，避免排队",
    "下载高德地图，使用地铁出行最方便",
    "必吃：北京烤鸭、炸酱面、豆汁、驴打滚",
    "必买特产：稻香村点心、北京烤鸭真空包装",
    "春秋季节最佳，夏季较热，冬季寒冷",
    "景区周边小心黑导游和高价纪念品",
    "部分景点有学生票，记得带学生证"
  ]
}

重要提示：
1. 必须返回有效的 JSON 格式
2. 不要有任何尾随逗号
3. 不要在 JSON 外添加任何解释文字
4. 确保所有字符串都用双引号
5. 确保所有数组和对象都正确闭合
`
  }

  /**
   * 解析 LLM 返回的内容
   */
  private parseLLMResponse(content: string, request: TripPlanRequest): TripPlanResponse {
    try {
      // 尝试多种方式提取和修复 JSON
      let jsonStr = content

      // 1. 提取 ```json 代码块
      const codeBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1]
      } else {
        // 2. 提取大括号内容
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          jsonStr = jsonMatch[0]
        }
      }

      // 3. 清理常见的 JSON 错误
      jsonStr = jsonStr
        .replace(/,(\s*[}\]])/g, '$1')  // 移除尾随逗号
        .replace(/\n/g, ' ')             // 移除换行
        .replace(/\r/g, '')              // 移除回车
        .trim()

      // 4. 尝试解析
      const parsed = JSON.parse(jsonStr)
      
      // 5. 验证必需字段
      if (!parsed.itinerary || !Array.isArray(parsed.itinerary)) {
        throw new Error('缺少 itinerary 字段')
      }

      return {
        itinerary: parsed.itinerary || [],
        budgetBreakdown: parsed.budgetBreakdown || [],
        tips: parsed.tips || [],
        recommendations: parsed.recommendations || []
      }
    } catch (error) {
      console.error('解析 LLM 响应失败:', error)
      console.error('原始内容:', content.substring(0, 500))
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

      const dayActivities: Activity[] = [
        {
          time: '08:00',
          title: '酒店早餐',
          location: '酒店餐厅',
          description: '享用酒店提供的自助早餐，补充能量开始新的一天',
          estimatedCost: 0,
          duration: '1小时'
        },
        {
          time: '09:30',
          title: `${request.destination}热门景点游览`,
          location: `${request.destination}市区`,
          description: '游览当地最著名的景点，拍照留念，了解历史文化。建议提前在官网或旅游平台预约门票，避免现场排队。',
          estimatedCost: 120,
          duration: '3-4小时'
        },
        {
          time: '13:00',
          title: '品尝当地特色美食',
          location: '景区附近推荐餐厅',
          description: `享用${request.destination}特色菜品，推荐尝试当地最有名的美食。建议选择口碑好的餐厅，人均约80-100元。`,
          estimatedCost: 100,
          duration: '1.5小时'
        },
        {
          time: '15:00',
          title: '次要景点或购物',
          location: `${request.destination}商业区`,
          description: '游览其他景点或前往当地特色商业街购物，选购纪念品和特产。',
          estimatedCost: 80,
          duration: '2-3小时'
        },
        {
          time: '18:30',
          title: '晚餐时光',
          location: '当地特色餐厅',
          description: '品尝当地晚餐美食，可以选择夜市小吃或特色餐厅，体验当地饮食文化。',
          estimatedCost: 120,
          duration: '1.5小时'
        },
        {
          time: '20:30',
          title: '夜游或返回酒店',
          location: `${request.destination}夜景区域`,
          description: '如果有夜景可以欣赏夜景，或者返回酒店休息，为第二天行程养精蓄锐。',
          estimatedCost: 50,
          duration: '1-2小时'
        }
      ]

      itinerary.push({
        day: i + 1,
        date: date.toISOString().split('T')[0],
        activities: dayActivities
      })
    }

    const accommodationCost = request.budget * 0.35
    const foodCost = request.budget * 0.30
    const transportCost = request.budget * 0.20
    const ticketCost = request.budget * 0.10
    const shoppingCost = request.budget * 0.05

    return {
      itinerary,
      budgetBreakdown: [
        { 
          category: '住宿', 
          amount: accommodationCost, 
          description: `中档酒店或快捷酒店，${days-1}晚，每晚约${(accommodationCost/(days-1)).toFixed(0)}元，含早餐` 
        },
        { 
          category: '餐饮', 
          amount: foodCost, 
          description: `午餐和晚餐，${days}天×2餐，人均80-120元。推荐品尝当地特色美食。` 
        },
        { 
          category: '大交通', 
          amount: transportCost * 0.7, 
          description: `往返${request.destination}的高铁或飞机票，${request.travelers}人` 
        },
        { 
          category: '当地交通', 
          amount: transportCost * 0.3, 
          description: '地铁、公交、偶尔打车的费用，建议办理当地交通卡' 
        },
        { 
          category: '门票', 
          amount: ticketCost, 
          description: '主要景点门票，建议提前在网上购买，通常有优惠' 
        },
        { 
          category: '购物娱乐', 
          amount: shoppingCost, 
          description: '购买特产、纪念品和其他娱乐消费' 
        }
      ],
      tips: [
        `🎫 提前在官网或旅游平台预约${request.destination}热门景点门票，避免排队`,
        '🚇 下载高德地图或百度地图，使用地铁出行最方便快捷',
        `🍜 必尝当地特色美食，可以提前在大众点评上查找口碑餐厅`,
        '🎁 购买特产建议去大型超市，价格更实惠且质量有保证',
        '🌤️ 出行前查看天气预报，准备合适的衣物和雨具',
        '💰 准备部分现金，部分小店可能不支持移动支付',
        '📱 保持手机电量充足，随时可以导航和查询信息',
        '🏥 了解附近医院位置，准备常用药品',
        request.preferences.includes('美食') ? '🍴 推荐预留更多餐饮预算，品尝各类美食' : '',
        request.preferences.includes('购物') ? '🛍️ 建议预留更多购物预算，购买心仪商品' : '',
        request.preferences.includes('亲子活动') ? '👨‍👩‍👧 带孩子出行记得准备零食、玩具和常用药品' : ''
      ].filter(Boolean)
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
