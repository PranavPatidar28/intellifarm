"use client"

import { motion } from "framer-motion"
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Droplets, 
  Wind, 
  Thermometer,
  Eye,
  ArrowLeft,
  RefreshCw,
  Sunrise,
  Sunset,
  Gauge,
  AlertTriangle,
  Calendar
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "@/components/mobile-nav"
import { weatherData } from "@/lib/data"
import Link from "next/link"

const weatherIcons = {
  "sunny": Sun,
  "partly-cloudy": Cloud,
  "cloudy": Cloud,
  "rainy": CloudRain
}

export default function WeatherPage() {
  const current = weatherData.current
  const forecast = weatherData.forecast

  const getWeatherIcon = (condition: string) => {
    const iconKey = condition.toLowerCase().replace(/\s+/g, '-')
    const Icon = weatherIcons[iconKey as keyof typeof weatherIcons] || Cloud
    return Icon
  }

  const getWeatherColor = (condition: string) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes('sunny')) return 'from-yellow-400 to-orange-500'
    if (conditionLower.includes('rainy')) return 'from-blue-500 to-blue-600'
    if (conditionLower.includes('cloudy')) return 'from-gray-400 to-gray-500'
    return 'from-blue-400 to-blue-500'
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileNav />
      <main className="md:ml-64">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">Weather Forecast</h1>
                  <p className="text-muted-foreground">Current and 7-day weather forecast</p>
                </div>
              </div>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {/* Weather Alerts - Moved to top */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                    <AlertTriangle className="h-5 w-5" />
                    Weather Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-orange-700 dark:text-orange-300 font-medium">
                      Heavy rainfall expected on Wednesday
                    </p>
                    <p className="text-orange-600 dark:text-orange-400 text-sm">
                      Prepare for potential flooding in low-lying areas. Consider delaying outdoor farming activities.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Current Weather */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className={`bg-gradient-to-r ${getWeatherColor(current.condition)} text-white border-0 overflow-hidden`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Current Weather</CardTitle>
                    <div className="p-2 bg-white/20 rounded-lg">
                      {(() => {
                        const Icon = getWeatherIcon(current.condition)
                        return <Icon className="h-8 w-8" />
                      })()}
                    </div>
                  </div>
                  <CardDescription className="text-white/80">
                    Last updated 2 minutes ago
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center md:text-left">
                      <div className="text-6xl font-bold mb-2">
                        {current.temperature}°
                      </div>
                      <div className="text-xl text-white/90">
                        {current.condition}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Droplets className="h-5 w-5" />
                        <div>
                          <div className="text-sm text-white/80">Humidity</div>
                          <div className="text-lg font-semibold">{current.humidity}%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Wind className="h-5 w-5" />
                        <div>
                          <div className="text-sm text-white/80">Wind Speed</div>
                          <div className="text-lg font-semibold">{current.windSpeed} km/h</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5" />
                        <div>
                          <div className="text-sm text-white/80">Visibility</div>
                          <div className="text-lg font-semibold">10 km</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Thermometer className="h-5 w-5" />
                        <div>
                          <div className="text-sm text-white/80">Feels Like</div>
                          <div className="text-lg font-semibold">{current.temperature + 2}°</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            
            {/* Farming Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    Farming Tips
                  </CardTitle>
                  <CardDescription>
                    Weather-based recommendations for your crops
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-green-100 mt-1">
                        <div className="h-2 w-2 rounded-full bg-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Good for irrigation</p>
                        <p className="text-xs text-muted-foreground">
                          Current humidity levels are optimal for watering your crops
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-yellow-100 mt-1">
                        <div className="h-2 w-2 rounded-full bg-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Monitor for pests</p>
                        <p className="text-xs text-muted-foreground">
                          Warm and humid conditions may increase pest activity
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-blue-100 mt-1">
                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Prepare for rain</p>
                        <p className="text-xs text-muted-foreground">
                          Cover sensitive crops before Wednesday's expected rainfall
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 7-Day Forecast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    7-Day Forecast
                  </CardTitle>
                  <CardDescription>
                    Extended weather forecast for your area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {forecast.map((day, index) => {
                      const Icon = getWeatherIcon(day.condition)
                      return (
                        <motion.div
                          key={day.date}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="text-center min-w-[60px]">
                                <div className="text-sm font-medium">{day.day}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                              </div>
                              
                              <div className="p-2 rounded-lg bg-muted">
                                <Icon className="h-6 w-6" />
                              </div>
                              
                              <div>
                                <div className="font-medium">{day.condition}</div>
                                <div className="text-sm text-muted-foreground">
                                  {day.precipitation}% chance of rain
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-lg font-semibold">
                                  {day.high}°
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {day.low}°
                                </div>
                              </div>
                              
                              {day.precipitation > 50 && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  <Droplets className="h-3 w-3 mr-1" />
                                  Rain
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            

            {/* Additional Weather Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sunrise className="h-5 w-5" />
                    Sun Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Sunrise</span>
                      <span className="font-medium">6:45 AM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Sunset</span>
                      <span className="font-medium">6:15 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Day Length</span>
                      <span className="font-medium">11h 30m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    Pressure & UV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pressure</span>
                      <span className="font-medium">1013 hPa</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">UV Index</span>
                      <span className="font-medium">6 (High)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Dew Point</span>
                      <span className="font-medium">18°C</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
