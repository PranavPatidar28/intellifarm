"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Cloud, Droplets, Wind, RefreshCw, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWeatherData } from "@/hooks/use-weather-data"
import { ProcessedWeatherData } from "@/lib/weather-api"
import { useMemo, useCallback } from "react"

interface WeatherCardProps {
  delay?: number
  fallbackData?: ProcessedWeatherData
}

export function WeatherCard({ delay = 0.1, fallbackData }: WeatherCardProps) {
  const { weatherData, loading, error, refresh, lastUpdated, locationError, locationLoading } = useWeatherData()
  // Auto-refresh happens automatically in the hook
  
  // Use real data if available, otherwise fallback to provided data or show error
  const currentWeather = useMemo(() => weatherData?.current || fallbackData?.current, [weatherData?.current, fallbackData?.current])
  const location = useMemo(() => weatherData?.location || fallbackData?.location, [weatherData?.location, fallbackData?.location])
  const hasError = useMemo(() => error || locationError, [error, locationError])
  const isLoading = useMemo(() => (loading || locationLoading) && !currentWeather, [loading, locationLoading, currentWeather])
  
  // Check if we're using mock data (API key not configured)
  const isUsingMockData = useMemo(() => 
    !process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 
    process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY === 'your_openweather_api_key_here',
    []
  )

  const getWeatherColor = useCallback((condition?: string) => {
    if (!condition) return 'from-blue-500 to-blue-600'
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return 'from-yellow-400 to-orange-500'
    if (conditionLower.includes('rainy') || conditionLower.includes('rain')) return 'from-blue-500 to-blue-600'
    if (conditionLower.includes('cloudy') || conditionLower.includes('cloud')) return 'from-gray-400 to-gray-500'
    return 'from-blue-500 to-blue-600'
  }, [])

  const formatLastUpdated = useCallback((date: Date | null) => {
    if (!date) return 'Never updated'
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={`bg-gradient-to-r ${getWeatherColor(currentWeather?.condition)} text-white border-0`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Current Weather
                {isUsingMockData && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded-full ml-2">
                    Demo Data
                  </span>
                )}
              </CardTitle>
              {location && (
                <div className="text-sm text-white/80 mt-1">
                  {location.name}
                  {location.country && `, ${location.country}`}
                  {location.coordinates && isUsingMockData && (
                    <span className="text-xs opacity-75 ml-2">
                      ({location.coordinates.lat.toFixed(1)}, {location.coordinates.lon.toFixed(1)})
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <span className="text-xs text-white/70">
                  {isLoading ? 'Updating...' : formatLastUpdated(lastUpdated)}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={refresh}
                disabled={isLoading}
                className="text-white hover:bg-white/20 p-1 h-8 w-8"
                title="Refresh weather data"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {hasError ? (
            <div className="flex items-center gap-3 text-white/90">
              <AlertCircle className="h-5 w-5 text-yellow-300" />
              <div>
                <div className="font-medium">Weather data unavailable</div>
                <div className="text-sm text-white/70">
                  {error?.includes('API key') ? (
                    <div>
                      <div>API key not configured</div>
                      <div className="text-xs mt-1">
                        Check console for setup instructions
                      </div>
                    </div>
                  ) : (
                    locationError || error || 'Unable to fetch weather data'
                  )}
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex items-center gap-3 text-white/90">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <div>Loading weather data...</div>
            </div>
          ) : currentWeather ? (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-3xl font-bold">
                    {currentWeather.temperature}°C
                  </div>
                  <div className="text-white/90 capitalize">
                    {currentWeather.condition}
                  </div>
                  {currentWeather.feelsLike && (
                    <div className="text-sm text-white/70">
                      Feels like {currentWeather.feelsLike}°C
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-4 w-4" />
                    {currentWeather.humidity}%
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind className="h-4 w-4" />
                    {currentWeather.windSpeed} km/h
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                {isUsingMockData && (
                  <div className="mb-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="text-xs text-yellow-200">
                      <strong>Demo Mode:</strong> Add your OpenWeather API key to get real weather data
                    </div>
                    <div className="text-xs text-yellow-300/80 mt-1">
                      Create <code className="bg-yellow-500/20 px-1 rounded">.env.local</code> with <code className="bg-yellow-500/20 px-1 rounded">NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key</code>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                    asChild
                  >
                    <Link href="/weather">7-Day Forecast</Link>
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                    asChild
                  >
                    <Link href="/crop-advisory">Weather Advisory</Link>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-white/90">No weather data available</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
