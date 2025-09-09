"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LucideIcon } from "lucide-react"
import Link from "next/link"

interface FeaturedCardProps {
  title: string
  description: string
  icon: LucideIcon
  color: string
  href: string
  progress?: number
  badge?: string
  delay?: number
}

export function FeaturedCard({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  href, 
  progress, 
  badge,
  delay = 0 
}: FeaturedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <Link href={href}>
        <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${color} text-white group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6" />
              </div>
              {badge && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {badge}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            {progress !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
