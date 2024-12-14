'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import CreatePost from './CreatePost'
import PostList from './PostList'
import { toast } from "@/hooks/use-toast"
import { Users, TrendingUp } from 'lucide-react'

interface SocialUser {
  id: string
  username: string
  full_name: string
  avatar_url: string
}

interface TrendingTag {
  tag: string
  count: number
}

export default function SocialTab() {
  const [user, setUser] = useState<SocialUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [trendingTags, setTrendingTags] = useState<TrendingTag[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchUserProfile()
    fetchTrendingTags()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        let { data, error } = await supabase
          .from('social_users')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error && error.code === 'PGRST116') {
          // If the user doesn't exist in social_users, create a new entry
          const { data: profileData, error: profileError } = await supabase
            .from('student_profiles')
            .select('full_name, avatar_url')
            .eq('user_id', user.id)
            .single()

          if (profileError) throw profileError

          const username = profileData.full_name.toLowerCase().replace(/\s+/g, '_')
          const { data: newUser, error: insertError } = await supabase
            .from('social_users')
            .insert({
              user_id: user.id,
              username: username,
              full_name: profileData.full_name,
              avatar_url: profileData.avatar_url
            })
            .select()
            .single()

          if (insertError) throw insertError
          data = newUser
        } else if (error) {
          throw error
        }

        setUser(data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      toast({
        title: "Error",
        description: "Failed to load user profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchTrendingTags = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('content')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error

      const tags = data.flatMap(post => {
        const matches = post.content.match(/#\w+/g)
        return matches ? matches : []
      })

      const tagCounts = tags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const sortedTags = (Object.entries(tagCounts) as [string, number][])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }))

      setTrendingTags(sortedTags)
    } catch (error) {
      console.error('Error fetching trending tags:', error)
      toast({
        title: "Error",
        description: "Failed to load trending tags. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center p-6">
            <Users className="w-16 h-16 mb-4 text-gray-400" />
            <p className="text-center text-gray-600">
              Please complete your profile to access the social features.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <Card className="w-full mb-8 bg-gradient-to-r from-purple-400 to-pink-500">
        <CardHeader className="text-white">
          <CardTitle className="flex items-center text-2xl font-bold">
            <Users className="mr-2" />
            Social Discussion
          </CardTitle>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <CreatePost user={user} />
          <PostList userId={user.id} />
        </div>
        <div className="md:col-span-1">
          <Card className="bg-white shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                <TrendingUp className="w-5 h-5 mr-2" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {trendingTags.map((tag, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <span className="text-blue-500">#</span>
                      <span>{tag.tag.slice(1)}</span>
                    </span>
                    <span className="text-sm text-gray-500">{tag.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

