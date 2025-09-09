// Dummy data for the FarmerAI application

export interface WeatherData {
  current: {
    temperature: number
    condition: string
    humidity: number
    windSpeed: number
    icon: string
  }
  forecast: Array<{
    date: string
    day: string
    high: number
    low: number
    condition: string
    icon: string
    precipitation: number
  }>
}

export interface MarketRate {
  id: string
  crop: string
  mandi: string
  price: number
  unit: string
  change: number
  lastUpdated: string
}

export interface CropAdvisory {
  id: string
  crop: string
  recommendation: string
  soilType: string
  season: string
  rainfall: string
  location: string
  confidence: number
  tips: string[]
  createdAt: string
}

export interface ChatMessage {
  id: string
  type: "user" | "ai"
  message: string
  timestamp: Date
}

// Dummy weather data
export const weatherData: WeatherData = {
  current: {
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    icon: "partly-cloudy"
  },
  forecast: [
    {
      date: "2024-01-15",
      day: "Today",
      high: 32,
      low: 22,
      condition: "Partly Cloudy",
      icon: "partly-cloudy",
      precipitation: 20
    },
    {
      date: "2024-01-16",
      day: "Tomorrow",
      high: 30,
      low: 20,
      condition: "Sunny",
      icon: "sunny",
      precipitation: 0
    },
    {
      date: "2024-01-17",
      day: "Wed",
      high: 28,
      low: 18,
      condition: "Rainy",
      icon: "rainy",
      precipitation: 80
    },
    {
      date: "2024-01-18",
      day: "Thu",
      high: 26,
      low: 16,
      condition: "Cloudy",
      icon: "cloudy",
      precipitation: 40
    },
    {
      date: "2024-01-19",
      day: "Fri",
      high: 29,
      low: 19,
      condition: "Sunny",
      icon: "sunny",
      precipitation: 10
    },
    {
      date: "2024-01-20",
      day: "Sat",
      high: 31,
      low: 21,
      condition: "Partly Cloudy",
      icon: "partly-cloudy",
      precipitation: 15
    },
    {
      date: "2024-01-21",
      day: "Sun",
      high: 33,
      low: 23,
      condition: "Sunny",
      icon: "sunny",
      precipitation: 5
    }
  ]
}

// Dummy market rates data
export const marketRates: MarketRate[] = [
  {
    id: "1",
    crop: "Wheat",
    mandi: "Delhi Mandi",
    price: 2450,
    unit: "per quintal",
    change: 2.5,
    lastUpdated: "2 hours ago"
  },
  {
    id: "2",
    crop: "Rice",
    mandi: "Punjab Mandi",
    price: 3200,
    unit: "per quintal",
    change: -1.2,
    lastUpdated: "1 hour ago"
  },
  {
    id: "3",
    crop: "Maize",
    mandi: "Haryana Mandi",
    price: 1850,
    unit: "per quintal",
    change: 3.8,
    lastUpdated: "3 hours ago"
  },
  {
    id: "4",
    crop: "Sugarcane",
    mandi: "UP Mandi",
    price: 320,
    unit: "per quintal",
    change: 0.5,
    lastUpdated: "4 hours ago"
  },
  {
    id: "5",
    crop: "Cotton",
    mandi: "Gujarat Mandi",
    price: 6800,
    unit: "per quintal",
    change: -2.1,
    lastUpdated: "2 hours ago"
  },
  {
    id: "6",
    crop: "Soybean",
    mandi: "MP Mandi",
    price: 4200,
    unit: "per quintal",
    change: 1.8,
    lastUpdated: "1 hour ago"
  }
]

// Dummy crop advisory data
export const cropAdvisoryData: CropAdvisory[] = [
  {
    id: "1",
    crop: "Wheat",
    recommendation: "Optimal sowing time is now. Use certified seeds and maintain proper spacing.",
    soilType: "Loamy",
    season: "Rabi",
    rainfall: "Normal",
    location: "North India",
    confidence: 92,
    tips: [
      "Sow seeds at 2-3 cm depth",
      "Maintain 20-25 cm row spacing",
      "Apply 50kg N, 25kg P, 25kg K per acre",
      "Monitor for yellow rust disease"
    ],
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    crop: "Rice",
    recommendation: "Transplanting recommended in next 2 weeks. Prepare nursery beds.",
    soilType: "Clay",
    season: "Kharif",
    rainfall: "Above Normal",
    location: "East India",
    confidence: 88,
    tips: [
      "Prepare nursery 25-30 days before transplanting",
      "Use 40-50 kg seeds per hectare",
      "Maintain 2-3 cm water depth",
      "Apply zinc sulfate if deficiency observed"
    ],
    createdAt: "2024-01-14T14:20:00Z"
  }
]

// Quick action cards data
export const quickActions = [
  {
    id: "crop-advisory",
    title: "Crop Advisory",
    description: "Get AI-powered crop recommendations",
    icon: "Sprout",
    href: "/crop-advisory",
    color: "bg-green-500"
  },
  {
    id: "pest-disease",
    title: "Pest & Disease",
    description: "Identify and treat crop issues",
    icon: "Shield",
    href: "/pest-disease",
    color: "bg-red-500"
  },
  {
    id: "market-rates",
    title: "Market Rates",
    description: "View crop prices in nearby mandis",
    icon: "TrendingUp",
    href: "/market-rates",
    color: "bg-orange-500"
  },
  {
    id: "chatbot",
    title: "AI Assistant",
    description: "Ask questions about farming",
    icon: "MessageCircle",
    href: "/chatbot",
    color: "bg-purple-500"
  }
]

// Sample chat messages
export const sampleChatMessages: ChatMessage[] = [
  {
    id: "1",
    type: "ai",
    message: "Hello! I'm your AI farming assistant. How can I help you today?",
    timestamp: new Date("2024-01-15T09:00:00Z")
  },
  {
    id: "2",
    type: "user",
    message: "What's the best time to plant wheat?",
    timestamp: new Date("2024-01-15T09:01:00Z")
  },
  {
    id: "3",
    type: "ai",
    message: "The optimal time to plant wheat in North India is from mid-October to mid-November. This timing ensures proper germination and good yield. Make sure the soil temperature is around 20-25°C for best results.",
    timestamp: new Date("2024-01-15T09:01:30Z")
  }
]
