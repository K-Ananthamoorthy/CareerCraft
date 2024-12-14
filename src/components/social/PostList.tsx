'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, MessageCircle, Repeat, Sparkles, Send, Trash2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface Post {
  id: string
  content: string
  created_at: string
  ai_enhanced: boolean
  author: {
    id: string
    username: string
    full_name: string
    avatar_url: string
  }
  likes_count: number
  comments_count: number
  reposts_count: number
  liked_by_user: boolean
  reposted_by_user: boolean
  comments: Comment[]
}

interface Comment {
  id: string
  content: string
  created_at: string
  author: {
    id: string
    username: string
    full_name: string
    avatar_url: string
  }
}

interface PostListProps {
  userId: string
}

export default function PostList({ userId }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [newComment, setNewComment] = useState<string>('')
  const supabase = createClientComponentClient()

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:social_users(*),
          comments:comments(*, author:social_users(*)),
          likes:likes(user_id),
          reposts:reposts(user_id)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedPosts = data.map(formatPost)
      setPosts(formattedPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      })
    }
  }, [supabase])

  useEffect(() => {
    fetchPosts()
    const channel = setupRealTimeSubscriptions()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchPosts, supabase])

  const setupRealTimeSubscriptions = () => {
    return supabase
      .channel('realtime posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, handlePostChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, handleCommentChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, handleLikeChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reposts' }, handleRepostChange)
      .subscribe()
  }

  const formatPost = (post: any): Post => ({
    ...post,
    liked_by_user: post.likes.some((like: any) => like.user_id === userId),
    reposted_by_user: post.reposts.some((repost: any) => repost.user_id === userId),
    likes_count: post.likes.length,
    reposts_count: post.reposts.length,
    comments_count: post.comments.length
  })

  const handlePostChange = async (payload: any) => {
    if (payload.eventType === 'INSERT') {
      const { data: newPost, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:social_users(*),
          comments:comments(*, author:social_users(*)),
          likes:likes(user_id),
          reposts:reposts(user_id)
        `)
        .eq('id', payload.new.id)
        .single()

      if (error) {
        console.error('Error fetching new post:', error)
        return
      }

      setPosts(prevPosts => [formatPost(newPost), ...prevPosts])
    } else if (payload.eventType === 'DELETE') {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== payload.old.id))
    }
  }

  const handleCommentChange = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === payload.new.post_id) {
          return {
            ...post,
            comments: [...post.comments, payload.new],
            comments_count: post.comments_count + 1
          }
        }
        return post
      }))
    } else if (payload.eventType === 'DELETE') {
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === payload.old.post_id) {
          return {
            ...post,
            comments: post.comments.filter(comment => comment.id !== payload.old.id),
            comments_count: post.comments_count - 1
          }
        }
        return post
      }))
    }
  }

  const handleLikeChange = (payload: any) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === payload.new.post_id) {
        const likeChange = payload.eventType === 'INSERT' ? 1 : -1
        const userLiked = payload.eventType === 'INSERT' && payload.new.user_id === userId
        const userUnliked = payload.eventType === 'DELETE' && payload.old.user_id === userId
        return {
          ...post,
          likes_count: post.likes_count + likeChange,
          liked_by_user: userLiked ? true : (userUnliked ? false : post.liked_by_user)
        }
      }
      return post
    }))
  }

  const handleRepostChange = (payload: any) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === payload.new.post_id) {
        const repostChange = payload.eventType === 'INSERT' ? 1 : -1
        const userReposted = payload.eventType === 'INSERT' && payload.new.user_id === userId
        const userUnreposted = payload.eventType === 'DELETE' && payload.old.user_id === userId
        return {
          ...post,
          reposts_count: post.reposts_count + repostChange,
          reposted_by_user: userReposted ? true : (userUnreposted ? false : post.reposted_by_user)
        }
      }
      return post
    }))
  }

  const handleLike = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return

      if (post.liked_by_user) {
        await supabase
          .from('likes')
          .delete()
          .match({ user_id: userId, post_id: postId })
      } else {
        await supabase
          .from('likes')
          .insert({ user_id: userId, post_id: postId })
      }
    } catch (error) {
      console.error('Error liking post:', error)
      toast({
        title: "Error",
        description: "Failed to like the post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRepost = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return

      if (post.reposted_by_user) {
        await supabase
          .from('reposts')
          .delete()
          .match({ user_id: userId, post_id: postId })
      } else {
        await supabase
          .from('reposts')
          .insert({ user_id: userId, post_id: postId })
      }
    } catch (error) {
      console.error('Error reposting:', error)
      toast({
        title: "Error",
        description: "Failed to repost. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleComment = async (postId: string) => {
    if (!newComment.trim()) return

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({ post_id: postId, author_id: userId, content: newComment })
        .select('*, author:social_users(*)')
        .single()

      if (error) throw error

      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, data],
            comments_count: post.comments_count + 1
          }
        }
        return post
      }))

      setNewComment('')
    } catch (error) {
      console.error('Error commenting:', error)
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .match({ id: postId, author_id: userId })

      if (error) throw error

      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))

      toast({
        title: "Success",
        description: "Post deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        title: "Error",
        description: "Failed to delete the post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (commentId: string, postId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .match({ id: commentId, author_id: userId })

      if (error) throw error

      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter(comment => comment.id !== commentId),
            comments_count: post.comments_count - 1
          }
        }
        return post
      }))

      toast({
        title: "Success",
        description: "Comment deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast({
        title: "Error",
        description: "Failed to delete the comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="transition-shadow duration-200 bg-white shadow-lg dark:bg-gray-800 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center space-x-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
            <Avatar className="w-12 h-12 border-2 border-white dark:border-gray-800">
              <AvatarImage src={post.author.avatar_url} />
              <AvatarFallback>{post.author.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <CardTitle className="text-lg font-bold">{post.author.full_name}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{post.author.username}</p>
            </div>
            {post.ai_enhanced && (
              <span className="ml-auto" title="AI Enhanced">
                <Sparkles className="w-5 h-5 text-purple-500" />
              </span>
            )}
            {post.author.id === userId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeletePost(post.id)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="ghost" 
              onClick={() => handleLike(post.id)}
              className={`flex items-center ${post.liked_by_user ? "text-blue-500" : "text-gray-500 hover:text-blue-500"}`}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              <span>{post.likes_count}</span>
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleRepost(post.id)}
              className={`flex items-center ${post.reposted_by_user ? "text-green-500" : "text-gray-500 hover:text-green-500"}`}
            >
              <Repeat className="w-4 h-4 mr-2" />
              <span>{post.reposts_count}</span>
            </Button>
            <Button 
              variant="ghost"
              className="flex items-center text-gray-500 hover:text-purple-500"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span>{post.comments_count}</span>
            </Button>
          </CardFooter>
          <CardContent className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4 space-x-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow transition-colors border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500"
              />
              <Button onClick={() => handleComment(post.id)} className="text-white bg-purple-500 hover:bg-purple-600">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {post.comments.map((comment) => (
              <div key={comment.id} className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.author.avatar_url} />
                      <AvatarFallback>{comment.author.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{comment.author.full_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">@{comment.author.username}</p>
                    </div>
                  </div>
                  {comment.author.id === userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id, post.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">{comment.content}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

