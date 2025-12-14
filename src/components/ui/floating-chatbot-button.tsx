"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingChatbotButtonProps {
  delay?: number
}

export function FloatingChatbotButton({ delay = 0.6 }: FloatingChatbotButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        size="lg"
        className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
        asChild
      >
        <Link href="/chatbot">
          <MessageCircle className="h-6 w-6" />
        </Link>
      </Button>
    </motion.div>
  )
}
