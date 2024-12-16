'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Brain, X, Send, Loader2, Maximize2, Minimize2 } from 'lucide-react'
import { GoogleGenerativeAI } from "@google/generative-ai"
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { cn } from "@/lib/utils"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim() }
      setMessages(prev => [...prev, userMessage])
      setInput("")
      setIsLoading(true)

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
        });

        const result = await chat.sendMessage(`
          You are an AI personal assistant for Career Crafters, an AI-powered student learning platform. Your role is to assist users with all aspects of the platform and provide personalized guidance. Here's what you need to know about Career Crafters:

          1. Dashboard: Provides an overview of all user activities.
          2. Skill Assessment: Evaluates users' skill levels to recommend appropriate courses.
          3. Learning Path: Offers personalized courses based on user's skills and goals.
          4. Career Recommendations: Provides personalized career advice.
          5. Study Tools:
             - Plagiarism checker
             - Smart notes
             - Concept expander
             - AI scheduler
             - Vocabulary builder
             - Summarizer
          6. Community Page: Allows users to engage in discussions.
          7. Student Performance Prediction: Evaluates performance scores based on student data and provides strengths, weaknesses, and recommendations.
          8. Profile Page: Manages user information and settings.
          9. AI Chat System: Provides personalized assistance (that's you!).
          10. Image Analysis Chat: Analyzes images for learning purposes.
          11. PDF Chat: Allows users to interact with and query PDF documents.

          Guidelines:
          1. Provide informative and personalized responses related to Career Crafters' features and functionalities.
          2. Offer suggestions on how to best utilize the platform for learning and career development.
          3. Be friendly, encouraging, and supportive of the user's learning journey.
          4. Use markdown formatting for better readability when suitable.
          5. If asked about specific features, provide detailed explanations and usage tips.
          6. Encourage users to explore different aspects of the platform that might benefit their specific needs.
          7. Keep responses concise and engaging, using bullet points or numbered lists when appropriate.

          User's input: ${userMessage.content}
        `);

        const aiMessage: Message = { 
          id: Date.now().toString(), 
          role: 'assistant', 
          content: result.response.text().trim() 
        };

        setMessages(prev => [...prev, aiMessage])
      } catch (error) {
        console.error("Error generating AI response:", error)
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I apologize, but I encountered an error. Could you please try again?"
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  return (
    <>
      <Button
        className="fixed p-4 transition-all duration-300 rounded-full shadow-lg bottom-6 right-6 hover:shadow-xl bg-primary text-primary-foreground"
        onClick={() => setIsOpen(true)}
      >
        <Brain className="w-6 h-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "fixed z-50 bg-background rounded-lg shadow-xl flex flex-col",
              isFullScreen ? "inset-4" : "bottom-20 right-6 w-96 h-[600px]"
            )}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Career Crafters Assistant</h2>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
                  {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={cn(
                    "flex",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-lg",
                    msg.role === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  )}>
                    <ReactMarkdown 
                      rehypePlugins={[rehypeRaw]}
                      className="text-sm prose dark:prose-invert max-w-none"
                      components={{
                        a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline" />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center p-3 space-x-2 rounded-lg bg-muted">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Assistant is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Career Crafters or your learning journey..." 
                  className="flex-grow resize-none"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e as any)
                    }
                  }}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="rounded-full"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

