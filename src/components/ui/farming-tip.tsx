"use client"

import { motion } from "framer-motion"
import { Lightbulb, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface FarmingTipProps {
  title?: string
  content: string
  delay?: number
}

export function FarmingTip({ 
  title = "Today's Farming Tip", 
  content, 
  delay = 0.6 
}: FarmingTipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 dark:from-yellow-950 dark:to-orange-950 dark:border-yellow-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">{title}</h4>
                <Clock className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {content}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
