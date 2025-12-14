/**
 * Location Cache Service
 * 
 * Manages caching of location data in localStorage with automatic expiry.
 */

import { LocationCoordinates } from './geolocation.service'

const CACHE_KEY = 'intellifarm_location_cache'
const CACHE_DURATION_MS = 30 * 60 * 1000 // 30 minutes

interface CachedLocationData {
  coordinates: LocationCoordinates
  timestamp: number
  expiry: number
}

/**
 * Save location coordinates to cache
 */
export function cacheLocation(coordinates: LocationCoordinates): void {
  if (typeof window === 'undefined') return

  try {
    const data: CachedLocationData = {
      coordinates,
      timestamp: Date.now(),
      expiry: Date.now() + CACHE_DURATION_MS
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch (error) {
    // Silent fail - caching is not critical
    console.warn('Failed to cache location:', error)
  }
}

/**
 * Get cached location if available and not expired
 * 
 * @ returns Cached coordinates or null if not available/expired
 */
export function getCachedLocation(): LocationCoordinates | null {
  if (typeof window === 'undefined') return null

  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const data: CachedLocationData = JSON.parse(cached)

    // Check if expired
    if (Date.now() > data.expiry) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }

    return data.coordinates
  } catch (error) {
    // Invalid cache data, clear it
    localStorage.removeItem(CACHE_KEY)
    return null
  }
}

/**
 * Clear the location cache
 */
export function clearLocationCache(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(CACHE_KEY)
  } catch (error) {
    console.warn('Failed to clear location cache:', error)
  }
}

/**
 * Check if we have a valid cached location
 */
export function hasCachedLocation(): boolean {
  return getCachedLocation() !== null
}
