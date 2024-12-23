'use client'

import { useState } from 'react'
import { StudentProfile } from '@/types/student-profile'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateUser } from '@/app/actions/user-actions'
import { toast } from "@/hooks/use-toast"

interface EditUserFormProps {
  user: StudentProfile
  onClose: () => void
}

export function EditUserForm({ user, onClose }: EditUserFormProps) {
  const [formData, setFormData] = useState(user)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUser(user.id, formData)
      toast({
        title: "Success",
        description: "User updated successfully",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="engineeringBranch">Engineering Branch</Label>
          <Input
            id="engineeringBranch"
            name="engineeringBranch"
            value={formData.engineeringBranch}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="collegeYear">College Year</Label>
          <Input
            id="collegeYear"
            name="collegeYear"
            value={formData.collegeYear}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="collegeNameAndLocation">College Name and Location</Label>
        <Input
          id="collegeNameAndLocation"
          name="collegeNameAndLocation"
          value={formData.collegeNameAndLocation}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="skills">Skills</Label>
        <Textarea
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="dream_companies">Dream Companies</Label>
        <Textarea
          id="dream_companies"
          name="dream_companies"
          value={formData.dream_companies}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  )
}

