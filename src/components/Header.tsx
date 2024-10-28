'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Menu, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoaded(true)
    }
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null)
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        })
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        toast({
          title: "Signed Out",
          description: "You have been successfully logged out.",
        })
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth, toast])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  const showFullHeader = isLoaded && user && !['/login', '/register', '/'].includes(pathname)

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/assessment', label: 'Assessments' },
    { href: '/learning-paths', label: 'Learning Paths' },
    { href: '/career-recommendations', label: 'Career' },
    { href: '/profile', label: 'Profile' },
  ]

  return (
    <header className="sticky top-0 z-50 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600">
      <nav className="container px-4 py-4 mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white transition-colors hover:text-blue-100">
            CareerCrafters
          </Link>
          {isLoaded ? (
            showFullHeader ? (
              <>
                <div className="items-center hidden space-x-1 md:flex">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive(item.href) 
                          ? 'bg-white/20 text-white' 
                          : 'text-blue-100 hover:bg-white/10 hover:text-white'
                      } transition-all duration-200`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Button 
                    onClick={handleSignOut} 
                    variant="ghost" 
                    className="text-blue-100 hover:bg-white/10 hover:text-white"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <Menu className="w-5 h-5" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      {navItems.map((item) => (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link
                            href={item.href}
                            className={`w-full ${isActive(item.href) ? 'bg-blue-100' : ''}`}
                          >
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              pathname === '/' && (
                <span className="text-blue-100"></span>
              )
            )
          ) : (
            <span className="text-blue-100">Loading...</span>
          )}
        </div>
      </nav>
    </header>
  )
}