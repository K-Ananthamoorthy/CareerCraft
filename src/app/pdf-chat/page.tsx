import EnhancedPDFChat from '@/components/PDFChatTab'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PDFChatPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-transparent sm:text-3xl bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            🧠 AI PDF Chat
          </h1>
          <Link href="/study-tools">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Study Tools
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-grow">
        <EnhancedPDFChat />
      </main>
    </div>
  )
}

