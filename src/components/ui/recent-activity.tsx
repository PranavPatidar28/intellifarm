"use client"

import { motion } from "framer-motion"
import { Clock, Sprout, Cloud, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ActivityItem {
  id: string
  title: string
  time: string
  icon: "sprout" | "cloud" | "trending"
  type: "completed" | "alert" | "updated"
  bgColor: string
  iconBgColor: string
  iconColor: string
  badgeColor: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
  delay?: number
}

const iconMap = {
  sprout: Sprout,
  cloud: Cloud,
  trending: TrendingUp
}

export function RecentActivity({ activities, delay = 0.7 }: RecentActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
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
            {activities.map((activity) => {
              const Icon = iconMap[activity.icon]
              return (
                <div key={activity.id} className={`flex items-center gap-3 p-3 rounded-lg ${activity.bgColor}`}>
                  <div className={`p-2 rounded-full ${activity.iconBgColor}`}>
                    <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant="secondary" className={activity.badgeColor}>
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
