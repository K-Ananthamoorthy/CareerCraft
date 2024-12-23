import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LearningPathFormProps {
  initialData?: {
    title: string
    description: string
    duration: string
    level: string
    slug: string
    youtube_video_url: string // New field
  } | null
  onSubmit: (data: {
    title: string
    description: string
    duration: string
    level: string
    slug: string
    youtube_video_url: string // New field
  }) => void
  onCancel: () => void
}

export default function LearningPathForm({
  initialData,
  onSubmit,
  onCancel
}: LearningPathFormProps) {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    duration: '',
    level: '',
    slug: '',
    youtube_video_url: '' // New field
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        {/* Existing fields */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select
              value={formData.level}
              onValueChange={(value) => setFormData({ ...formData, level: value })}
            >
              <SelectTrigger id="level">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL Name (Slug)</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            placeholder="example-path-name"
          />
          <p className="text-sm text-muted-foreground">
            This will be used in the URL. Use lowercase letters, numbers, and hyphens only.
          </p>
        </div>
        {/* New YouTube video URL field */}
        <div className="space-y-2">
          <Label htmlFor="youtube_video_url">YouTube Video URL</Label>
          <Input
            id="youtube_video_url"
            value={formData.youtube_video_url}
            onChange={(e) => setFormData({ ...formData, youtube_video_url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p className="text-sm text-muted-foreground">
            Enter the Video ID  of the YouTube video for this learning path.(ex:https://youtu.be/erEgovG9WBs =video id"erEgovG9WBs")
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Learning Path
        </Button>
      </div>
    </form>
  )
}

