'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function Footer() {
  const [email, setEmail] = useState('')
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Here you would typically send the email to your API
      console.log('Subscribing email:', email)
      toast({
        title: "Subscribed!",
        description: "You've been added to our newsletter.",
      })
      setEmail('')
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
    }
  }

  return (
    <footer className="py-12 text-white bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">CareerCrafters</h3>
            <p className="text-sm text-blue-100">
              Empowering engineering students with AI-driven learning and career guidance.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-md">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-blue-100 transition-colors hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-blue-100 transition-colors hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-blue-100 transition-colors hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-blue-100 transition-colors hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-md">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-100 transition-colors hover:text-white" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-blue-100 transition-colors hover:text-white" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-blue-100 transition-colors hover:text-white" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-blue-100 transition-colors hover:text-white" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-md">Subscribe to Our Newsletter</h4>
            <form onSubmit={handleSubmit} className="space-y-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-white placeholder-blue-200 bg-white/10 border-white/20"
              />
              <Button type="submit" className="w-full text-blue-600 bg-white hover:bg-blue-100">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="pt-8 mt-8 text-center border-t border-white/20">
          <p className="text-sm text-blue-100">&copy; {new Date().getFullYear()} CareerCrafters. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}