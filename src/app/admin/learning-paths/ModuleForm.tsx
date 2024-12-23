import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ModuleFormProps {
  initialData?: {
    title: string
    description: string
    order_index: number
  } | null
  onSubmit: (data: {
    title: string
    description: string
    order_index: number
  }) => void
  onCancel: () => void
}

export default function ModuleForm({
  initialData,
  onSubmit,
  onCancel
}: ModuleFormProps) {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    order_index: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
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
        <div className="space-y-2">
          <Label htmlFor="order_index">Display Order</Label>
          <Input
            id="order_index"
            type="number"
            min="0"
            value={formData.order_index}
            onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
            required
          />
          <p className="text-sm text-muted-foreground">
            This determines the order in which modules are displayed. Lower numbers appear first.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Module
        </Button>
      </div>
    </form>
  )
}

