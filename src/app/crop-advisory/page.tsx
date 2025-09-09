"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Sprout, 
  MapPin, 
  Droplets, 
  Thermometer,
  Calendar,
  CheckCircle,
  ArrowLeft
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "@/components/mobile-nav"
import { cropAdvisoryData } from "@/lib/data"
import Link from "next/link"

interface AdvisoryForm {
  crop: string
  soilType: string
  season: string
  rainfall: string
  location: string
  area: string
  previousCrop: string
  budget: string
}

export default function CropAdvisoryPage() {
  const [formData, setFormData] = useState<AdvisoryForm>({
    crop: "",
    soilType: "",
    season: "",
    rainfall: "",
    location: "",
    area: "",
    previousCrop: "",
    budget: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 2000)
  }

  const handleInputChange = (field: keyof AdvisoryForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <MobileNav />
        <main className="md:ml-64">
          <div className="container mx-auto px-4 py-6">
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
                  <h1 className="text-3xl font-bold">Crop Advisory Results</h1>
                  <p className="text-muted-foreground">AI-powered recommendations for your farm</p>
                </div>
              </div>

              {/* Results */}
              <div className="grid gap-6">
                {cropAdvisoryData.map((advisory, index) => (
                  <motion.div
                    key={advisory.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100">
                              <Sprout className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{advisory.crop}</CardTitle>
                              <CardDescription>
                                {advisory.season} Season • {advisory.location}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {advisory.confidence}% Confidence
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Recommendation</h4>
                          <p className="text-muted-foreground">{advisory.recommendation}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Soil Type</Label>
                            <p className="text-sm text-muted-foreground">{advisory.soilType}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Rainfall</Label>
                            <p className="text-sm text-muted-foreground">{advisory.rainfall}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Key Tips</h4>
                          <ul className="space-y-2">
                            {advisory.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button asChild className="flex-1">
                  <Link href="/crop-advisory">Get New Advisory</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileNav />
      <main className="md:ml-64">
        <div className="container mx-auto px-4 py-6">
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
                <h1 className="text-3xl font-bold">Crop Advisory</h1>
                <p className="text-muted-foreground">Get AI-powered crop recommendations</p>
              </div>
            </div>

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5" />
                  Farm Details
                </CardTitle>
                <CardDescription>
                  Provide your farm information to get personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="crop">Crop Type *</Label>
                      <Input
                        id="crop"
                        placeholder="e.g., Wheat, Rice, Maize"
                        value={formData.crop}
                        onChange={(e) => handleInputChange("crop", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="soilType">Soil Type *</Label>
                      <Input
                        id="soilType"
                        placeholder="e.g., Loamy, Clay, Sandy"
                        value={formData.soilType}
                        onChange={(e) => handleInputChange("soilType", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="season">Season *</Label>
                      <Input
                        id="season"
                        placeholder="e.g., Rabi, Kharif, Zaid"
                        value={formData.season}
                        onChange={(e) => handleInputChange("season", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rainfall">Rainfall Pattern</Label>
                      <Input
                        id="rainfall"
                        placeholder="e.g., Normal, Above Normal, Below Normal"
                        value={formData.rainfall}
                        onChange={(e) => handleInputChange("rainfall", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Punjab, Haryana, UP"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">Farm Area (acres)</Label>
                      <Input
                        id="area"
                        type="number"
                        placeholder="e.g., 5"
                        value={formData.area}
                        onChange={(e) => handleInputChange("area", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="previousCrop">Previous Crop</Label>
                      <Input
                        id="previousCrop"
                        placeholder="e.g., Rice, Wheat, Fallow"
                        value={formData.previousCrop}
                        onChange={(e) => handleInputChange("previousCrop", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget (₹ per acre)</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="e.g., 15000"
                        value={formData.budget}
                        onChange={(e) => handleInputChange("budget", e.target.value)}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Analyzing...
                      </div>
                    ) : (
                      "Get AI Recommendation"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Location Based</h4>
                      <p className="text-xs text-muted-foreground">Tailored to your region</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Droplets className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Weather Aware</h4>
                      <p className="text-xs text-muted-foreground">Considers rainfall patterns</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100">
                      <Thermometer className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Season Optimized</h4>
                      <p className="text-xs text-muted-foreground">Perfect timing advice</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
