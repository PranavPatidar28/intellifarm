"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"
import {
  Sprout,
  Shield,
  TrendingUp,
  Calculator
} from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { FeaturedCard } from "@/components/featured-card"
import { NotificationContainer } from "@/components/notification"
import { useNotifications } from "@/hooks/use-notifications"
import { quickActions, weatherData, marketRates, cropAdvisoryData } from "@/lib/data"
import { WelcomeSection } from "@/components/ui/welcome-section"
import { WeatherCard } from "@/components/ui/weather-card"
import { RecentAdvisory } from "@/components/ui/recent-advisory"
import { MarketRatesPreview } from "@/components/ui/market-rates-preview"
import { FarmingTip } from "@/components/ui/farming-tip"
import { RecentActivity } from "@/components/ui/recent-activity"
import { FloatingChatbotButton } from "@/components/ui/floating-chatbot-button"
import { getCurrentLocation } from "@/lib/services/geolocation.service"

const iconMap = {
  Sprout,
  Shield,
  TrendingUp,
  Calculator
}

const mockAdvisory = [
  {
    title: "Wheat Sowing",
    description: "Optimal sowing time is now. Use certified seeds and maintain proper spacing.",
    confidence: 92,
    confidenceColor: "bg-green-100 text-green-800"
  },
  {
    title: "Rice Transplanting",
    description: "Prepare nursery beds for transplanting in next 2 weeks.",
    confidence: 88,
    confidenceColor: "bg-blue-100 text-blue-800"
  }
]

export default function Home() {
  const { notifications, addNotification } = useNotifications()

  // Show welcome notification on first visit
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem('intellifarm-visited')
      if (!hasVisited) {
        setTimeout(() => {
          addNotification({
            title: "Welcome to Intellifarm! 🌱",
            description: "Your smart farming companion is ready to help you make better crop decisions.",
            type: "success",
            duration: 6000
          })
          localStorage.setItem('intellifarm-visited', 'true')
        }, 1000)
      }
    }
  }, [addNotification])

  useEffect(() => {
    getCurrentLocation().then((result) => {
      if (result.success && result.coordinates) {
        // console.log("Location obtained:", result.coordinates)
        // You can add additional logic here to use the location data
      } else {
        // console.log("Location access denied or not available:", result.error)
        // Using default location fallback
      }
    }).catch((error) => {
      console.error("Failed to get location:", error)
    })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <MobileNav />
      <NotificationContainer notifications={notifications} />

      {/* Main Content */}
      <main className="md:ml-64">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Welcome Section */}
          <WelcomeSection />

          {/* Current Weather Card */}
          <WeatherCard />

          {/* Quick Actions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {quickActions.map((action, index) => {
              const Icon = iconMap[action.icon as keyof typeof iconMap]
              return (
                <FeaturedCard
                  key={action.id}
                  title={action.title}
                  description={action.description}
                  icon={Icon}
                  color={action.color}
                  href={action.href}
                  gradient={action.gradient}
                  progress={index === 0 ? 75 : index === 1 ? 60 : undefined}
                  badge={index === 0 ? "" : undefined}
                  delay={0.3 + index * 0.1}
                />
              )
            })}
          </motion.div>

          {/* Recent Advisory */}
          <RecentAdvisory
            advisories={mockAdvisory}
          />

          {/* Market Rates Preview */}
          <MarketRatesPreview
            rates={[
              {
                crop: "Wheat",
                location: "Delhi Mandi",
                price: "₹2,450",
                change: "+2.5%",
                changeType: "positive"
              },
              {
                crop: "Rice",
                location: "Punjab Mandi",
                price: "₹3,200",
                change: "-1.2%",
                changeType: "negative"
              }
            ]}
          />

          {/* Today's Farming Tip */}
          <FarmingTip
            content="For optimal wheat growth, ensure soil temperature is between 20-25°C during sowing. Check soil moisture levels before planting and maintain proper spacing of 20-25 cm between rows."
          />

          {/* Recent Activity */}
          <RecentActivity
            activities={[
              {
                id: "1",
                title: "Wheat sowing completed",
                time: "2 hours ago",
                icon: "sprout",
                type: "completed",
                bgColor: "bg-green-50 dark:bg-green-950",
                iconBgColor: "bg-green-100 dark:bg-green-900",
                iconColor: "text-green-600 dark:text-green-400",
                badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              },
              {
                id: "2",
                title: "Weather alert received",
                time: "4 hours ago",
                icon: "cloud",
                type: "alert",
                bgColor: "bg-blue-50 dark:bg-blue-950",
                iconBgColor: "bg-blue-100 dark:bg-blue-900",
                iconColor: "text-blue-600 dark:text-blue-400",
                badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              },
              {
                id: "3",
                title: "Market price updated",
                time: "6 hours ago",
                icon: "trending",
                type: "updated",
                bgColor: "bg-orange-50 dark:bg-orange-950",
                iconBgColor: "bg-orange-100 dark:bg-orange-900",
                iconColor: "text-orange-600 dark:text-orange-400",
                badgeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
              }
            ]}
          />
        </div>
      </main>

      {/* Floating Chatbot Button */}
      <FloatingChatbotButton />

    </div>
  )
}