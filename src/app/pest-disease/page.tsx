"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Shield, 
  Bug, 
  AlertTriangle,
  ArrowLeft,
  Search,
  Camera,
  Upload,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "@/components/mobile-nav"
import Link from "next/link"

const pestDiseaseData = [
  {
    id: "1",
    name: "Aphids",
    crop: "Wheat",
    severity: "Medium",
    symptoms: "Yellowing leaves, sticky honeydew",
    treatment: "Apply neem oil or insecticidal soap",
    prevention: "Use beneficial insects like ladybugs"
  },
  {
    id: "2", 
    name: "Powdery Mildew",
    crop: "Rice",
    severity: "High",
    symptoms: "White powdery coating on leaves",
    treatment: "Apply sulfur-based fungicide",
    prevention: "Ensure proper air circulation"
  },
  {
    id: "3",
    name: "Root Rot",
    crop: "Maize",
    severity: "High", 
    symptoms: "Wilting, yellow leaves, stunted growth",
    treatment: "Improve drainage, apply fungicide",
    prevention: "Avoid overwatering, use resistant varieties"
  }
]

export default function PestDiseasePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCrop, setSelectedCrop] = useState("all")

  const filteredData = pestDiseaseData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCrop = selectedCrop === "all" || item.crop.toLowerCase() === selectedCrop.toLowerCase()
    return matchesSearch && matchesCrop
  })

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "low": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "high": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
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
                <h1 className="text-3xl font-bold">Pest & Disease Management</h1>
                <p className="text-muted-foreground">Identify and treat crop issues</p>
              </div>
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
                        placeholder="Search pests, diseases, or symptoms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="all">All Crops</option>
                      <option value="wheat">Wheat</option>
                      <option value="rice">Rice</option>
                      <option value="maize">Maize</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <Camera className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Photo Diagnosis</h3>
                      <p className="text-sm text-muted-foreground">Upload crop photos for AI analysis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-100">
                      <Upload className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Report Issue</h3>
                      <p className="text-sm text-muted-foreground">Report new pest or disease</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Common Issues */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Common Pest & Disease Issues
                  </CardTitle>
                  <CardDescription>
                    Browse and learn about common crop problems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredData.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <div className="p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{item.name}</h4>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  {item.crop}
                                </Badge>
                                <Badge variant="secondary" className={getSeverityColor(item.severity)}>
                                  {item.severity} Risk
                                </Badge>
                              </div>
                              
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium text-red-600">Symptoms:</span>
                                  <span className="text-muted-foreground ml-2">{item.symptoms}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-green-600">Treatment:</span>
                                  <span className="text-muted-foreground ml-2">{item.treatment}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-blue-600">Prevention:</span>
                                  <span className="text-muted-foreground ml-2">{item.prevention}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <Button variant="outline" size="sm">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Treat
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Prevention Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Prevention Tips
                  </CardTitle>
                  <CardDescription>
                    Best practices to prevent pest and disease issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Crop Rotation</h4>
                          <p className="text-sm text-muted-foreground">Rotate crops to break pest cycles</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Proper Spacing</h4>
                          <p className="text-sm text-muted-foreground">Ensure adequate air circulation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Clean Equipment</h4>
                          <p className="text-sm text-muted-foreground">Sanitize tools between uses</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Resistant Varieties</h4>
                          <p className="text-sm text-muted-foreground">Use disease-resistant seed varieties</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Regular Monitoring</h4>
                          <p className="text-sm text-muted-foreground">Check crops regularly for early signs</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Organic Methods</h4>
                          <p className="text-sm text-muted-foreground">Use beneficial insects and natural treatments</p>
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

