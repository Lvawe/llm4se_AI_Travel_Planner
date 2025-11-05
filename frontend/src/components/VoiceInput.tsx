'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Volume2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface VoiceInputProps {
  onResult: (text: string) => void
  placeholder?: string
}

export default function VoiceInput({ onResult, placeholder = '🎤 说出您的旅行需求' }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // 清理函数
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startRecording = () => {
    try {
      // 检查浏览器是否支持语音识别
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (!SpeechRecognition) {
        toast.error('您的浏览器不支持语音识别，请使用 Chrome 或 Edge 浏览器')
        return
      }

      const recognition = new SpeechRecognition()
      recognition.lang = 'zh-CN'
      recognition.continuous = true
      recognition.interimResults = true
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsRecording(true)
        toast.success('开始录音，请说话...', { icon: '🎤', duration: 2000 })
        console.log('语音识别已启动')
      }

      recognition.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += result
          } else {
            interimTranscript += result
          }
        }

        // 更新实时识别文本
        setInterimText(interimTranscript)
        
        // 如果有最终结果，累加到总文本中
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript)
        }
      }

      recognition.onerror = (event: any) => {
        console.error('语音识别错误:', event.error)
        if (event.error === 'no-speech') {
          toast.error('未检测到语音，请再试一次')
        } else if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          toast.error('请允许浏览器访问麦克风权限')
        } else if (event.error === 'network') {
          toast.error('网络错误，请检查网络连接')
        } else {
          toast.error('语音识别出错: ' + event.error)
        }
        stopRecording()
      }

      recognition.onend = () => {
        console.log('语音识别已结束')
        if (isRecording) {
          // 如果还在录音状态但识别结束了，可能是超时，重新启动
          setIsRecording(false)
        }
      }

      recognition.start()
      recognitionRef.current = recognition
    } catch (error) {
      console.error('启动语音识别失败:', error)
      toast.error('语音识别启动失败')
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    
    const finalText = transcript + interimText
    
    if (finalText && finalText.trim()) {
      onResult(finalText.trim())
      toast.success('语音输入完成！', { icon: '✅' })
    } else {
      toast.error('未识别到内容，请重试')
    }
    
    setIsRecording(false)
    setTranscript('')
    setInterimText('')
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-4 rounded-full transition-all transform hover:scale-110 ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-300'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
          } text-white shadow-lg hover:shadow-xl`}
          title={isRecording ? '点击停止录音' : '点击开始语音输入'}
        >
          {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>
        
        {isRecording && (
          <div className="text-center animate-fade-in w-full">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Volume2 className="h-4 w-4 text-red-500 animate-pulse" />
              <p className="text-sm font-medium text-red-600">正在录音中...</p>
            </div>
            
            {(transcript || interimText) && (
              <div className="mt-2 text-sm text-gray-900 bg-white px-4 py-3 rounded-lg shadow-sm border border-blue-200 max-w-md mx-auto">
                <p className="text-xs text-gray-500 mb-1">识别内容：</p>
                <p className="text-left">
                  <span className="text-gray-900">{transcript}</span>
                  <span className="text-gray-400 italic">{interimText}</span>
                </p>
              </div>
            )}
            
            <p className="text-xs text-gray-600 mt-2">
              💡 说完后点击停止按钮
            </p>
          </div>
        )}
        
        {!isRecording && (
          <div className="text-center">
            <p className="text-sm text-gray-700 font-medium">{placeholder}</p>
            <p className="text-xs text-gray-500 mt-1">
              例如：我想去成都，5天4晚，预算5000元，喜欢美食和历史文化，2个人
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
