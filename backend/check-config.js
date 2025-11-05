#!/usr/bin/env node

/**
 * API 配置检查脚本
 * 用于验证环境变量配置是否正确
 */

require('dotenv').config()
const axios = require('axios')

const checks = {
  database: false,
  amap: false,
  llm: false
}

console.log('🔍 开始检查 API 配置...\n')

// 1. 检查数据库连接
console.log('1️⃣  检查数据库配置...')
if (process.env.DATABASE_URL) {
  console.log('   ✅ DATABASE_URL 已配置')
  checks.database = true
} else {
  console.log('   ❌ DATABASE_URL 未配置')
}

// 2. 检查阿里云通义千问配置
console.log('\n2️⃣  检查通义千问 LLM 配置...')
if (process.env.DASHSCOPE_API_KEY && process.env.DASHSCOPE_API_KEY !== 'sk-your-api-key-here') {
  console.log('   ✅ DASHSCOPE_API_KEY 已配置')
  console.log(`   📝 模型: ${process.env.LLM_MODEL || 'qwen-turbo'}`)
  checks.llm = true
  
  // 测试 API 连接
  console.log('   🔄 测试通义千问 API 连接...')
  testDashScopeAPI()
} else {
  console.log('   ⚠️  DASHSCOPE_API_KEY 未配置或使用默认值')
  console.log('   💡 请访问 https://bailian.console.aliyun.com/ 获取 API Key')
}

// 3. 检查高德地图配置（前端）
console.log('\n3️⃣  检查高德地图配置...')
console.log('   💡 高德地图配置在 frontend/.env.local 中')
console.log('   💡 请确保设置了 NEXT_PUBLIC_AMAP_KEY')
console.log('   💡 获取地址: https://lbs.amap.com/')

// 4. 检查其他配置
console.log('\n4️⃣  检查其他配置...')
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ 已配置' : '❌ 未配置'}`)
console.log(`   BACKEND_PORT: ${process.env.BACKEND_PORT || '3001'}`)

// 测试通义千问 API
async function testDashScopeAPI() {
  try {
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      {
        model: process.env.LLM_MODEL || 'qwen-turbo',
        input: {
          messages: [
            {
              role: 'user',
              content: '你好'
            }
          ]
        },
        parameters: {
          result_format: 'message'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    )

    if (response.data && response.data.output) {
      console.log('   ✅ 通义千问 API 连接成功！')
      console.log(`   📨 测试响应: ${response.data.output.choices[0].message.content.substring(0, 20)}...`)
    }
  } catch (error) {
    if (error.response) {
      console.log(`   ❌ API 调用失败: ${error.response.status} - ${error.response.data.message || error.response.statusText}`)
      if (error.response.status === 401) {
        console.log('   💡 请检查 API Key 是否正确')
      }
    } else if (error.code === 'ECONNABORTED') {
      console.log('   ⚠️  API 请求超时，请检查网络连接')
    } else {
      console.log(`   ❌ 连接失败: ${error.message}`)
    }
  }
}

// 延迟输出总结
setTimeout(() => {
  console.log('\n' + '='.repeat(50))
  console.log('📊 配置检查总结:')
  console.log('='.repeat(50))
  console.log(`数据库:     ${checks.database ? '✅' : '❌'}`)
  console.log(`通义千问:   ${checks.llm ? '✅' : '⚠️'}`)
  console.log(`高德地图:   请手动检查 frontend/.env.local`)
  console.log('='.repeat(50))
  
  console.log('\n📝 下一步操作:')
  console.log('1. 如果配置有问题，请编辑 backend/.env 文件')
  console.log('2. 配置高德地图: 编辑 frontend/.env.local')
  console.log('3. 启动后端: cd backend && npm run dev')
  console.log('4. 启动前端: cd frontend && npm run dev')
  console.log('5. 访问: http://localhost:5090\n')
}, 2000)
