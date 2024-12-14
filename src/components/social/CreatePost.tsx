'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Sparkles, Send, X } from 'lucide-react'
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")

interface User {
  id: string
  username: string
  full_name: string
  avatar_url: string
}

interface CreatePostProps {
  user: User
}

export default function CreatePost({ user }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [enhancedContent, setEnhancedContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [showEnhanced, setShowEnhanced] = useState(false)
  const supabase = createClientComponentClient()

  const enhancePostWithAI = async (content: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(
        `Enhance this social media post to make it more engaging and appealing. Correct any grammatical errors, improve vocabulary, and enhance sentence structure. Add relevant emojis where appropriate. Keep the original meaning and tone. Ensure the output is clean, without asterisks or unwanted characters. Format the response as a single, well-structured paragraph:

        "${content}"`
      );
      const response = await result.response;
      return response.text().replace(/^\s*[\"\']|[\"\']\s*$/g, ''); // Remove leading/trailing quotes if present
    } catch (error) {
      console.error("Error enhancing post with AI:", error);
      return content;
    }
  };

  const handleEnhance = async () => {
    if (!content.trim()) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhancePostWithAI(content);
      setEnhancedContent(enhanced);
      setShowEnhanced(true);
    } catch (error) {
      console.error('Error enhancing post:', error);
      toast({
        title: "Error",
        description: "Failed to enhance post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = async (useEnhanced: boolean = false) => {
    if (!content.trim() && !enhancedContent.trim()) return;

    setIsPosting(true);
    try {
      const finalContent = useEnhanced ? enhancedContent : content;
      const { error } = await supabase
        .from('posts')
        .insert({ author_id: user.id, content: finalContent, ai_enhanced: useEnhanced });

      if (error) throw error;

      setContent('');
      setEnhancedContent('');
      setShowEnhanced(false);
      toast({
        title: "Success",
        description: useEnhanced ? "Your AI-enhanced post has been published." : "Your post has been published.",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="mb-6 bg-white shadow-lg dark:bg-gray-800">
      <CardHeader className="text-white bg-gradient-to-r from-purple-400 to-pink-500">
        <CardTitle className="flex items-center">
          <Send className="mr-2" />
          Create a Post
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="mb-4 transition-colors border-2 border-purple-200 focus:border-purple-500"
        />
        <div className="flex items-center justify-between">
          <Button
            type="button"
            onClick={handleEnhance}
            disabled={isEnhancing || isPosting || !content.trim()}
            className="text-white transition-all duration-200 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            {isEnhancing ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance with AI
              </>
            )}
          </Button>
          <Button
            onClick={() => handleSubmit(false)}
            disabled={isPosting || !content.trim()}
            className="text-white transition-colors duration-200 bg-green-500 hover:bg-green-600"
          >
            {isPosting ? 'Posting...' : 'Post'}
          </Button>
        </div>
        {showEnhanced && (
          <div className="p-4 mt-4 bg-gray-100 rounded-lg dark:bg-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-purple-600 dark:text-purple-400">AI Enhanced Version</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEnhanced(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-800 dark:text-gray-200">{enhancedContent}</p>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => handleSubmit(true)}
                disabled={isPosting}
                className="text-white transition-colors duration-200 bg-purple-500 hover:bg-purple-600"
              >
                Post Enhanced Version
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

