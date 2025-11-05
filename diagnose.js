// 测试脚本：检查AI生成和数据保存
// 在浏览器控制台运行此脚本

console.log('🔍 开始诊断 AI Travel Planner...\n')

// 1. 检查地图组件
console.log('1️⃣ 检查地图组件:')
const mapContainer = document.querySelector('[class*="amap"]') || document.querySelector('canvas')
if (mapContainer) {
  console.log('✅ 地图容器已找到')
  console.log('   地图元素:', mapContainer)
} else {
  console.log('❌ 未找到地图容器')
}

// 2. 检查高德地图是否加载
console.log('\n2️⃣ 检查高德地图 API:')
if (window.AMap) {
  console.log('✅ 高德地图 API 已加载')
  console.log('   版本:', window.AMap.version)
} else {
  console.log('❌ 高德地图 API 未加载')
}

// 3. 检查当前页面数据
console.log('\n3️⃣ 检查页面数据:')
const pathParts = window.location.pathname.split('/')
if (pathParts.includes('trips') && pathParts[pathParts.length - 1]) {
  const tripId = pathParts[pathParts.length - 1]
  console.log('📍 当前行程ID:', tripId)
  
  // 尝试获取行程数据
  fetch(`http://localhost:3001/api/trips/${tripId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log('✅ 行程数据获取成功:')
      console.log('   目的地:', data.destination)
      console.log('   预算:', data.budget)
      console.log('   AI计划:', data.itinerary ? '✅ 存在' : '❌ 不存在')
      if (data.itinerary) {
        console.log('   - 行程安排:', data.itinerary.itinerary ? `${data.itinerary.itinerary.length}天` : '❌ 缺失')
        console.log('   - 预算明细:', data.itinerary.budgetBreakdown ? '✅ 存在' : '❌ 缺失')
        console.log('   - 旅行建议:', data.itinerary.tips ? `${data.itinerary.tips.length}条` : '❌ 缺失')
        console.log('\n完整数据:', data.itinerary)
      }
    })
    .catch(err => {
      console.log('❌ 获取行程数据失败:', err.message)
    })
} else {
  console.log('ℹ️  不在行程详情页面')
}

// 4. 检查语音识别
console.log('\n4️⃣ 检查语音识别支持:')
if (window.SpeechRecognition || window.webkitSpeechRecognition) {
  console.log('✅ 浏览器支持语音识别')
} else {
  console.log('❌ 浏览器不支持语音识别')
  console.log('   请使用 Chrome 或 Edge 浏览器')
}

// 5. 检查 localStorage
console.log('\n5️⃣ 检查本地存储:')
const token = localStorage.getItem('token')
if (token) {
  console.log('✅ 用户已登录')
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    console.log('   用户ID:', payload.userId)
    console.log('   过期时间:', new Date(payload.exp * 1000).toLocaleString())
  } catch (e) {
    console.log('   Token 格式:', token.substring(0, 20) + '...')
  }
} else {
  console.log('❌ 用户未登录')
}

console.log('\n✅ 诊断完成！')
console.log('\n📝 使用说明:')
console.log('1. 如果地图不显示，检查 .env.local 中的 NEXT_PUBLIC_AMAP_KEY')
console.log('2. 如果 AI 计划不显示，检查行程数据中的 itinerary 字段')
console.log('3. 如果创建失败，检查后端 .env 中的 DASHSCOPE_API_KEY')
