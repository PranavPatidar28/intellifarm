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
  RefreshCw,
  Bell,
  Star,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  Eye,
  Calendar,
  Download
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MobileNav } from "@/components/mobile-nav"
import { marketRates } from "@/lib/data"
import Link from "next/link"

export default function MarketRatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMandi, setSelectedMandi] = useState("all")
  const [selectedCrop, setSelectedCrop] = useState("all")
  const [sortBy, setSortBy] = useState("price")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [priceAlerts, setPriceAlerts] = useState<string[]>([])

  const filteredRates = useMemo(() => {
    let filtered = marketRates.filter(rate => {
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
    const stablePrices = marketRates.filter(rate => rate.change === 0).length
    
    // Calculate average price by crop
    const cropAverages = uniqueCrops.map(crop => {
      const cropRates = marketRates.filter(rate => rate.crop === crop)
      const avgPrice = cropRates.reduce((sum, rate) => sum + rate.price, 0) / cropRates.length
      const bestMandi = cropRates.reduce((best, rate) => rate.price > best.price ? rate : best)
      return { crop, avgPrice, bestMandi }
    })

    return {
      totalCrops,
      totalMandis,
      risingPrices,
      fallingPrices,
      stablePrices,
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
                        <select
                          value={selectedCrop}
                          onChange={(e) => setSelectedCrop(e.target.value)}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        >
                          <option value="all">All Crops</option>
                          {uniqueCrops.map(crop => (
                            <option key={crop} value={crop}>
                              {crop}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Mandi</label>
                        <select
                          value={selectedMandi}
                          onChange={(e) => setSelectedMandi(e.target.value)}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        >
                          <option value="all">All Mandis</option>
                          {uniqueMandis.map(mandi => (
                            <option key={mandi} value={mandi}>
                              {mandi}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Sort By</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        >
                          <option value="price">Sort by Price</option>
                          <option value="change">Sort by Change</option>
                          <option value="crop">Sort by Crop</option>
                          <option value="mandi">Sort by Mandi</option>
                        </select>
                      </div>
                    </div>
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
                          <span className="text-xs text-muted-foreground">
                            {item.bestMandi.lastUpdated}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Market Rates List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Live Market Rates
                      </CardTitle>
                      <CardDescription>
                        {filteredRates.length} rates found • Updated every hour
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                      >
                        List
                      </Button>
                      <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                      >
                        Grid
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredRates.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No rates found matching your search</p>
                    </div>
                  ) : (
                    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                      {filteredRates.map((rate, index) => {
                        const ChangeIcon = getChangeIcon(rate.change)
                        const isAlertSet = priceAlerts.includes(rate.id)
                        
                        return (
                          <motion.div
                            key={rate.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                            className={viewMode === "grid" ? "p-4 rounded-lg border hover:bg-accent/50 transition-colors" : "flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"}
                          >
                            {viewMode === "grid" ? (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="text-sm font-semibold text-primary">
                                          {rate.crop.charAt(0)}
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">{rate.crop}</h4>
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        {rate.mandi}
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => togglePriceAlert(rate.id)}
                                    className={isAlertSet ? "text-yellow-600" : "text-muted-foreground"}
                                  >
                                    <Bell className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                <div className="text-2xl font-bold">
                                  {formatPrice(rate.price)}
                                </div>
                                <div className="text-sm text-muted-foreground mb-2">
                                  {rate.unit}
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className={`flex items-center gap-1 ${getChangeColor(rate.change)}`}>
                                    <ChangeIcon className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                      {rate.change > 0 ? '+' : ''}{rate.change}%
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {rate.lastUpdated}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
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
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => togglePriceAlert(rate.id)}
                                  className={isAlertSet ? "text-yellow-600" : "text-muted-foreground"}
                                >
                                  <Bell className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
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