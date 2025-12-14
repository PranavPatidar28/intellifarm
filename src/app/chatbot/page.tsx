"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Mic,
  MicOff,
  ArrowLeft,
  Bot,
  User,
  Loader2,
  AlertCircle,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "@/components/mobile-nav"
import { ChatMessage } from "@/lib/data"
import Link from "next/link"

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize welcome message on client side only to avoid hydration mismatch
  useEffect(() => {
    setMessages([{
      id: "welcome",
      type: "ai",
      message: "Namaste! 🙏 I'm IntelliFarm AI, your smart farming assistant. I can help you with crop cultivation, pest management, weather advice, market prices, government schemes, and more. How can I assist you today?",
      timestamp: new Date()
    }])
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: inputMessage,
      timestamp: new Date()
    }

    const currentInput = inputMessage
    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)
    setIsConnected(true)

    // Create placeholder AI message for streaming
    const aiMessageId = (Date.now() + 1).toString()
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      type: "ai",
      message: "",
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiMessage])

    try {
      // Abort any existing request
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      // Build conversation history for context
      const history = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({
          role: m.type === "user" ? "user" as const : "assistant" as const,
          content: m.message
        }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          history: history.slice(-10) // Keep last 10 messages for context
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error("Failed to get response from AI")
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("No response body")
      }

      let fullResponse = ""

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullResponse += chunk

        // Update message with streamed content
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMessageId
              ? { ...m, message: fullResponse }
              : m
          )
        )
      }

      // If empty response, show fallback
      if (!fullResponse.trim()) {
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMessageId
              ? { ...m, message: "I apologize, but I couldn't generate a response. Please try asking your question again." }
              : m
          )
        )
      }

    } catch (error) {
      console.error("Chat error:", error)

      if ((error as Error).name === "AbortError") {
        return // Request was cancelled
      }

      setIsConnected(false)

      // Update the AI message with error
      setMessages(prev =>
        prev.map(m =>
          m.id === aiMessageId
            ? { ...m, message: "I'm having trouble connecting to my brain right now. 🔧 Please make sure Ollama is running locally, or try again in a moment." }
            : m
        )
      )
    } finally {
      setIsTyping(false)
    }
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
    "🌾 Best time to sow wheat?",
    "🐛 How to manage pests organically?",
    "💰 What is the MSP for rice?",
    "🌧️ How much water does sugarcane need?",
    "🌱 Which fertilizer for tomatoes?"
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
              <div className="p-2 rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">IntelliFarm AI</h1>
                <p className="text-sm text-muted-foreground">Your smart farming assistant</p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={`ml-auto ${isConnected
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
            >
              {isConnected ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                  Online
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Offline
                </>
              )}
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
                  <div className={`p-2 rounded-full ${message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                    }`}>
                    {message.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>

                  <Card className={`${message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                    }`}>
                    <CardContent className="p-3">
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${message.type === "user"
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
