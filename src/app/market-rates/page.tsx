"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Search,
  ArrowLeft,
  MapPin,
  RefreshCw,
  Bell,
  BarChart3,
  Target,
  Download
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "@/components/mobile-nav"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { marketRates } from "@/lib/data"
import Link from "next/link"

export default function MarketRatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMandi, setSelectedMandi] = useState("all")
  const [selectedCrop, setSelectedCrop] = useState("all")
  const [sortBy, setSortBy] = useState("price")
  const [priceAlerts, setPriceAlerts] = useState<string[]>([])

  const filteredRates = useMemo(() => {
    const filtered = marketRates.filter(rate => {
      const matchesSearch = rate.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rate.mandi.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMandi = selectedMandi === "all" || rate.mandi.toLowerCase().includes(selectedMandi.toLowerCase())
      const matchesCrop = selectedCrop === "all" || rate.crop.toLowerCase() === selectedCrop.toLowerCase()
      return matchesSearch && matchesMandi && matchesCrop
    })

    // Sort the results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return b.price - a.price
        case "change":
          return b.change - a.change
        case "crop":
          return a.crop.localeCompare(b.crop)
        case "mandi":
          return a.mandi.localeCompare(b.mandi)
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedMandi, selectedCrop, sortBy])

  const uniqueMandis = useMemo(() => {
    return Array.from(new Set(marketRates.map(rate => rate.mandi)))
  }, [])

  const uniqueCrops = useMemo(() => {
    return Array.from(new Set(marketRates.map(rate => rate.crop)))
  }, [])

  const marketStats = useMemo(() => {
    const totalCrops = uniqueCrops.length
    const totalMandis = uniqueMandis.length
    const risingPrices = marketRates.filter(rate => rate.change > 0).length
    const fallingPrices = marketRates.filter(rate => rate.change < 0).length

    // Calculate average price by crop
    const cropAverages = uniqueCrops.map(crop => {
      const cropRates = marketRates.filter(rate => rate.crop === crop)
      // const avgPrice = cropRates.reduce((sum, rate) => sum + rate.price, 0) / cropRates.length
      const bestMandi = cropRates.reduce((best, rate) => rate.price > best.price ? rate : best)
      return { crop, bestMandi }
    })

    return {
      totalCrops,
      totalMandis,
      risingPrices,
      fallingPrices,
      cropAverages
    }
  }, [uniqueCrops, uniqueMandis])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return TrendingUp
    if (change < 0) return TrendingDown
    return Target
  }

  const togglePriceAlert = (cropId: string) => {
    setPriceAlerts(prev =>
      prev.includes(cropId)
        ? prev.filter(id => id !== cropId)
        : [...prev, cropId]
    )
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
                  <p className="text-muted-foreground">Live crop prices across major mandis</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Market Overview Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rising</p>
                        <p className="text-2xl font-bold text-green-600">
                          {marketStats.risingPrices}
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
                        <p className="text-sm text-muted-foreground">Falling</p>
                        <p className="text-2xl font-bold text-red-600">
                          {marketStats.fallingPrices}
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
                        <p className="text-sm text-muted-foreground">Mandis</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {marketStats.totalMandis}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Crops</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {marketStats.totalCrops}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Search and Filter Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search crops or mandis..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Filter Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Crop</label>
                        <Select
                          value={selectedCrop}
                          onValueChange={setSelectedCrop}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Crop" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Crops</SelectItem>
                            {uniqueCrops.map(crop => (
                              <SelectItem key={crop} value={crop}>
                                {crop}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">Mandi</label>
                        <Select
                          value={selectedMandi}
                          onValueChange={setSelectedMandi}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Mandi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Mandis</SelectItem>
                            {uniqueMandis.map(mandi => (
                              <SelectItem key={mandi} value={mandi}>
                                {mandi}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">Sort By</label>
                        <Select
                          value={sortBy}
                          onValueChange={setSortBy}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="price">Sort by Price</SelectItem>
                            <SelectItem value="change">Sort by Change</SelectItem>
                            <SelectItem value="crop">Sort by Crop</SelectItem>
                            <SelectItem value="mandi">Sort by Mandi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Live Market Rates List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Live Market Rates
                  </CardTitle>
                  <CardDescription>
                    Real-time prices from all mandis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredRates.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No market rates found matching your criteria
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <div className="grid grid-cols-4 gap-4 p-4 bg-muted font-medium text-sm">
                          <div>Crop</div>
                          <div>Mandi</div>
                          <div className="text-right">Price</div>
                          <div className="text-right">Change</div>
                        </div>
                        <div className="divide-y">
                          {filteredRates.map((rate) => (
                            <div key={rate.id} className="grid grid-cols-4 gap-4 p-4 text-sm items-center hover:bg-muted/50 transition-colors">
                              <div className="font-medium">{rate.crop}</div>
                              <div className="text-muted-foreground">{rate.mandi}</div>
                              <div className="text-right font-medium">{formatPrice(rate.price)}</div>
                              <div className={`text-right flex justify-end items-center gap-1 ${getChangeColor(rate.change)}`}>
                                {(() => {
                                  const ChangeIcon = getChangeIcon(rate.change)
                                  return <ChangeIcon className="h-3 w-3" />
                                })()}
                                {rate.change > 0 ? '+' : ''}{rate.change}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>


            {/* Best Prices by Crop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Best Prices by Crop
                  </CardTitle>
                  <CardDescription>
                    Highest prices available for each crop
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {marketStats.cropAverages.map((item, index) => (
                      <motion.div
                        key={item.crop}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{item.crop}</h4>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Best Price
                          </Badge>
                        </div>
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {formatPrice(item.bestMandi.price)}
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {item.bestMandi.mandi}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center gap-1 ${getChangeColor(item.bestMandi.change)}`}>
                            {(() => {
                              const ChangeIcon = getChangeIcon(item.bestMandi.change)
                              return <ChangeIcon className="h-3 w-3" />
                            })()}
                            <span className="text-xs">
                              {item.bestMandi.change > 0 ? '+' : ''}{item.bestMandi.change}%
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Market Insights & Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Market Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Market Insights
                  </CardTitle>
                  <CardDescription>
                    AI-powered analysis of current trends
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
                          <p className="font-medium text-green-800">Wheat prices surging</p>
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

              {/* Price Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Price Alerts
                  </CardTitle>
                  <CardDescription>
                    Get notified when prices change
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {priceAlerts.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No price alerts set</p>
                        <p className="text-sm text-muted-foreground">
                          Click the bell icon on any crop to set alerts
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {priceAlerts.map(alertId => {
                          const rate = marketRates.find(r => r.id === alertId)
                          if (!rate) return null

                          return (
                            <div key={alertId} className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                              <div>
                                <p className="font-medium text-yellow-800">{rate.crop}</p>
                                <p className="text-sm text-yellow-700">{rate.mandi}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-yellow-800">{formatPrice(rate.price)}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => togglePriceAlert(alertId)}
                                  className="text-yellow-600"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
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