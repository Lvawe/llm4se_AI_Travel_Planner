'use client'

import { useEffect, useRef, useState } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'
import axios from 'axios'

interface AmapComponentProps {
  destination?: string
}

interface GeoCodeResult {
  lng: number
  lat: number
  address: string
}

export default function AmapComponent({ destination }: AmapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  // 使用高德 Web 服务 API 进行地理编码
  const geocodeAddress = async (address: string): Promise<GeoCodeResult | null> => {
    try {
      console.log('🔍 调用高德 Web 服务 API 地理编码:', address)
      
      const key = process.env.NEXT_PUBLIC_AMAP_KEY
      const url = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(address)}&key=${key}`
      
      const response = await axios.get(url)
      console.log('📍 地理编码 API 响应:', response.data)
      
      if (response.data.status === '1' && response.data.geocodes && response.data.geocodes.length > 0) {
        const result = response.data.geocodes[0]
        const [lng, lat] = result.location.split(',').map(Number)
        
        console.log('✅ 地址解析成功:', {
          address,
          lng,
          lat,
          formattedAddress: result.formatted_address
        })
        
        return {
          lng,
          lat,
          address: result.formatted_address
        }
      } else {
        console.error('❌ 地理编码失败:', response.data)
        return null
      }
    } catch (error) {
      console.error('❌ 地理编码 API 调用出错:', error)
      return null
    }
  }

  // 初始化地图
  useEffect(() => {
    let mapInstance: any = null
    
    const initMap = async () => {
      try {
        console.log('🗺️ 开始加载高德地图...')
        const AMap = await AMapLoader.load({
          key: process.env.NEXT_PUBLIC_AMAP_KEY || 'your-amap-key',
          version: '2.0',
          plugins: []
        })

        if (!mapContainer.current) {
          console.error('❌ 地图容器未找到')
          return
        }

        // 创建地图实例
        mapInstance = new AMap.Map(mapContainer.current, {
          zoom: 10, // 缩放级别10,可以看到整个城市全貌
          center: [116.397428, 39.90923], // 默认中心点:北京
          viewMode: '2D',
          mapStyle: 'amap://styles/normal'
        })

        console.log('✅ 地图加载成功')
        setMap(mapInstance)
        setIsMapLoaded(true)
      } catch (error) {
        console.error('❌ 地图加载失败:', error)
      }
    }

    if (mapContainer.current && !map) {
      initMap()
    }

    // 清理函数
    return () => {
      if (mapInstance) {
        console.log('🧹 清理地图实例')
        mapInstance.destroy()
      }
    }
  }, []) // 只在组件挂载时执行一次

  // 根据目的地更新地图位置
  useEffect(() => {
    if (!map || !isMapLoaded || !destination || !destination.trim()) {
      console.log('⏸️ 跳过地图更新:', { 
        hasMap: !!map, 
        isMapLoaded, 
        destination 
      })
      return
    }

    const updateMapLocation = async () => {
      console.log('🎯 开始更新地图位置:', destination)
      
      // 使用 Web 服务 API 进行地理编码
      const geoResult = await geocodeAddress(destination)
      
      if (!geoResult) {
        console.error('❌ 无法获取地理位置')
        return
      }

      const { lng, lat, address } = geoResult
      const AMap = (window as any).AMap

      // 移动地图中心并设置缩放级别(zoom=10,可以看到整个城市全貌)
      console.log('🚀 移动地图到:', { lng, lat })
      map.setZoomAndCenter(10, [lng, lat])

      // 移除旧标记
      if (marker) {
        map.remove(marker)
        console.log('🗑️ 移除旧标记')
      }

      // 创建新标记
      const newMarker = new AMap.Marker({
        position: [lng, lat],
        title: destination,
        animation: 'AMAP_ANIMATION_DROP',
        offset: new AMap.Pixel(-13, -30)
      })

      map.add(newMarker)
      setMarker(newMarker)
      console.log('✅ 添加新标记')

      // 创建信息窗口
      const infoWindow = new AMap.InfoWindow({
        content: `
          <div style="padding: 12px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #333;">
              ${destination}
            </h3>
            <p style="margin: 0; font-size: 14px; color: #666;">
              ${address}
            </p>
          </div>
        `,
        offset: new AMap.Pixel(0, -30),
        closeWhenClickMap: true
      })

      // 点击标记显示信息窗口
      newMarker.on('click', () => {
        infoWindow.open(map, newMarker.getPosition())
      })

      // 自动显示信息窗口
      setTimeout(() => {
        infoWindow.open(map, newMarker.getPosition())
        console.log('ℹ️ 自动打开信息窗口')
      }, 600)

      console.log('✅ 地图位置更新完成')
    }

    updateMapLocation()
  }, [map, isMapLoaded, destination])

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">加载地图中...</p>
          </div>
        </div>
      )}
    </div>
  )
}
