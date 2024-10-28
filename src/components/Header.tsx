'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Menu, LogOut, User as UserIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
      if (user) {
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      }
      setIsLoaded(true)
    }
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null)
        if (session?.user) {
          localStorage.setItem('user', JSON.stringify(session.user))

        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        localStorage.removeItem('user')
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
    localStorage.removeItem('user')
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  const showFullHeader = isLoaded && user && !['/login', '/register', '/'].includes(pathname)

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/assessment', label: 'Assessments' },
    { href: '/learning-paths', label: 'Learning Paths' },
    { href: '/career-recommendations', label: 'Career' },
  ]

  return (
    <header className="sticky top-0 z-50 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600">
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative w-8 h-8 rounded-full">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user?.user_metadata?.avatar_url || '/placeholder.svg'} alt={user?.email || 'User avatar'} />
                          <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <UserIcon className="w-4 h-4 mr-2" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="w-full">
                          <UserIcon className="w-4 h-4 mr-2" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut} className="w-full">
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