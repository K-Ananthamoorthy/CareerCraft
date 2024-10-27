import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-12 bg-gray-100">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-primary">CareerCrafters</h3>
            <p className="text-sm text-muted-foreground">
              Empowering engineering students with AI-driven learning and career guidance.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-md text-primary">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm transition-colors text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-sm transition-colors text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm transition-colors text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm transition-colors text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-md text-primary">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="transition-colors text-muted-foreground hover:text-primary">
                <Facebook size={20} />
              </a>
              <a href="#" className="transition-colors text-muted-foreground hover:text-primary">
                <Twitter size={20} />
              </a>
              <a href="#" className="transition-colors text-muted-foreground hover:text-primary">
                <Linkedin size={20} />
              </a>
              <a href="#" className="transition-colors text-muted-foreground hover:text-primary">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-md text-primary">Subscribe to Our Newsletter</h4>
            <form className="space-y-2">
              <Input type="email" placeholder="Your email" className="w-full" />
              <Button type="submit" className="w-full">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="pt-8 mt-8 text-center border-t border-gray-200">
          <p className="text-sm text-muted-foreground">&copy; 2024 CareerCrafters. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}