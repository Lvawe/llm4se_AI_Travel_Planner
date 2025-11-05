# 讯飞语音识别 API 集成指南

## 1. 讯飞开放平台配置

### 获取 API 凭证：

1. 访问讯飞开放平台：https://www.xfyun.cn/
2. 注册并登录账号
3. 控制台 → 创建新应用
4. 选择"语音听写（流式版）"服务
5. 获取 APPID、APISecret、APIKey

### API 凭证配置：

在 `backend/.env` 文件中添加：

```env
IFLYTEK_APPID=your_appid
IFLYTEK_API_SECRET=your_api_secret
IFLYTEK_API_KEY=your_api_key
```

## 2. 技术方案

### WebSocket 实时语音识别

讯飞提供 WebSocket 接口进行实时语音流识别：

**接口地址：**
```
wss://iat-api.xfyun.cn/v2/iat
```

**认证方式：**
使用 HMAC-SHA256 签名算法

### 集成架构：

```
前端（浏览器）
    ↓ 录音（MediaRecorder API）
    ↓ WebSocket 连接
后端（Node.js）
    ↓ 转发到讯飞 WebSocket
    ↓ 接收识别结果
前端
    ↓ 显示文本结果
```

## 3. 实现步骤

### 3.1 前端：录音组件

创建 `frontend/src/components/VoiceInput.tsx`：

```tsx
'use client'

import { useState, useRef } from 'react'
import { Mic, Square } from 'lucide-react'

interface VoiceInputProps {
  onResult: (text: string) => void
}

export default function VoiceInput({ onResult }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const wsRef = useRef<WebSocket | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      // 连接到后端 WebSocket
      const ws = new WebSocket('ws://localhost:3001/api/voice/recognize')
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket 连接成功')
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.text) {
          setTranscript(prev => prev + data.text)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket 错误:', error)
      }

      ws.onclose = () => {
        console.log('WebSocket 连接关闭')
      }

      // 发送音频数据
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
          ws.send(event.data)
        }
      }

      mediaRecorder.start(100) // 每 100ms 发送一次数据
      setIsRecording(true)
    } catch (error) {
      console.error('录音启动失败:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }

    if (wsRef.current) {
      wsRef.current.close()
    }

    setIsRecording(false)
    onResult(transcript)
    setTranscript('')
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`p-4 rounded-full transition-all ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-primary-500 hover:bg-primary-600'
        } text-white shadow-lg`}
      >
        {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </button>
      {isRecording && (
        <div className="text-center">
          <p className="text-sm text-gray-600">正在录音...</p>
          {transcript && (
            <p className="mt-2 text-gray-900 bg-white px-4 py-2 rounded-lg shadow">
              {transcript}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
```

### 3.2 后端：WebSocket 服务

创建 `backend/src/services/voiceService.ts`：

```typescript
import WebSocket from 'ws'
import crypto from 'crypto'

export class VoiceRecognitionService {
  private appId: string
  private apiSecret: string
  private apiKey: string

  constructor() {
    this.appId = process.env.IFLYTEK_APPID || ''
    this.apiSecret = process.env.IFLYTEK_API_SECRET || ''
    this.apiKey = process.env.IFLYTEK_API_KEY || ''
  }

  // 生成讯飞 WebSocket 认证 URL
  private generateAuthUrl(): string {
    const host = 'iat-api.xfyun.cn'
    const path = '/v2/iat'
    const date = new Date().toUTCString()

    // 生成签名
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`
    const signature = crypto
      .createHmac('sha256', this.apiSecret)
      .update(signatureOrigin)
      .digest('base64')

    const authorizationOrigin = `api_key="${this.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
    const authorization = Buffer.from(authorizationOrigin).toString('base64')

    return `wss://${host}${path}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${host}`
  }

  // 处理客户端 WebSocket 连接
  public handleClientConnection(clientWs: WebSocket) {
    const iflytekUrl = this.generateAuthUrl()
    const iflytekWs = new WebSocket(iflytekUrl)

    // 讯飞连接建立
    iflytekWs.on('open', () => {
      console.log('已连接到讯飞语音识别服务')

      // 发送配置参数
      const params = {
        common: {
          app_id: this.appId
        },
        business: {
          language: 'zh_cn',
          domain: 'iat',
          accent: 'mandarin',
          vad_eos: 2000,
          dwa: 'wpgs'
        },
        data: {
          status: 0,
          format: 'audio/L16;rate=16000',
          encoding: 'raw',
          audio: ''
        }
      }

      iflytekWs.send(JSON.stringify(params))
    })

    // 接收客户端音频数据
    clientWs.on('message', (data: Buffer) => {
      if (iflytekWs.readyState === WebSocket.OPEN) {
        const audioBase64 = data.toString('base64')
        const frame = {
          data: {
            status: 1,
            format: 'audio/L16;rate=16000',
            encoding: 'raw',
            audio: audioBase64
          }
        }
        iflytekWs.send(JSON.stringify(frame))
      }
    })

    // 客户端连接关闭
    clientWs.on('close', () => {
      if (iflytekWs.readyState === WebSocket.OPEN) {
        const endFrame = {
          data: {
            status: 2,
            format: 'audio/L16;rate=16000',
            encoding: 'raw',
            audio: ''
          }
        }
        iflytekWs.send(JSON.stringify(endFrame))
        iflytekWs.close()
      }
    })

    // 接收讯飞识别结果
    iflytekWs.on('message', (data: string) => {
      try {
        const result = JSON.parse(data)
        if (result.data && result.data.result) {
          const text = result.data.result.ws
            .map((word: any) => word.cw.map((w: any) => w.w).join(''))
            .join('')

          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ text }))
          }
        }
      } catch (error) {
        console.error('解析讯飞返回数据失败:', error)
      }
    })

    // 错误处理
    iflytekWs.on('error', (error) => {
      console.error('讯飞 WebSocket 错误:', error)
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ error: '语音识别服务错误' }))
      }
    })
  }
}
```

### 3.3 后端：WebSocket 路由

在 `backend/src/index.ts` 中添加 WebSocket 服务器：

```typescript
import { WebSocketServer } from 'ws'
import { VoiceRecognitionService } from './services/voiceService'

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ noServer: true })
const voiceService = new VoiceRecognitionService()

wss.on('connection', (ws) => {
  voiceService.handleClientConnection(ws)
})

// 在 HTTP 服务器上处理 WebSocket 升级
server.on('upgrade', (request, socket, head) => {
  if (request.url === '/api/voice/recognize') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
  } else {
    socket.destroy()
  }
})
```

## 4. 依赖安装

```bash
cd backend
npm install ws @types/ws
```

## 5. 测试步骤

1. 配置环境变量（APPID、APISecret、APIKey）
2. 启动后端服务
3. 在创建行程页面点击麦克风按钮
4. 允许浏览器访问麦克风
5. 开始说话，实时查看识别结果

## 6. 注意事项

- 讯飞语音识别每日有免费额度限制
- 需要 HTTPS 环境才能在生产环境使用麦克风
- 建议添加错误处理和重连机制
- 音频格式需要转换为讯飞支持的格式（16k 采样率，PCM 编码）

## 7. 相关文档

- 讯飞语音听写 API 文档：https://www.xfyun.cn/doc/asr/voicedictation/API.html
- WebRTC MediaRecorder API：https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
