"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Sprout, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AdvisoryItem {
  title: string
  description: string
  confidence: number
  confidenceColor: string
}

interface RecentAdvisoryProps {
  advisories: AdvisoryItem[]
  delay?: number
}

export function RecentAdvisory({ advisories, delay = 0.4 }: RecentAdvisoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
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
            {advisories.map((advisory, index) => (
              <div key={index} className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{advisory.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {advisory.description}
                  </p>
                </div>
                <Badge variant="secondary" className={advisory.confidenceColor}>
                  {advisory.confidence}% Confidence
                </Badge>
              </div>
            ))}
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
  )
}
