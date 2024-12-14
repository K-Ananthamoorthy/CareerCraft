"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, ImageIcon, Send, Bot, User, Sparkles, ArrowLeft } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { GoogleGenerativeAI } from "@google/generative-ai"
import ReactMarkdown from 'react-markdown'
import { useRouter } from 'next/navigation'
import { useTypingEffect } from '@/hooks/use-typing-effect'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")

interface ChatMessage {
  sender: 'user' | 'ai'
  message: string
}

export default function AIImageAnalyzer() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const lastAiMessage = chatMessages[chatMessages.length - 1]?.sender === 'ai' 
    ? chatMessages[chatMessages.length - 1].message 
    : ''
  const typedMessage = useTypingEffect(lastAiMessage, isTyping)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages, typedMessage])

  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        })
        return
      }
      setSelectedImage(file)
      setImageUrl(URL.createObjectURL(file))
      setChatMessages([])
    }
  }, [toast])

  const analyzeImage = useCallback(async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setIsTyping(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      const imageData = await fileToGenerativePart(selectedImage)
      const result = await model.generateContent([
        "You are an expert image analyst. Analyze this image and provide a detailed description. Include information about the main elements, colors, composition, and any notable features or text visible in the image. If applicable, suggest potential uses or contexts for this image.",
        imageData
      ])
      const response = await result.response
      setChatMessages([{ sender: 'ai', message: response.text() }])
    } catch (error) {
      console.error('Error analyzing image:', error)
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing the image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
      setIsTyping(false)
    }
  }, [selectedImage, toast])

  const handleSendMessage = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userInput.trim() || !selectedImage) return

    const userMessage = userInput.trim()
    setChatMessages(prev => [...prev, { sender: 'user', message: userMessage }])
    setUserInput('')
    setIsTyping(true)

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const imageData = await fileToGenerativePart(selectedImage)
      const result = await model.generateContent([
        "You are an expert image analyst. The user has asked the following question about the image: " + userMessage,
        imageData
      ])
      const response = await result.response
      setChatMessages(prev => [...prev, { sender: 'ai', message: response.text() }])
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Message failed",
        description: "There was an error processing your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTyping(false)
    }
  }, [userInput, selectedImage, toast])

  const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string, mimeType: string } }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result as string
        resolve({
          inlineData: {
            data: base64data.split(',')[1],
            mimeType: file.type
          }
        })
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-transparent sm:text-3xl bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            🧠 AI Image Analyzer Beta
          </h1>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push('/study-tools')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Study Tools
          </Button>
        </div>
      </header>
      <main className="container flex-grow px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="transition-shadow duration-300 bg-white shadow-lg hover:shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                <ImageIcon className="w-6 h-6 mr-2 text-purple-500" />
                Upload Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-48 transition-all duration-300 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer sm:h-64 bg-purple-50 hover:bg-purple-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-purple-500 sm:w-12 sm:h-12" />
                    <p className="mb-2 text-sm text-purple-700"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-purple-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} ref={fileInputRef} />
                </label>
              </div>
              {imageUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6"
                >
                  <img src={imageUrl} alt="Uploaded image" className="h-auto max-w-full rounded-lg shadow-md" />
                  <Button onClick={analyzeImage} className="w-full mt-4 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" disabled={isAnalyzing}>
                    {isAnalyzing ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Card className="transition-shadow duration-300 bg-white shadow-lg hover:shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                <Bot className="w-6 h-6 mr-2 text-pink-500" />
                Analysis & Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[calc(100vh-24rem)] overflow-y-auto mb-4 space-y-4 p-4 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100" ref={chatContainerRef}>
                <AnimatePresence>
                  {chatMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                        msg.sender === 'user' 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <div className="flex items-center mb-1">
                          {msg.sender === 'user' ? (
                            <User className="w-4 h-4 mr-2" />
                          ) : (
                            <Bot className="w-4 h-4 mr-2" />
                          )}
                          <span className="text-sm font-semibold">{msg.sender === 'user' ? 'You' : 'AI'}</span>
                        </div>
                        <ReactMarkdown 
                          className="text-sm prose max-w-none dark:prose-invert"
                          components={{
                            p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                            ul: ({ node, ...props }) => <ul className="pl-4 mb-2 list-disc" {...props} />,
                            ol: ({ node, ...props }) => <ol className="pl-4 mb-2 list-decimal" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                            h1: ({ node, ...props }) => <h1 className="mb-2 text-xl font-bold" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="mb-2 text-lg font-semibold" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="mb-2 text-base font-medium" {...props} />,
                            code: ({ node, ...props }) => <code className="px-1 bg-gray-200 rounded dark:bg-gray-700" {...props} />,
                            pre: ({ node, ...props }) => <pre className="p-2 overflow-x-auto bg-gray-200 rounded dark:bg-gray-700" {...props} />,
                          }}
                        >
                          {msg.sender === 'ai' && index === chatMessages.length - 1 ? typedMessage : msg.message}
                        </ReactMarkdown>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="p-3 text-gray-800 bg-gray-100 rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <Bot className="w-4 h-4 mr-2" />
                        <span className="text-sm font-semibold">AI</span>
                      </div>
                      <div className="mt-1">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            transition: { repeat: Infinity, duration: 0.5 }
                          }}
                          className="flex space-x-1"
                        >
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <form onSubmit={handleSendMessage} className="mt-4">
                <div className="flex space-x-2">
                  <Textarea 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask a question about the image... 🤔"
                    className="flex-grow border-purple-300 resize-none focus:border-purple-500 focus:ring focus:ring-purple-200"
                    rows={2}
                  />
                  <Button 
                    type="submit" 
                    disabled={!selectedImage || isTyping}
                    className="self-end text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

