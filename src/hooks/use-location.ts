/**
 * useLocation Hook
 * 
 * React hook for managing user location with caching support.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCurrentLocation, LocationCoordinates } from '@/lib/services/geolocation.service'
import { cacheLocation, getCachedLocation, clearLocationCache } from '@/lib/services/location-cache.service'

interface UseLocationReturn {
  coordinates: LocationCoordinates | null
  loading: boolean
  error: string | null
  refreshLocation: () => Promise<void>
}

export function useLocation(): UseLocationReturn {
  const [coordinates, setCoordinates] = useState<LocationCoordinates | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLocation = useCallback(async (useCache = true) => {
    setLoading(true)
    setError(null)

    // Try to use cached location first
    if (useCache) {
      const cached = getCachedLocation()
      if (cached) {
        // console.log('📍 Using cached location:', cached)
        setCoordinates(cached)
        setLoading(false)
        return
      }
    }

    // Fetch fresh location
    // console.log('📍 Fetching current location...')
    const result = await getCurrentLocation()

    if (result.success && result.coordinates) {
      // console.log('✅ Location fetched successfully:', result.coordinates)
      setCoordinates(result.coordinates)
      cacheLocation(result.coordinates)
      setError(null)
    } else {
      // console.warn('⚠️ Location fetch failed:', result.error)
      setError(result.error || 'Failed to get location')
      // Still set coordinates to default fallback
      if (result.coordinates) {
        setCoordinates(result.coordinates)
        cacheLocation(result.coordinates)
      }
    }

    setLoading(false)
  }, [])

  // Refresh location (clears cache and fetches fresh)
  const refreshLocation = useCallback(async () => {
    // console.log('🔄 Refreshing location...')
    clearLocationCache()
    await fetchLocation(false)
  }, [fetchLocation])

  // Initial fetch on mount
  useEffect(() => {
    fetchLocation(true)
  }, [fetchLocation])

  return {
    coordinates,
    loading,
    error,
    refreshLocation
  }
}
