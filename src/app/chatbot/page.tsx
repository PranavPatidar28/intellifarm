"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff,
  ArrowLeft,
  Bot,
  User,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "@/components/mobile-nav"
import { sampleChatMessages, ChatMessage } from "@/lib/data"
import Link from "next/link"

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(sampleChatMessages)
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        message: getAIResponse(inputMessage),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    if (message.includes("wheat") || message.includes("गेहूं")) {
      return "Wheat is a great choice for Rabi season! The optimal sowing time is mid-October to mid-November. Make sure to use certified seeds and maintain proper spacing of 20-25 cm between rows. Apply balanced fertilizer with 50kg N, 25kg P, and 25kg K per acre."
    }
    
    if (message.includes("rice") || message.includes("चावल")) {
      return "Rice cultivation requires careful water management. For Kharif season, prepare nursery beds 25-30 days before transplanting. Use 40-50 kg seeds per hectare and maintain 2-3 cm water depth. Watch out for zinc deficiency and apply zinc sulfate if needed."
    }
    
    if (message.includes("weather") || message.includes("मौसम")) {
      return "Current weather shows 28°C with 65% humidity. There's a 20% chance of rain today. For the next 7 days, expect mostly sunny weather with some clouds. This is good weather for most farming activities. Avoid irrigation during peak heat hours."
    }
    
    if (message.includes("pest") || message.includes("कीट")) {
      return "For pest management, I recommend integrated pest management (IPM) approach. Monitor your crops regularly, use natural predators when possible, and apply pesticides only when necessary. Neem oil is a good organic option for many common pests."
    }
    
    if (message.includes("fertilizer") || message.includes("खाद")) {
      return "Soil testing is crucial before applying fertilizers. Generally, for most crops, use NPK in balanced proportions. Organic fertilizers like compost and manure improve soil health long-term. Apply fertilizers based on crop growth stages and soil conditions."
    }
    
    if (message.includes("price") || message.includes("कीमत") || message.includes("market")) {
      return "Current market rates: Wheat ₹2,450/quintal (+2.5%), Rice ₹3,200/quintal (-1.2%), Maize ₹1,850/quintal (+3.8%). Prices are updated hourly. Consider selling wheat now as prices are rising, while rice prices are stable."
    }
    
    return "I'm here to help with all your farming questions! You can ask me about crop cultivation, weather, pest management, fertilizers, market prices, or any other agricultural topic. What would you like to know?"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // In a real app, this would integrate with speech recognition
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        setInputMessage("What's the best time to plant wheat?")
        setIsListening(false)
      }, 2000)
    }
  }

  const quickQuestions = [
    "Best time to plant wheat?",
    "How to control pests?",
    "Current market prices?",
    "Weather forecast?",
    "Fertilizer recommendations?"
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MobileNav />
      
      {/* Chat Header */}
      <div className="sticky top-16 z-40 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Farming Assistant</h1>
                <p className="text-sm text-muted-foreground">Ask me anything about farming</p>
              </div>
            </div>
            <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
              Online
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`p-2 rounded-full ${
                    message.type === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  }`}>
                    {message.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  
                  <Card className={`${
                    message.type === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  }`}>
                    <CardContent className="p-3">
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === "user" 
                          ? "text-primary-foreground/70" 
                          : "text-muted-foreground"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-muted">
                  <Bot className="h-4 w-4" />
                </div>
                <Card className="bg-muted">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">AI is typing...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length <= 3 && (
        <div className="border-t bg-muted/30">
          <div className="container mx-auto px-4 py-4">
            <p className="text-sm text-muted-foreground mb-3">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="sticky bottom-0 bg-background border-t">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                placeholder="Ask me anything about farming..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12"
                disabled={isTyping}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={toggleVoiceInput}
                disabled={isTyping}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-red-500" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-center"
            >
              <p className="text-sm text-muted-foreground">
                Listening... Speak now
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
