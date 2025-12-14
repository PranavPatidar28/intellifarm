/**
 * Geolocation Service
 * 
 * Provides clean interface for getting user's current geographic location
 * using the browser's Geolocation API with IP-based fallback.
 */

export interface LocationCoordinates {
  latitude: number
  longitude: number
}

export interface GeolocationResult {
  success: boolean
  coordinates?: LocationCoordinates
  error?: string
  timestamp: number
  source?: 'browser' | 'ip' | 'default'
}

const DEFAULT_LOCATION: LocationCoordinates = {
  latitude: 28.6139, // Delhi, India
  longitude: 77.2090
}

/**
 * Get location from IP address using a free IP geolocation API
 */
async function getLocationFromIP(): Promise<LocationCoordinates | null> {
  try {
    // Use ip-api.com (free, no API key needed, supports CORS)
    const response = await fetch('http://ip-api.com/json/?fields=status,lat,lon', {
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    if (data.status === 'success' && data.lat && data.lon) {
      console.log('📍 Got location from IP:', data.lat, data.lon)
      return {
        latitude: data.lat,
        longitude: data.lon
      }
    }

    return null
  } catch (error) {
    console.warn('IP geolocation failed:', error)
    return null
  }
}

/**
 * Try browser geolocation with specified options
 */
function tryBrowserGeolocation(options: PositionOptions): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      () => resolve(null),
      options
    )
  })
}

/**
 * Get the user's current location using the browser Geolocation API
 * with multi-stage fallback:
 * 1. Try low-accuracy browser geolocation (fast)
 * 2. Try high-accuracy browser geolocation (slower but more precise)
 * 3. Fall back to IP-based geolocation
 * 4. Use default location as last resort
 * 
 * @returns Promise resolving to GeolocationResult
 */
export async function getCurrentLocation(): Promise<GeolocationResult> {
  const timestamp = Date.now()

  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      success: false,
      coordinates: DEFAULT_LOCATION,
      error: 'Not in browser environment',
      source: 'default',
      timestamp
    }
  }

  // Check if geolocation is supported
  if (!('geolocation' in navigator)) {
    // Try IP-based fallback
    const ipLocation = await getLocationFromIP()
    if (ipLocation) {
      return {
        success: true,
        coordinates: ipLocation,
        source: 'ip',
        timestamp
      }
    }

    return {
      success: false,
      coordinates: DEFAULT_LOCATION,
      error: 'Geolocation not supported by browser',
      source: 'default',
      timestamp
    }
  }

  // Stage 1: Try low-accuracy first (usually faster)
  console.log('📍 Trying low-accuracy geolocation...')
  const lowAccuracyResult = await tryBrowserGeolocation({
    enableHighAccuracy: false,
    timeout: 5000, // 5 second timeout
    maximumAge: 60000 // Accept cached position up to 1 minute old
  })

  if (lowAccuracyResult) {
    console.log('✅ Got location (low accuracy):', lowAccuracyResult.coords.latitude, lowAccuracyResult.coords.longitude)
    return {
      success: true,
      coordinates: {
        latitude: lowAccuracyResult.coords.latitude,
        longitude: lowAccuracyResult.coords.longitude
      },
      source: 'browser',
      timestamp
    }
  }

  // Stage 2: Try high-accuracy (may take longer)
  console.log('📍 Trying high-accuracy geolocation...')
  const highAccuracyResult = await tryBrowserGeolocation({
    enableHighAccuracy: true,
    timeout: 15000, // 15 second timeout for high accuracy
    maximumAge: 0 // Fresh position for high accuracy
  })

  if (highAccuracyResult) {
    console.log('✅ Got location (high accuracy):', highAccuracyResult.coords.latitude, highAccuracyResult.coords.longitude)
    return {
      success: true,
      coordinates: {
        latitude: highAccuracyResult.coords.latitude,
        longitude: highAccuracyResult.coords.longitude
      },
      source: 'browser',
      timestamp
    }
  }

  // Stage 3: Fall back to IP-based geolocation
  console.log('📍 Browser geolocation failed, trying IP-based...')
  const ipLocation = await getLocationFromIP()
  if (ipLocation) {
    return {
      success: true,
      coordinates: ipLocation,
      source: 'ip',
      timestamp
    }
  }

  // Stage 4: All methods failed, use default
  console.warn('⚠️ All geolocation methods failed, using default location')
  return {
    success: false,
    coordinates: DEFAULT_LOCATION,
    error: 'Unable to determine location. Using default.',
    source: 'default',
    timestamp
  }
}
