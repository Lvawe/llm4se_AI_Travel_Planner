'use client'

import { useEffect, useRef, useState } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'

interface AmapComponentProps {
  destination?: string
}

export default function AmapComponent({ destination }: AmapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)

  useEffect(() => {
    // 初始化地图
    const initMap = async () => {
      try {
        const AMap = await AMapLoader.load({
          key: process.env.NEXT_PUBLIC_AMAP_KEY || 'your-amap-key', // 需要配置高德地图 Key
          version: '2.0',
          plugins: ['AMap.Geocoder', 'AMap.Marker', 'AMap.AutoComplete']
        })

        if (!mapContainer.current) return

        // 创建地图实例
        const mapInstance = new AMap.Map(mapContainer.current, {
          zoom: 11,
          center: [116.397428, 39.90923], // 默认中心点：北京
          viewMode: '3D',
          pitch: 50
        })

        setMap(mapInstance)
      } catch (error) {
        console.error('地图加载失败:', error)
      }
    }

    initMap()

    // 清理函数
    return () => {
      if (map) {
        map.destroy()
      }
    }
  }, [])

  useEffect(() => {
    // 根据目的地搜索并更新地图
    if (map && destination && destination.trim()) {
      const geocoder = new (window as any).AMap.Geocoder({
        city: '全国'
      })

      geocoder.getLocation(destination, (status: string, result: any) => {
        if (status === 'complete' && result.geocodes.length) {
          const location = result.geocodes[0].location
          
          // 移动地图中心
          map.setCenter([location.lng, location.lat])
          map.setZoom(12)

          // 移除旧标记
          if (marker) {
            map.remove(marker)
          }

          // 添加新标记
          const newMarker = new (window as any).AMap.Marker({
            position: [location.lng, location.lat],
            title: destination,
            animation: 'AMAP_ANIMATION_DROP'
          })

          map.add(newMarker)
          setMarker(newMarker)

          // 添加信息窗口
          const infoWindow = new (window as any).AMap.InfoWindow({
            content: `<div style="padding: 10px;"><strong>${destination}</strong></div>`,
            offset: new (window as any).AMap.Pixel(0, -30)
          })

          newMarker.on('click', () => {
            infoWindow.open(map, newMarker.getPosition())
          })
        }
      })
    }
  }, [map, destination, marker])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {!destination && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <p className="text-gray-600 text-center px-4">
            输入目的地后将显示地图位置
          </p>
        </div>
      )}
    </div>
  )
}
