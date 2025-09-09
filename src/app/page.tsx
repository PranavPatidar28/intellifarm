"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect } from "react"
import { 
  Sprout, 
  Cloud, 
  TrendingUp, 
  MessageCircle,
  Sun,
  Droplets,
  Wind,
  Thermometer,
  BarChart3,
  Users,
  MapPin,
  Calendar,
  ArrowRight,
  Star,
  Lightbulb,
  Clock,
  Shield
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "@/components/mobile-nav"
import { FeaturedCard } from "@/components/featured-card"
import { NotificationContainer } from "@/components/notification"
import { useNotifications } from "@/hooks/use-notifications"
import { quickActions, weatherData } from "@/lib/data"

const iconMap = {
  Sprout,
  Shield,
  TrendingUp,
  MessageCircle
}

export default function Home() {
  const { notifications, addNotification } = useNotifications()

  // Show welcome notification on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('farmerai-visited')
    if (!hasVisited) {
      setTimeout(() => {
        addNotification({
          title: "Welcome to FarmerAI! 🌱",
          description: "Your smart farming companion is ready to help you make better crop decisions.",
          type: "success",
          duration: 6000
        })
        localStorage.setItem('farmerai-visited', 'true')
      }, 1000)
    }
  }, [addNotification])

  return (
    <div className="min-h-screen bg-background">
      <MobileNav />
      <NotificationContainer notifications={notifications} />
      
      {/* Main Content */}
      <main className="md:ml-64">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-foreground">
                Welcome to FarmerAI
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Your smart farming companion for better crop decisions
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Location: Bhopal, Madhya Pradesh</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Rabi Season</span>
              </div>
            </div>
          </motion.div>

          

          {/* Current Weather Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Current Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">
                      {weatherData.current.temperature}°C
                    </div>
                    <div className="text-blue-100">
                      {weatherData.current.condition}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Droplets className="h-4 w-4" />
                      {weatherData.current.humidity}%
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="h-4 w-4" />
                      {weatherData.current.windSpeed} km/h
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
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
              </CardContent>
            </Card>
          </motion.div>

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
                  progress={index === 0 ? 75 : index === 1 ? 60 : undefined}
                  badge={index === 0 ? "" : undefined}
                  delay={0.3 + index * 0.1}
                />
              )
            })}
          </motion.div>

          {/* Recent Advisory */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5" />
                  Recent Crop Advisory
                </CardTitle>
                <CardDescription>
                  Latest recommendations for your crops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">Wheat Sowing</h4>
                      <p className="text-sm text-muted-foreground">
                        Optimal sowing time is now. Use certified seeds and maintain proper spacing.
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      92% Confidence
                    </Badge>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">Rice Transplanting</h4>
                      <p className="text-sm text-muted-foreground">
                        Prepare nursery beds for transplanting in next 2 weeks.
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      88% Confidence
                    </Badge>
                  </div>
                </div>
                <Button className="w-full mt-4 group" asChild>
                  <Link href="/crop-advisory" className="flex items-center justify-center gap-2">
                    View All Advisory
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Market Rates Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Market Rates
                </CardTitle>
                <CardDescription>
                  Current prices in nearby mandis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Wheat</p>
                      <p className="text-sm text-muted-foreground">Delhi Mandi</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹2,450</p>
                      <p className="text-sm text-green-600">+2.5%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rice</p>
                      <p className="text-sm text-muted-foreground">Punjab Mandi</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹3,200</p>
                      <p className="text-sm text-red-600">-1.2%</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 group" asChild>
                  <Link href="/market-rates" className="flex items-center justify-center gap-2">
                    View All Rates
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Today's Farming Tip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 dark:from-yellow-950 dark:to-orange-950 dark:border-yellow-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900">
                    <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Today's Farming Tip</h4>
                      <Clock className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      For optimal wheat growth, ensure soil temperature is between 20-25°C during sowing. 
                      Check soil moisture levels before planting and maintain proper spacing of 20-25 cm between rows.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest farming activities and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                      <Sprout className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Wheat sowing completed</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Completed
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                      <Cloud className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Weather alert received</p>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Alert
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                    <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900">
                      <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Market price updated</p>
                      <p className="text-xs text-muted-foreground">6 hours ago</p>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      Updated
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Floating Chatbot Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
          asChild
        >
          <Link href="/chatbot">
            <MessageCircle className="h-6 w-6" />
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}