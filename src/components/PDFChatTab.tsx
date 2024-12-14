"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, FileText, Send, Bot, User } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from 'react-markdown'
import { useTypingEffect } from '@/hooks/use-typing-effect'
import * as pdfjsLib from 'pdfjs-dist'
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function PDFChatTab() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [pdfContent, setPdfContent] = useState<string>('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const lastAiMessage = chatMessages[chatMessages.length - 1]?.role === 'assistant' 
    ? chatMessages[chatMessages.length - 1].content 
    : ''
  const typedMessage = useTypingEffect(lastAiMessage, isTyping)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages, typedMessage])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        })
        return
      }
      setSelectedFile(file)
      setIsAnalyzing(true)
      try {
        const content = await extractTextFromPDF(file)
        setPdfContent(content)
        setChatMessages([{ role: 'assistant', content: "I've analyzed the PDF. What would you like to know about it?" }])
      } catch (error) {
        console.error('Error extracting PDF content:', error)
        toast({
          title: "PDF Analysis Failed",
          description: "There was an error analyzing the PDF. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsAnalyzing(false)
      }
    }
  }

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer()
    const pdf: PDFDocumentProxy = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ''

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(' ')
      fullText += pageText + '\n'
    }

    return fullText
  }

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userInput.trim() || !selectedFile) return

    const userMessage = userInput.trim()
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setUserInput('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/pdf-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...chatMessages, { role: 'user', content: userMessage }],
          pdfContent,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch from API')
      }

      const data = await response.json()
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.content }])
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
  }

  return (
    <Card className="transition-shadow duration-300 bg-white shadow-lg hover:shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <FileText className="w-6 h-6 mr-2 text-purple-500" />
          PDF Chat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label htmlFor="pdf-upload" className="flex flex-col items-center justify-center w-full h-32 transition-all duration-300 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-purple-500" />
              <p className="mb-2 text-sm text-purple-700"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-purple-500">PDF files only</p>
            </div>
            <Input id="pdf-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} ref={fileInputRef} />
          </label>
        </div>
        {selectedFile && <p className="mb-4 text-sm text-purple-600">Selected file: {selectedFile.name}</p>}
        <div className="h-[calc(100vh-24rem)] overflow-y-auto mb-4 space-y-4 p-4 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100" ref={chatContainerRef}>
          <AnimatePresence>
            {chatMessages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="flex items-center mb-1">
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 mr-2" />
                    ) : (
                      <Bot className="w-4 h-4 mr-2" />
                    )}
                    <span className="text-sm font-semibold">{msg.role === 'user' ? 'You' : 'AI'}</span>
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
                    {msg.role === 'assistant' && index === chatMessages.length - 1 ? typedMessage : msg.content}
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
              placeholder="Ask a question about the PDF... 🤔"
              className="flex-grow border-purple-300 resize-none focus:border-purple-500 focus:ring focus:ring-purple-200"
              rows={2}
            />
            <Button 
              type="submit" 
              disabled={!selectedFile || isTyping}
              className="self-end text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

