/**
 * Geolocation Service
 * 
 * Provides clean interface for getting user's current geographic location
 * using the browser's Geolocation API.
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
}

const DEFAULT_LOCATION: LocationCoordinates = {
  latitude: 28.6139, // Delhi, India
  longitude: 77.2090
}

/**
 * Get the user's current location using the browser Geolocation API
 * 
 * @ returns Promise resolving to GeolocationResult
 */
export async function getCurrentLocation(): Promise<GeolocationResult> {
  const timestamp = Date.now()

  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      success: false,
      coordinates: DEFAULT_LOCATION,
      error: 'Not in browser environment',
      timestamp
    }
  }

  // Check if geolocation is supported
  if (!('geolocation' in navigator)) {
    return {
      success: false,
      coordinates: DEFAULT_LOCATION,
      error: 'Geolocation not supported by browser',
      timestamp
    }
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          success: true,
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          timestamp
        })
      },
      (error) => {
        let errorMessage = 'Unable to get location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }

        resolve({
          success: false,
          coordinates: DEFAULT_LOCATION,
          error: errorMessage,
          timestamp
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 // Don't use cached position
      }
    )
  })
}
