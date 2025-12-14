"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { TrendingUp, ArrowRight, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MarketRateItem {
  crop: string
  location: string
  price: string
  change: string
  changeType: "positive" | "negative"
}

interface MarketRatesPreviewProps {
  rates: MarketRateItem[]
  delay?: number
}

export function MarketRatesPreview({ rates, delay = 0.5 }: MarketRatesPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Live Market Rates
          </CardTitle>
          <CardDescription>
            Real-time prices from nearby mandis
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="space-y-4 flex-1">
            {rates.map((rate, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-semibold">{rate.crop}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {rate.location}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{rate.price}</p>
                  <Badge
                    variant={rate.changeType === "positive" ? "default" : "destructive"}
                    className={`text-xs ${rate.changeType === "positive"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                  >
                    {rate.change}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-6 group" asChild>
            <Link href="/market-rates" className="flex items-center justify-center gap-2">
              View All Market Rates
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
