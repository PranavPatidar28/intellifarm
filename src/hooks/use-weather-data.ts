/**
 * useWeatherData Hook
 * 
 * Unified weather hook that combines location and weather fetching.
 * Provides clean API with proper refresh logic.
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from './use-location'
import { weatherApi, ProcessedWeatherData } from '@/lib/weather-api'

interface UseWeatherDataOptions {
  autoRefreshInterval?: number // in milliseconds, default 5 minutes
  enabled?: boolean // whether to auto-fetch, default true
}

interface UseWeatherDataReturn {
  weatherData: ProcessedWeatherData | null
  location: { lat: number; lon: number } | null
  loading: boolean
  locationLoading: boolean
  error: string | null
  locationError: string | null
  lastUpdated: Date | null
  refresh: () => Promise<void>
  refreshLocation: () => Promise<void>
}

export function useWeatherData(options: UseWeatherDataOptions = {}): UseWeatherDataReturn {
  const {
    autoRefreshInterval = 5 * 60 * 1000, // 5 minutes
    enabled = true
  } = options

  // Get location using the location hook
  const {
    coordinates,
    loading: locationLoading,
    error: locationError,
    refreshLocation
  } = useLocation()

  // Weather state
  const [weatherData, setWeatherData] = useState<ProcessedWeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Ref to track if we've fetched for current coordinates
  const lastFetchedCoords = useRef<string | null>(null)

  // Fetch weather data
  const fetchWeather = useCallback(async () => {
    if (!coordinates || !enabled) return

    const coordsKey = `${coordinates.latitude},${coordinates.longitude}`

    setLoading(true)
    setError(null)

    try {
      console.log('🌤️ Fetching weather data for:', coordinates)
      const data = await weatherApi.getWeatherData(
        coordinates.latitude,
        coordinates.longitude
      )

      if (data) {
        setWeatherData(data)
        setLastUpdated(new Date())
        lastFetchedCoords.current = coordsKey
        console.log('✅ Weather data updated successfully:', data.location?.name)
      } else {
        setError('Failed to fetch weather data')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('❌ Weather fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [coordinates, enabled])

  // Fetch weather when coordinates change
  useEffect(() => {
    if (!coordinates || !enabled) {
      console.log('⏸️ Skipping weather fetch - coordinates:', coordinates, 'enabled:', enabled)
      return
    }

    const coordsKey = `${coordinates.latitude},${coordinates.longitude}`
    console.log('📍 Coordinates available:', coordsKey, 'Last fetched:', lastFetchedCoords.current)

    // Fetch if coordinates changed (including first time when lastFetchedCoords is null)
    if (lastFetchedCoords.current !== coordsKey) {
      console.log('🌤️ Triggering weather fetch for new coordinates')
      fetchWeather()
    }
  }, [coordinates, enabled, fetchWeather])

  // Auto-refresh interval
  useEffect(() => {
    if (!enabled || !autoRefreshInterval || autoRefreshInterval <= 0) return

    // console.log(`⏰ Setting up weather auto-refresh: ${autoRefreshInterval / 1000}s`)

    const interval = setInterval(() => {
      if (coordinates) {
        // console.log('🔄 Auto-refreshing weather data...')
        fetchWeather()
      }
    }, autoRefreshInterval)

    return () => {
      clearInterval(interval)
      // console.log('⏹️ Cleared weather auto-refresh interval')
    }
  }, [enabled, autoRefreshInterval, coordinates, fetchWeather])

  // Manual refresh function
  const refresh = useCallback(async () => {
    // console.log('🔄 Manual weather refresh triggered')
    await fetchWeather()
  }, [fetchWeather])

  return {
    weatherData,
    location: coordinates ? { lat: coordinates.latitude, lon: coordinates.longitude } : null,
    loading,
    locationLoading,
    error,
    locationError,
    lastUpdated,
    refresh,
    refreshLocation
  }
}
