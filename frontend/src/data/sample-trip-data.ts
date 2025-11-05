// 示例: AI 生成的旅行规划数据结构
// 可以用这个数据测试 AITripPlan 组件

export const sampleTripPlan = {
  destination: "济南",
  itinerary: [
    {
      day: "2025-10-17",
      date: "初始旅程",
      activities: [
        {
          time: "10:00-12:00",
          title: "趵突泉公园",
          description: "游览济南三大名胜之一,观赏七十二名泉之首,泉水常年恒温18℃左右。建议从正门进入,沿着泉水步道游览。",
          location: "济南市历下区趵突泉南路1号",
          duration: "约2小时",
          price: "¥150"
        },
        {
          time: "12:30-14:00",
          title: "品尝济南特色餐厅",
          description: "推荐品尝济南特色九转大肠、糖醋鲤鱼、油旋等传统鲁菜。",
          location: "河南省市历下区泉城路",
          duration: "约1.5小时",
          price: "¥150"
        },
        {
          time: "15:00-17:00",
          title: "大明湖畔",
          description: "漫步大明湖,欣赏荷花与杨柳,体验'四面荷花三面柳,一城山色半城湖'的意境。",
          location: "济南市历下区大明湖路",
          duration: "约2小时",
          price: "免费"
        }
      ]
    },
    {
      day: "2025-10-18",
      date: "深度探索",
      activities: [
        {
          time: "09:00-12:00",
          title: "千佛山",
          description: "登山健身,参观千佛山石窟,俯瞰济南全景。建议乘坐缆车上山,步行下山。",
          location: "济南市历下区经十一路18号",
          duration: "约3小时",
          price: "¥60"
        },
        {
          time: "12:30-14:00",
          title: "品尝济南小吃",
          description: "在大街品尝油旋、甜沫、把子肉等济南特色小吃。",
          location: "济南市市中区芙蓉街",
          duration: "约1.5小时",
          price: "¥80"
        },
        {
          time: "15:00-17:00",
          title: "山东博物馆",
          description: "了解山东历史文化,参观青铜器、陶瓷、书画等珍贵文物。",
          location: "济南市历下区经十路11899号",
          duration: "约2小时",
          price: "免费(需预约)"
        }
      ]
    }
  ],
  budgetBreakdown: [
    {
      category: "交通",
      amount: 200,
      percentage: 11.8
    },
    {
      category: "住宿",
      amount: 400,
      percentage: 23.5
    },
    {
      category: "餐饮",
      amount: 400,
      percentage: 23.5
    },
    {
      category: "门票",
      amount: 400,
      percentage: 23.5
    },
    {
      category: "购物",
      amount: 300,
      percentage: 17.6
    }
  ],
  totalBudget: 1700,
  tips: [
    "可提前预订酒店,选择靠近地铁站的位置出行更便捷。",
    "济南夏季炎热,建议做好防晒措施,携带遮阳伞和防晒霜。",
    "趵突泉和大明湖的最佳游览时间是清晨或傍晚,人少景美。",
    "品尝当地美食时,推荐去芙蓉街、宽厚里等老街区。"
  ]
}

// 使用示例:
// import { sampleTripPlan } from './sample-trip-data'
// 
// <AITripPlan
//   destination={sampleTripPlan.destination}
//   itinerary={sampleTripPlan.itinerary}
//   budgetBreakdown={sampleTripPlan.budgetBreakdown}
//   totalBudget={sampleTripPlan.totalBudget}
//   tips={sampleTripPlan.tips}
// />
