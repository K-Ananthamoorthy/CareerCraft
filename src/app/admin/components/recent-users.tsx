'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface StudentProfile {
  id: string
  fullName: string
  email: string
  avatarUrl: string
  created_at: string
}

export function RecentUsers() {
  const [users, setUsers] = useState<StudentProfile[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchRecentUsers() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('student_profiles')
          .select('id, fullName, email, avatarUrl, created_at')
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) throw error
        if (data) setUsers(data)
      } catch (error) {
        console.error('Error fetching recent users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentUsers()
  }, [supabase])

  if (loading) {
    return <div>Loading recent users...</div>
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{(user.fullName ?? '').split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user.fullName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
}

