"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  ArrowLeft,
  MapPin,
  Clock,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "@/components/mobile-nav"
import { marketRates } from "@/lib/data"
import Link from "next/link"

export default function MarketRatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMandi, setSelectedMandi] = useState("all")

  const filteredRates = useMemo(() => {
    return marketRates.filter(rate => {
      const matchesSearch = rate.crop.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMandi = selectedMandi === "all" || rate.mandi.toLowerCase().includes(selectedMandi.toLowerCase())
      return matchesSearch && matchesMandi
    })
  }, [searchTerm, selectedMandi])

  const uniqueMandis = useMemo(() => {
    return Array.from(new Set(marketRates.map(rate => rate.mandi)))
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? TrendingUp : TrendingDown
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
                  <h1 className="text-3xl font-bold">Market Rates</h1>
                  <p className="text-muted-foreground">Current crop prices in nearby mandis</p>
                </div>
              </div>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search crops..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={selectedMandi}
                        onChange={(e) => setSelectedMandi(e.target.value)}
                        className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="all">All Mandis</option>
                        {uniqueMandis.map(mandi => (
                          <option key={mandi} value={mandi}>
                            {mandi}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Market Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rising Prices</p>
                        <p className="text-2xl font-bold text-green-600">
                          {marketRates.filter(rate => rate.change > 0).length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-100">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Falling Prices</p>
                        <p className="text-2xl font-bold text-red-600">
                          {marketRates.filter(rate => rate.change < 0).length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Active Mandis</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {uniqueMandis.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Market Rates List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Current Market Rates
                  </CardTitle>
                  <CardDescription>
                    Live prices updated every hour
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredRates.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No crops found matching your search</p>
                      </div>
                    ) : (
                      filteredRates.map((rate, index) => {
                        const ChangeIcon = getChangeIcon(rate.change)
                        return (
                          <motion.div
                            key={rate.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                          >
                            <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-primary/10">
                                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-primary">
                                      {rate.crop.charAt(0)}
                                    </span>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold">{rate.crop}</h4>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    {rate.mandi}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-lg font-bold">
                                  {formatPrice(rate.price)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {rate.unit}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <div className={`flex items-center gap-1 ${getChangeColor(rate.change)}`}>
                                  <ChangeIcon className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    {rate.change > 0 ? '+' : ''}{rate.change}%
                                  </span>
                                </div>
                              </div>
                              
                              <div className="text-right text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {rate.lastUpdated}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Market Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Market Insights</CardTitle>
                  <CardDescription>
                    AI-powered analysis of current market trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-green-100 mt-1">
                          <div className="h-2 w-2 rounded-full bg-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-800">Wheat prices rising</p>
                          <p className="text-sm text-green-700">
                            Strong demand and lower supply are driving wheat prices up by 2.5%. 
                            Consider selling if you have stored wheat.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-blue-100 mt-1">
                          <div className="h-2 w-2 rounded-full bg-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-blue-800">Rice market stable</p>
                          <p className="text-sm text-blue-700">
                            Rice prices remain stable with slight fluctuations. 
                            Good time for both buying and selling.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-orange-100 mt-1">
                          <div className="h-2 w-2 rounded-full bg-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-orange-800">Cotton prices declining</p>
                          <p className="text-sm text-orange-700">
                            Cotton prices down by 2.1% due to increased imports. 
                            Consider waiting for better prices.
                          </p>
                        </div>
                      </div>
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
