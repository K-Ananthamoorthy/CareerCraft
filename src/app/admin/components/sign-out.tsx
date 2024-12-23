'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <Button 
      variant="ghost" 
      className="flex items-center justify-center w-full" 
      onClick={handleSignOut}
    >
      <LogOut className="w-5 h-5 mr-2" />
      Sign Out
    </Button>
  )
}

