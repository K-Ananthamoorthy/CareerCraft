"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
      setIsLoaded(true) // Ensure this is set after the check
    }
    checkUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  const showFullHeader = isLoaded && isLoggedIn && !['/login', '/register', '/'].includes(pathname)

  return (
    <header className="bg-white shadow">
      <nav className="container flex items-center justify-between px-4 py-4 mx-auto">
        <Link href="#" className="text-xl font-bold">
          AI Learning Platform
        </Link>
        {isLoaded ? (
          showFullHeader ? (
            <div className="space-x-4">
              <Link href="/dashboard" className={`${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-800`}>
                Dashboard
              </Link>
              <Link href="/assessments" className={`${isActive('/assessments') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-800`}>
                Assessments
              </Link>
              <Link href="/learning-paths" className={`${isActive('/learning-paths') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-800`}>
                Learning Paths
              </Link>
              <Link href="/career-recommendations" className={`${isActive('/career-recommendations') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-800`}>
                Career
              </Link>
              <Link href="/profile" className={`${isActive('/profile') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-800`}>
                Profile
              </Link>
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>
          ) : (
            // Show a fallback header if user isn't logged in or loading for those routes
            pathname === '/' && <span>Welcome to AI Learning Platform</span>
          )
        ) : (
          <span>Loading...</span> // Optional loading indicator
        )}
      </nav>
    </header>
  )
}
