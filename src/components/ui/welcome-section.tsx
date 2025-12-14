"use client"

import { motion } from "framer-motion"
import { MapPin, Calendar, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { getCurrentLocation } from "@/lib/services/geolocation.service"

interface WelcomeSectionProps {
  defaultLocation?: string
  season?: string
}

export function WelcomeSection({ 
  defaultLocation = "Bhopal, Madhya Pradesh", 
  season = "Rabi Season" 
}: WelcomeSectionProps) {
  const [location, setLocation] = useState<string>(defaultLocation)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user's current location when component mounts
    getCurrentLocation().then(result => {
      setIsLoading(false)
      if (result.success && result.coordinates) {
        // If we have location data, try to reverse geocode it to get a place name
        // For now, just show coordinates until we implement reverse geocoding
        // Format coordinates for display
        setLocation(`${result.coordinates.latitude.toFixed(2)}, ${result.coordinates.longitude.toFixed(2)}`)
        setLocationError(null)
      } else {
        // Keep using default location if there was an error
        setLocationError(result.error || "Unable to get location")
      }
    }).catch(error => {
      setIsLoading(false)
      setLocationError("Error getting location")
      console.error("Location error:", error)
    })
  }, [defaultLocation])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome to Intellifarm
        </h1>
      </div>
      <p className="text-muted-foreground text-lg">
        Your smart farming companion for better crop decisions
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{season}</span>
        </div>
      </div>
    </motion.div>
  )
}
