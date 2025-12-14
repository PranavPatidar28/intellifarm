"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sprout,
  MapPin,
  Droplets,
  Thermometer,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Locate,
  ChevronDown,
  Beaker,
  Leaf,
  FlaskConical
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "@/components/mobile-nav"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

interface SoilData {
  N: number
  P: number
  K: number
  TEMP: number
  PH: number
  RAINFALL: number
}

interface CropPrediction {
  predictedCrop: string
  explanation: string
  soilData: SoilData
  imageUrl: string
}

interface AdvisoryForm {
  soilType: string
  farmArea: string
  season: string
  lat?: number
  lon?: number
}

interface AdvancedOptions {
  nitrogen: string
  phosphorus: string
  potassium: string
  ph: string
  temperature: string
  rainfall: string
}

const SOIL_TYPES = [
  { value: "clay", label: "Clay", n: 40, p: 27, k: 27, ph: 7.0 },
  { value: "sandy", label: "Sandy", n: 35, p: 20, k: 20, ph: 6.5 },
  { value: "loamy", label: "Loamy", n: 45, p: 30, k: 30, ph: 6.8 },
  { value: "silty", label: "Silty", n: 38, p: 25, k: 25, ph: 7.2 },
  { value: "peaty", label: "Peaty", n: 50, p: 15, k: 15, ph: 5.5 },
  { value: "chalky", label: "Chalky", n: 30, p: 22, k: 22, ph: 8.0 },
]

const SEASONS = [
  { value: "summer", label: "Summer", temp: 30, rainfall: 80 },
  { value: "winter", label: "Winter", temp: 15, rainfall: 40 },
  { value: "monsoon", label: "Monsoon", temp: 27, rainfall: 200 },
  { value: "spring", label: "Spring", temp: 22, rainfall: 100 },
  { value: "autumn", label: "Autumn", temp: 20, rainfall: 60 },
]

export default function CropAdvisoryPage() {
  const [formData, setFormData] = useState<AdvisoryForm>({
    soilType: "",
    farmArea: "",
    season: ""
  })
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
    temperature: "",
    rainfall: ""
  })
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [prediction, setPrediction] = useState<CropPrediction | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAutoDetectLocation = () => {
    setIsLocating(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lon: position.coords.longitude
        }))
        setIsLocating(false)
      },
      (err) => {
        setError("Unable to retrieve your location")
        setIsLocating(false)
      }
    )
  }

  const handleAdvancedChange = (field: keyof AdvancedOptions, value: string) => {
    setAdvancedOptions(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Get soil data based on selected soil type and season (if selected)
      // If not selected, we will let the backend handle random generation or use defaults
      const selectedSoil = SOIL_TYPES.find(soil => soil.value === formData.soilType)
      const selectedSeason = SEASONS.find(season => season.value === formData.season)

      // Prepare payload
      // We send what we have. Backend handles the rest.
      const payload: any = {
        lat: formData.lat,
        lon: formData.lon,
        soilData: {}
      }

      // Use advanced options if provided, otherwise fall back to selected presets
      if (advancedOptions.nitrogen) {
        payload.soilData.N = parseFloat(advancedOptions.nitrogen)
      } else if (selectedSoil) {
        payload.soilData.N = selectedSoil.n
      }

      if (advancedOptions.phosphorus) {
        payload.soilData.P = parseFloat(advancedOptions.phosphorus)
      } else if (selectedSoil) {
        payload.soilData.P = selectedSoil.p
      }

      if (advancedOptions.potassium) {
        payload.soilData.K = parseFloat(advancedOptions.potassium)
      } else if (selectedSoil) {
        payload.soilData.K = selectedSoil.k
      }

      if (advancedOptions.ph) {
        payload.soilData.PH = parseFloat(advancedOptions.ph)
      } else if (selectedSoil) {
        payload.soilData.PH = selectedSoil.ph
      }

      if (advancedOptions.temperature) {
        payload.soilData.TEMP = parseFloat(advancedOptions.temperature)
      } else if (selectedSeason) {
        payload.soilData.TEMP = selectedSeason.temp
      }

      if (advancedOptions.rainfall) {
        payload.soilData.RAINFALL = parseFloat(advancedOptions.rainfall)
      } else if (selectedSeason) {
        payload.soilData.RAINFALL = selectedSeason.rainfall
      }

      // Call the API
      const response = await fetch('/api/predict-crop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get prediction')
      }

      const data = await response.json()

      setPrediction(data)
      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted && prediction) {
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
                <Button variant="ghost" size="icon" onClick={() => setIsSubmitted(false)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">Crop Advisory Results</h1>
                  <p className="text-muted-foreground">AI-powered recommendations for your farm</p>
                </div>
              </div>

              {/* Results */}
              <div className="grid gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                    <CardHeader className="pb-8 pt-8">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-4 rounded-full bg-green-600 text-white shadow-lg shadow-green-600/20">
                          <Sprout className="h-12 w-12" />
                        </div>
                        <div className="space-y-2">
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                            Highly Recommended
                          </Badge>
                          <CardTitle className="text-4xl font-bold text-green-800 dark:text-green-100">
                            {prediction.predictedCrop}
                          </CardTitle>
                          <CardDescription className="text-base">
                            Optimal crop for your current soil and weather conditions
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-8">
                      {/* Parameters Used */}
                      <div className="bg-white/50 dark:bg-slate-950/50 rounded-2xl p-6 border border-green-100 dark:border-green-900/50">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Growth Parameters</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Thermometer className="h-4 w-4 text-orange-500" />
                              <span>Temp</span>
                            </div>
                            <div className="font-semibold text-lg">{prediction.soilData.TEMP}°C</div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Droplets className="h-4 w-4 text-blue-500" />
                              <span>Rainfall</span>
                            </div>
                            <div className="font-semibold text-lg">{prediction.soilData.RAINFALL} mm</div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 text-purple-500" />
                              <span>pH</span>
                            </div>
                            <div className="font-semibold text-lg">{prediction.soilData.PH}</div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 text-green-500" />
                              <span>N-P-K</span>
                            </div>
                            <div className="font-semibold text-lg">
                              {prediction.soilData.N}-{prediction.soilData.P}-{prediction.soilData.K}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Explanation */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Sprout className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="font-semibold text-lg">AI Agronomist Note</h3>
                        </div>
                        <div className="p-6 bg-white dark:bg-slate-950 rounded-2xl text-base leading-relaxed border border-border/50 shadow-sm">
                          {prediction.explanation}
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          className="w-full h-12 text-base"
                          onClick={() => setIsSubmitted(false)}
                          size="lg"
                        >
                          Check Another Crop
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 via-background to-background dark:from-green-950/20">
      <MobileNav />
      <main className="md:ml-64">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-6 md:p-8 text-white shadow-xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <Button variant="ghost" size="icon" asChild className="text-white/80 hover:text-white hover:bg-white/10">
                    <Link href="/">
                      <ArrowLeft className="h-5 w-5" />
                    </Link>
                  </Button>
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    <Sprout className="h-7 w-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Crop Advisory</h1>
                    <p className="text-green-100 text-sm md:text-base">AI-powered recommendations for your farm</p>
                  </div>
                </div>

                {/* Feature Badges */}
                <div className="flex flex-wrap gap-2 mt-5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-xs md:text-sm">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Location Based</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-xs md:text-sm">
                    <Droplets className="h-3.5 w-3.5" />
                    <span>Weather Aware</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-xs md:text-sm">
                    <Thermometer className="h-3.5 w-3.5" />
                    <span>Season Optimized</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-xs md:text-sm">
                    <Beaker className="h-3.5 w-3.5" />
                    <span>Soil Analysis</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form Card */}
            <Card className="border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                {error && (
                  <Alert variant="destructive" className="m-6 mb-0">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Location Section */}
                  <div className="p-6 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/30 dark:to-sky-900/30">
                          <Locate className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Your Location</h3>
                          <p className="text-xs text-muted-foreground">
                            {formData.lat ? `${formData.lat.toFixed(4)}, ${formData.lon?.toFixed(4)}` : "Helps fetch accurate weather data"}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={formData.lat ? "secondary" : "outline"}
                        size="sm"
                        onClick={handleAutoDetectLocation}
                        disabled={isLocating || (!!formData.lat && !!formData.lon)}
                        className={cn(formData.lat && "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400")}
                      >
                        {isLocating ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Detecting...
                          </>
                        ) : formData.lat ? (
                          <>
                            <CheckCircle className="mr-2 h-3 w-3" />
                            Detected
                          </>
                        ) : (
                          <>
                            <Locate className="mr-2 h-3 w-3" />
                            Detect
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Quick Settings */}
                  <div className="p-6 border-b border-border/50 bg-muted/20">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                        <FlaskConical className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Quick Settings</h3>
                        <p className="text-xs text-muted-foreground">Select presets or customize below</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="soilType" className="text-sm font-medium">Soil Type</Label>
                        <Select
                          value={formData.soilType}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, soilType: value }))}
                        >
                          <SelectTrigger id="soilType" className="bg-background">
                            <SelectValue placeholder="Select soil type" />
                          </SelectTrigger>
                          <SelectContent>
                            {SOIL_TYPES.map(soil => (
                              <SelectItem key={soil.value} value={soil.value}>
                                {soil.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="season" className="text-sm font-medium">Growing Season</Label>
                        <Select
                          value={formData.season}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, season: value }))}
                        >
                          <SelectTrigger id="season" className="bg-background">
                            <SelectValue placeholder="Select season" />
                          </SelectTrigger>
                          <SelectContent>
                            {SEASONS.map(season => (
                              <SelectItem key={season.value} value={season.value}>
                                {season.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="farmArea" className="text-sm font-medium">Farm Area (acres)</Label>
                        <Input
                          id="farmArea"
                          type="number"
                          min="0.1"
                          step="0.1"
                          placeholder="e.g. 5"
                          value={formData.farmArea}
                          onChange={(e) => setFormData(prev => ({ ...prev, farmArea: e.target.value }))}
                          className="bg-background"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Advanced Options */}
                  <div className="p-6 border-b border-border/50">
                    <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          className="w-full flex items-center justify-between py-2 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30">
                              <Beaker className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="text-left">
                              <h3 className="font-semibold">Advanced Options</h3>
                              <p className="text-xs text-muted-foreground">
                                Customize N, P, K, pH, temperature & rainfall
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {(advancedOptions.nitrogen || advancedOptions.phosphorus || advancedOptions.potassium || advancedOptions.ph || advancedOptions.temperature || advancedOptions.rainfall) && (
                              <Badge variant="secondary" className="text-xs">
                                Custom Values
                              </Badge>
                            )}
                            <ChevronDown className={cn(
                              "h-5 w-5 text-muted-foreground transition-transform duration-200",
                              isAdvancedOpen && "rotate-180"
                            )} />
                          </div>
                        </button>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <AnimatePresence>
                          {isAdvancedOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="mt-5 pt-5 border-t border-border/50">
                                <p className="text-sm text-muted-foreground mb-5">
                                  Override preset values with your soil test results for more accurate recommendations.
                                </p>

                                {/* Soil Nutrients */}
                                <div className="mb-6">
                                  <div className="flex items-center gap-2 mb-4">
                                    <Leaf className="h-4 w-4 text-green-600" />
                                    <h4 className="font-medium text-sm">Soil Nutrients (kg/ha)</h4>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                                      <Label htmlFor="nitrogen" className="text-sm font-medium flex items-center gap-2 mb-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                        Nitrogen (N)
                                      </Label>
                                      <Input
                                        id="nitrogen"
                                        type="number"
                                        min="0"
                                        max="140"
                                        step="1"
                                        placeholder="0 – 140"
                                        value={advancedOptions.nitrogen}
                                        onChange={(e) => handleAdvancedChange("nitrogen", e.target.value)}
                                        className="bg-white dark:bg-slate-900"
                                      />
                                      <p className="text-[10px] text-muted-foreground mt-1.5">Promotes leaf growth</p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30">
                                      <Label htmlFor="phosphorus" className="text-sm font-medium flex items-center gap-2 mb-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                                        Phosphorus (P)
                                      </Label>
                                      <Input
                                        id="phosphorus"
                                        type="number"
                                        min="0"
                                        max="145"
                                        step="1"
                                        placeholder="0 – 145"
                                        value={advancedOptions.phosphorus}
                                        onChange={(e) => handleAdvancedChange("phosphorus", e.target.value)}
                                        className="bg-white dark:bg-slate-900"
                                      />
                                      <p className="text-[10px] text-muted-foreground mt-1.5">Root development</p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
                                      <Label htmlFor="potassium" className="text-sm font-medium flex items-center gap-2 mb-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                                        Potassium (K)
                                      </Label>
                                      <Input
                                        id="potassium"
                                        type="number"
                                        min="0"
                                        max="205"
                                        step="1"
                                        placeholder="0 – 205"
                                        value={advancedOptions.potassium}
                                        onChange={(e) => handleAdvancedChange("potassium", e.target.value)}
                                        className="bg-white dark:bg-slate-900"
                                      />
                                      <p className="text-[10px] text-muted-foreground mt-1.5">Overall plant health</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Environmental Conditions */}
                                <div>
                                  <div className="flex items-center gap-2 mb-4">
                                    <Thermometer className="h-4 w-4 text-orange-600" />
                                    <h4 className="font-medium text-sm">Environmental Conditions</h4>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30">
                                      <Label htmlFor="ph" className="text-sm font-medium flex items-center gap-2 mb-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-teal-500"></div>
                                        pH Level
                                      </Label>
                                      <Input
                                        id="ph"
                                        type="number"
                                        min="3"
                                        max="10"
                                        step="0.1"
                                        placeholder="3.0 – 10.0"
                                        value={advancedOptions.ph}
                                        onChange={(e) => handleAdvancedChange("ph", e.target.value)}
                                        className="bg-white dark:bg-slate-900"
                                      />
                                      <p className="text-[10px] text-muted-foreground mt-1.5">Soil acidity/alkalinity</p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                                      <Label htmlFor="temperature" className="text-sm font-medium flex items-center gap-2 mb-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                        Temperature (°C)
                                      </Label>
                                      <Input
                                        id="temperature"
                                        type="number"
                                        min="5"
                                        max="50"
                                        step="0.5"
                                        placeholder="5 – 50"
                                        value={advancedOptions.temperature}
                                        onChange={(e) => handleAdvancedChange("temperature", e.target.value)}
                                        className="bg-white dark:bg-slate-900"
                                      />
                                      <p className="text-[10px] text-muted-foreground mt-1.5">Avg. growing temp</p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30">
                                      <Label htmlFor="rainfall" className="text-sm font-medium flex items-center gap-2 mb-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-sky-500"></div>
                                        Rainfall (mm)
                                      </Label>
                                      <Input
                                        id="rainfall"
                                        type="number"
                                        min="0"
                                        max="500"
                                        step="5"
                                        placeholder="0 – 500"
                                        value={advancedOptions.rainfall}
                                        onChange={(e) => handleAdvancedChange("rainfall", e.target.value)}
                                        className="bg-white dark:bg-slate-900"
                                      />
                                      <p className="text-[10px] text-muted-foreground mt-1.5">Expected rainfall</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  {/* Submit Section */}
                  <div className="p-6 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/20 dark:to-emerald-950/20">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl shadow-green-600/25 transition-all hover:shadow-green-600/40 hover:scale-[1.01]"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span>Analyzing Your Farm Data...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Sprout className="h-6 w-6" />
                          <span>Get Crop Recommendation</span>
                        </div>
                      )}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-3">
                      Our AI will analyze your inputs to recommend the best crop
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
