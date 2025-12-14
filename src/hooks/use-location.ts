/**
 * useLocation Hook
 * 
 * React hook for managing user location with caching support.
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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

  // Track if we've already tried to get location to prevent multiple calls
  const hasFetched = useRef(false)

  const fetchLocation = useCallback(async (useCache = true) => {
    setLoading(true)
    setError(null)

    // Try to use cached location first (only if it's a real location, not default)
    if (useCache) {
      const cached = getCachedLocation()
      if (cached) {
        // Verify it's not the default Delhi location (which shouldn't be cached)
        const isDefaultLocation =
          Math.abs(cached.latitude - 28.6139) < 0.01 &&
          Math.abs(cached.longitude - 77.209) < 0.01

        if (!isDefaultLocation) {
          console.log('📍 Using cached location:', cached)
          setCoordinates(cached)
          setLoading(false)
          return
        } else {
          // Clear stale default cache
          console.log('🗑️ Clearing stale default location cache')
          clearLocationCache()
        }
      }
    }

    // Fetch fresh location
    console.log('📍 Fetching current location...')
    const result = await getCurrentLocation()

    console.log('📍 Location result:', result)

    if (result.success && result.coordinates) {
      console.log('✅ Location fetched successfully:', result.coordinates, 'Source:', result.source)
      setCoordinates(result.coordinates)
      // Only cache if it's from browser or IP, not the default
      if (result.source !== 'default') {
        cacheLocation(result.coordinates)
      }
      setError(null)
    } else {
      console.warn('⚠️ Location fetch failed:', result.error)
      setError(result.error || 'Failed to get location')
      // Set default coordinates but DON'T cache them
      if (result.coordinates) {
        setCoordinates(result.coordinates)
        // Do NOT cache default location
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
