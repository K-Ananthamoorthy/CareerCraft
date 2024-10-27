"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
      setIsLoaded(true)
    }
    checkUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  const showFullHeader = isLoaded && isLoggedIn && !['/login', '/register', '/'].includes(pathname)

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/assessment', label: 'Assessments' },
    { href: '/learning-paths', label: 'Learning Paths' },
    { href: '/career-recommendations', label: 'Career' },
    { href: '/profile', label: 'Profile' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <nav className="container px-4 py-4 mx-auto">
        <div className="flex items-center justify-between">
          <Link href="#" className="text-xl font-bold text-primary">
          CareerCrafters
          </Link>
          {isLoaded ? (
            showFullHeader ? (
              <>
                <div className="hidden space-x-4 md:flex">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`${
                        isActive(item.href) ? 'text-primary' : 'text-muted-foreground'
                      } hover:text-primary transition-colors`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Button onClick={handleSignOut} variant="outline">
                    Sign Out
                  </Button>
                </div>
                <div className="md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                  </Button>
                </div>
              </>
            ) : (
              pathname === '/' && (
                <span className="text-muted-foreground"></span>
              )
            )
          ) : (
            <span className="text-muted-foreground">Loading...</span>
          )}
        </div>
        {showFullHeader && isMobileMenuOpen && (
          <div className="mt-4 space-y-2 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2 px-4 rounded ${
                  isActive(item.href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                } hover:bg-primary/5 transition-colors`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </div>
        )}
      </nav>
    </header>
  )
}