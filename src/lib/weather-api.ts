// Weather API service for fetching real-time weather data

export interface WeatherApiResponse {
  main: {
    temp: number
    humidity: number
    feels_like: number
    pressure: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
  visibility: number
  sys: {
    sunrise: number
    sunset: number
  }
  coord: {
    lat: number
    lon: number
  }
  name: string
}

export interface WeatherForecastResponse {
  list: Array<{
    dt: number
    main: {
      temp: number
      temp_min: number
      temp_max: number
      humidity: number
    }
    weather: Array<{
      main: string
      description: string
      icon: string
    }>
    pop: number // probability of precipitation
    dt_txt: string
  }>
  city: {
    name: string
    country: string
  }
}

export interface ProcessedWeatherData {
  location: {
    name: string
    country?: string
    coordinates?: {
      lat: number
      lon: number
    }
  }
  current: {
    temperature: number
    condition: string
    humidity: number
    windSpeed: number
    icon: string
    feelsLike: number
    pressure: number
    visibility: number
    sunrise: string
    sunset: string
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

class WeatherApiService {
  private apiKey: string
  private baseUrl = 'https://api.openweathermap.org/data/2.5'

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || ''
    if (!this.apiKey || this.apiKey === 'your_openweather_api_key_here') {
      console.error('OpenWeather API key not configured properly!')
      console.error('Please:')
      console.error('1. Get a free API key from: https://openweathermap.org/api')
      console.error('2. Create a .env.local file in your project root')
      console.error('3. Add: NEXT_PUBLIC_OPENWEATHER_API_KEY=your_actual_api_key')
    }
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string>): Promise<T> {
    if (!this.apiKey || this.apiKey === 'your_openweather_api_key_here') {
      throw new Error('OpenWeather API key is not configured. Please add NEXT_PUBLIC_OPENWEATHER_API_KEY to your .env.local file')
    }

    const url = new URL(`${this.baseUrl}${endpoint}`)
    url.searchParams.append('appid', this.apiKey)
    url.searchParams.append('units', 'metric') // Use Celsius
    
    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    try {
      const response = await fetch(url.toString())
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeather API key in .env.local file')
        }
        
        throw new Error(`Weather API error: ${response.status} - ${errorData.message || response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Weather API request failed:', error)
      throw error
    }
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherApiResponse> {
    return this.makeRequest<WeatherApiResponse>('/weather', {
      lat: lat.toString(),
      lon: lon.toString()
    })
  }

  async getWeatherForecast(lat: number, lon: number): Promise<WeatherForecastResponse> {
    return this.makeRequest<WeatherForecastResponse>('/forecast', {
      lat: lat.toString(),
      lon: lon.toString()
    })
  }

  async getWeatherByCity(cityName: string): Promise<WeatherApiResponse> {
    return this.makeRequest<WeatherApiResponse>('/weather', {
      q: cityName
    })
  }

  processWeatherData(current: WeatherApiResponse, forecast: WeatherForecastResponse): ProcessedWeatherData {
    // Process location data
    const location = {
      name: current.name || 'Unknown Location',
      country: forecast.city?.country,
      coordinates: {
        lat: current.coord.lat,
        lon: current.coord.lon
      }
    }

    // Process current weather
    const processedCurrent = {
      temperature: Math.round(current.main.temp),
      condition: current.weather[0]?.description || 'Unknown',
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
      icon: current.weather[0]?.icon || '01d',
      feelsLike: Math.round(current.main.feels_like),
      pressure: current.main.pressure,
      visibility: Math.round(current.visibility / 1000), // Convert m to km
      sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    }

    // Process forecast data (group by day and get daily min/max)
    const dailyForecasts = new Map<string, {
      high: number
      low: number
      conditions: string[]
      icons: string[]
      precipitation: number[]
    }>()

    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString()
      const dayData = dailyForecasts.get(date) || {
        high: -Infinity,
        low: Infinity,
        conditions: [],
        icons: [],
        precipitation: []
      }

      dayData.high = Math.max(dayData.high, item.main.temp_max)
      dayData.low = Math.min(dayData.low, item.main.temp_min)
      dayData.conditions.push(item.weather[0]?.description || 'Unknown')
      dayData.icons.push(item.weather[0]?.icon || '01d')
      dayData.precipitation.push(item.pop * 100) // Convert to percentage

      dailyForecasts.set(date, dayData)
    })

    // Convert to array format
    const processedForecast = Array.from(dailyForecasts.entries()).slice(0, 7).map(([date, data], index) => {
      const dateObj = new Date(date)
      const dayNames = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      
      return {
        date: dateObj.toISOString().split('T')[0],
        day: dayNames[index] || dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        high: Math.round(data.high),
        low: Math.round(data.low),
        condition: data.conditions[0] || 'Unknown', // Use first condition of the day
        icon: data.icons[0] || '01d', // Use first icon of the day
        precipitation: Math.round(data.precipitation.reduce((a, b) => a + b, 0) / data.precipitation.length) // Average precipitation
      }
    })

    return {
      location,
      current: processedCurrent,
      forecast: processedForecast
    }
  }

  // Generate mock weather data for fallback
  private generateMockWeatherData(lat?: number, lon?: number): ProcessedWeatherData {
    const now = new Date()
    const baseTemp = 25 + Math.sin(now.getHours() / 24 * Math.PI * 2) * 8 // Simulate daily temperature variation
    
    // console.log('🎭 Generating mock weather data with base temp:', Math.round(baseTemp))
    
    // Determine location name based on coordinates or use default
    let locationName = 'Demo Location'
    if (lat && lon) {
      // Simple coordinate-based location names for demo
      if (lat > 20 && lat < 30 && lon > 70 && lon < 80) {
        locationName = 'Delhi, India'
      } else if (lat > 18 && lat < 20 && lon > 72 && lon < 74) {
        locationName = 'Mumbai, India'
      } else if (lat > 12 && lat < 14 && lon > 77 && lon < 79) {
        locationName = 'Bangalore, India'
      } else {
        locationName = `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`
      }
    }
    
    return {
      location: {
        name: locationName,
        country: 'India',
        coordinates: lat && lon ? { lat, lon } : undefined
      },
      current: {
        temperature: Math.round(baseTemp),
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        icon: '02d',
        feelsLike: Math.round(baseTemp + 2),
        pressure: 1013,
        visibility: 10,
        sunrise: '6:45 AM',
        sunset: '6:15 PM'
      },
      forecast: [
        {
          date: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          day: 'Tomorrow',
          high: Math.round(baseTemp + 5),
          low: Math.round(baseTemp - 3),
          condition: 'Sunny',
          icon: '01d',
          precipitation: 10
        },
        {
          date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          day: 'Wed',
          high: Math.round(baseTemp + 2),
          low: Math.round(baseTemp - 5),
          condition: 'Rainy',
          icon: '10d',
          precipitation: 80
        },
        {
          date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          day: 'Thu',
          high: Math.round(baseTemp + 1),
          low: Math.round(baseTemp - 4),
          condition: 'Cloudy',
          icon: '04d',
          precipitation: 40
        },
        {
          date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          day: 'Fri',
          high: Math.round(baseTemp + 4),
          low: Math.round(baseTemp - 2),
          condition: 'Sunny',
          icon: '01d',
          precipitation: 5
        },
        {
          date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          day: 'Sat',
          high: Math.round(baseTemp + 6),
          low: Math.round(baseTemp - 1),
          condition: 'Partly Cloudy',
          icon: '02d',
          precipitation: 15
        },
        {
          date: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          day: 'Sun',
          high: Math.round(baseTemp + 8),
          low: Math.round(baseTemp + 1),
          condition: 'Sunny',
          icon: '01d',
          precipitation: 0
        }
      ]
    }
  }

  // Fallback method to get weather data with error handling
  async getWeatherData(lat?: number, lon?: number, cityName?: string): Promise<ProcessedWeatherData | null> {
    // Check if API key is properly configured
    if (!this.apiKey || this.apiKey === 'your_openweather_api_key_here') {
      // console.warn('🌤️ Using mock weather data - API key not configured')
      return this.generateMockWeatherData(lat, lon)
    }

    try {
      let current: WeatherApiResponse
      let forecast: WeatherForecastResponse

      if (lat && lon) {
        // Use coordinates if available
        [current, forecast] = await Promise.all([
          this.getCurrentWeather(lat, lon),
          this.getWeatherForecast(lat, lon)
        ])
      } else if (cityName) {
        // Fallback to city name
        current = await this.getWeatherByCity(cityName)
        forecast = await this.getWeatherForecast(current.coord.lat, current.coord.lon)
      } else {
        throw new Error('No location data provided')
      }

      return this.processWeatherData(current, forecast)
    } catch (error) {
      // console.warn('🌤️ API failed, using mock weather data:', error)
      return this.generateMockWeatherData(lat, lon)
    }
  }
}

// Export singleton instance
export const weatherApi = new WeatherApiService()
