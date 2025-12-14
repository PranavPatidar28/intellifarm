"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Calculator, 
  Droplets, 
  Zap,
  Users,
  TrendingUp,
  ArrowLeft,
  Calendar,
  MapPin,
  BarChart3,
  Target,
  Clock,
  CheckCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MobileNav } from "@/components/mobile-nav"
import Link from "next/link"

const cropData = [
  {
    id: "wheat",
    name: "Wheat",
    waterPerAcre: 24, // inches per season
    fertilizerNPK: { N: 120, P: 60, K: 40 }, // kg per acre
    laborHours: 80, // hours per acre
    season: "Rabi"
  },
  {
    id: "rice",
    name: "Rice",
    waterPerAcre: 36,
    fertilizerNPK: { N: 100, P: 50, K: 50 },
    laborHours: 120,
    season: "Kharif"
  },
  {
    id: "maize",
    name: "Maize",
    waterPerAcre: 20,
    fertilizerNPK: { N: 150, P: 70, K: 60 },
    laborHours: 60,
    season: "Kharif"
  }
]

export default function ResourcePredictionPage() {
  const [selectedCrop, setSelectedCrop] = useState("wheat")
  const [farmArea, setFarmArea] = useState("")
  const [season, setSeason] = useState("current")
  const [showResults, setShowResults] = useState(false)

  const currentCrop = cropData.find(crop => crop.id === selectedCrop) || cropData[0]

  const calculateResources = () => {
    if (!farmArea || isNaN(Number(farmArea))) return null
    
    const area = Number(farmArea)
    const waterNeeded = currentCrop.waterPerAcre * area
    const fertilizerN = currentCrop.fertilizerNPK.N * area
    const fertilizerP = currentCrop.fertilizerNPK.P * area
    const fertilizerK = currentCrop.fertilizerNPK.K * area
    const laborNeeded = currentCrop.laborHours * area

    return {
      water: waterNeeded,
      fertilizer: { N: fertilizerN, P: fertilizerP, K: fertilizerK },
      labor: laborNeeded,
      cost: {
        water: waterNeeded * 2.5, // ₹2.5 per inch
        fertilizer: (fertilizerN * 15) + (fertilizerP * 25) + (fertilizerK * 20), // ₹15, 25, 20 per kg
        labor: laborNeeded * 300 // ₹300 per hour
      }
    }
  }

  const resources = calculateResources()

  const handleCalculate = () => {
    if (resources) {
      setShowResults(true)
    }
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
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Resource Prediction</h1>
                <p className="text-muted-foreground">Plan your water, fertilizer & labor needs</p>
              </div>
            </div>

            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Resource Calculator
                  </CardTitle>
                  <CardDescription>
                    Enter your farm details to get resource predictions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Select Crop</label>
                      <select
                        value={selectedCrop}
                        onChange={(e) => setSelectedCrop(e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        {cropData.map(crop => (
                          <option key={crop.id} value={crop.id}>
                            {crop.name} ({crop.season})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Farm Area (Acres)</label>
                      <Input
                        type="number"
                        placeholder="Enter area"
                        value={farmArea}
                        onChange={(e) => setFarmArea(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Season</label>
                      <select
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="current">Current Season</option>
                        <option value="next">Next Season</option>
                        <option value="yearly">Yearly Planning</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button onClick={handleCalculate} className="w-full md:w-auto">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Resources
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results */}
            {showResults && resources && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                {/* Water Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-blue-600" />
                      Water Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{resources.water.toFixed(1)}</div>
                        <div className="text-sm text-blue-600">Inches Total</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{(resources.water / 4).toFixed(1)}</div>
                        <div className="text-sm text-blue-600">Inches per Month</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">₹{resources.cost.water.toFixed(0)}</div>
                        <div className="text-sm text-blue-600">Estimated Cost</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Water Usage Progress</span>
                        <span>75% of season</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Fertilizer Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-green-600" />
                      Fertilizer Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{resources.fertilizer.N.toFixed(0)}</div>
                        <div className="text-sm text-green-600">Nitrogen (kg)</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{resources.fertilizer.P.toFixed(0)}</div>
                        <div className="text-sm text-green-600">Phosphorus (kg)</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{resources.fertilizer.K.toFixed(0)}</div>
                        <div className="text-sm text-green-600">Potassium (kg)</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">₹{resources.cost.fertilizer.toFixed(0)}</div>
                        <div className="text-sm text-green-600">Total Cost</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Labor Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      Labor Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{resources.labor.toFixed(0)}</div>
                        <div className="text-sm text-purple-600">Total Hours</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{(resources.labor / 30).toFixed(1)}</div>
                        <div className="text-sm text-purple-600">Hours per Day</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">₹{resources.cost.labor.toFixed(0)}</div>
                        <div className="text-sm text-purple-600">Labor Cost</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-orange-600" />
                      Cost Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-lg border-1 border-gray-700">
                        <span className="font-medium">Water Cost</span>
                        <span className="font-bold">₹{resources.cost.water.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg border-1 border-gray-700">
                        <span className="font-medium">Fertilizer Cost</span>
                        <span className="font-bold">₹{resources.cost.fertilizer.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg border-1 border-gray-700">
                        <span className="font-medium">Labor Cost</span>
                        <span className="font-bold">₹{resources.cost.labor.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 rounded-lg border-2 border-orange-200">
                        <span className="font-bold text-lg">Total Estimated Cost</span>
                        <span className="font-bold text-xl text-orange-600">
                          ₹{(resources.cost.water + resources.cost.fertilizer + resources.cost.labor).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Planning Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Resource Planning Tips
                  </CardTitle>
                  <CardDescription>
                    Best practices for efficient resource management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-green-600">Water Management</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                          <span className="text-sm">Use drip irrigation for 30% water savings</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                          <span className="text-sm">Monitor soil moisture levels regularly</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                          <span className="text-sm">Collect rainwater for irrigation</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-blue-600">Fertilizer Optimization</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-1" />
                          <span className="text-sm">Test soil before applying fertilizers</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-1" />
                          <span className="text-sm">Use organic compost to reduce chemical needs</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-1" />
                          <span className="text-sm">Apply fertilizers in split doses</span>
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
