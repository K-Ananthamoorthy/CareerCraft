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
    <footer className="py-6 text-white bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container px-4 mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <h3 className="mb-2 text-lg font-semibold">CareerCrafters</h3>
            <p className="mb-4 text-sm text-blue-100">
              Empowering engineering students with AI-driven learning.
            </p>
            <form onSubmit={handleSubmit} className="flex max-w-md space-x-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-white placeholder-blue-200 bg-white/10 border-white/20"
              />
              <Button type="submit" variant="secondary">Subscribe</Button>
            </form>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="text-sm text-blue-100 transition-colors hover:text-white">About Us</Link>
              <Link href="/contact" className="text-sm text-blue-100 transition-colors hover:text-white">Contact</Link>
              <Link href="/privacy" className="text-sm text-blue-100 transition-colors hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-blue-100 transition-colors hover:text-white">Terms of Service</Link>
            </nav>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Connect With Us</h4>
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
        </div>
        <div className="pt-4 mt-6 text-center border-t border-white/20">
          <p className="text-sm text-blue-100">&copy; {new Date().getFullYear()} CareerCrafters. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}