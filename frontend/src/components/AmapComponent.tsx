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

  const geocodeAddress = async (address: string): Promise<GeoCodeResult | null> => {
    try {
      const key = process.env.NEXT_PUBLIC_AMAP_KEY
      const url = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(address)}&key=${key}`
      const response = await axios.get(url)
      
      if (response.data.status === '1' && response.data.geocodes?.length > 0) {
        const result = response.data.geocodes[0]
        const [lng, lat] = result.location.split(',').map(Number)
        return { lng, lat, address: result.formatted_address }
      }
      return null
    } catch (error) {
      console.error('地理编码失败:', error)
      return null
    }
  }

  useEffect(() => {
    let mapInstance: any = null
    
    const initMap = async () => {
      try {
        const AMap = await AMapLoader.load({
          key: process.env.NEXT_PUBLIC_AMAP_KEY || '',
          version: '2.0',
          plugins: []
        })

        if (!mapContainer.current) return

        mapInstance = new AMap.Map(mapContainer.current, {
          zoom: 10,
          center: [116.397428, 39.90923],
          viewMode: '2D',
          mapStyle: 'amap://styles/normal'
        })

        setMap(mapInstance)
        setIsMapLoaded(true)
      } catch (error) {
        console.error('地图加载失败:', error)
      }
    }

    if (mapContainer.current && !map) {
      initMap()
    }

    return () => {
      if (mapInstance) {
        mapInstance.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (!map || !isMapLoaded || !destination?.trim()) return

    const updateMapLocation = async () => {
      const geoResult = await geocodeAddress(destination)
      if (!geoResult) return

      const { lng, lat, address } = geoResult
      const AMap = (window as any).AMap

      map.setZoomAndCenter(10, [lng, lat])

      if (marker) {
        map.remove(marker)
      }

      const newMarker = new AMap.Marker({
        position: [lng, lat],
        title: destination,
        animation: 'AMAP_ANIMATION_DROP',
        offset: new AMap.Pixel(-13, -30)
      })

      map.add(newMarker)
      setMarker(newMarker)

      const infoWindow = new AMap.InfoWindow({
        content: `
          <div style="padding: 12px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${destination}</h3>
            <p style="margin: 0; font-size: 14px; color: #666;">${address}</p>
          </div>
        `,
        offset: new AMap.Pixel(0, -30),
        closeWhenClickMap: true
      })

      newMarker.on('click', () => infoWindow.open(map, newMarker.getPosition()))
      setTimeout(() => infoWindow.open(map, newMarker.getPosition()), 600)
    }

    updateMapLocation()
  }, [map, isMapLoaded, destination])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" style={{ minHeight: '400px' }} />
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
