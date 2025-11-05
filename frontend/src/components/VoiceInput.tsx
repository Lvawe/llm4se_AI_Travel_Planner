'use client'

import { useState, useRef } from 'react'
import { Mic, Square } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface VoiceInputProps {
  onResult: (text: string) => void
  placeholder?: string
}

export default function VoiceInput({ onResult, placeholder = '点击麦克风开始语音输入' }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<any>(null)

  const startRecording = () => {
    try {
      // 检查浏览器是否支持语音识别
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (!SpeechRecognition) {
        toast.error('您的浏览器不支持语音识别，请使用 Chrome 浏览器')
        return
      }

      const recognition = new SpeechRecognition()
      recognition.lang = 'zh-CN'
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onstart = () => {
        setIsRecording(true)
        console.log('语音识别已启动')
      }

      recognition.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(finalTranscript || interimTranscript)
      }

      recognition.onerror = (event: any) => {
        console.error('语音识别错误:', event.error)
        if (event.error === 'no-speech') {
          toast.error('未检测到语音，请重试')
        } else if (event.error === 'not-allowed') {
          toast.error('请允许浏览器访问麦克风')
        } else {
          toast.error('语音识别出错: ' + event.error)
        }
        stopRecording()
      }

      recognition.onend = () => {
        setIsRecording(false)
        console.log('语音识别已结束')
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
    
    if (transcript) {
      onResult(transcript)
      toast.success('语音输入完成')
    }
    
    setIsRecording(false)
    setTranscript('')
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={`p-3 rounded-full transition-all ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-primary-500 hover:bg-primary-600'
        } text-white shadow-lg hover:shadow-xl`}
        title={isRecording ? '停止录音' : '开始语音输入'}
      >
        {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </button>
      
      {isRecording && (
        <div className="text-center animate-fade-in">
          <p className="text-xs text-gray-600">正在录音...</p>
          {transcript && (
            <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm max-w-xs">
              {transcript}
            </p>
          )}
        </div>
      )}
      
      {!isRecording && !transcript && (
        <p className="text-xs text-gray-500">{placeholder}</p>
      )}
    </div>
  )
}
