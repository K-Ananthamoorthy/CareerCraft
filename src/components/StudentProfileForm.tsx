"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

const engineeringBranches = [
  "Computer Science and Engineering",
  "Electronics and Communication Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Aerospace Engineering",
  "Biotechnology Engineering",
  "Information Technology",
  "Other"
]

export default function StudentProfileForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    state: "",
    engineeringBranch: "",
    collegeYear: "",
    collegeNameAndLocation: "",
    interests: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error("No user found")

      const { error } = await supabase
        .from("student_profiles")
        .upsert({ 
          user_id: user.id,
          ...formData
        })

      if (error) throw error

      toast({
        title: "Profile Updated",
        description: "Your student profile has been successfully updated.",
      })

      router.push("/dashboard")
    }catch (error) {
      const errorMessage = (error as Error).message || error;
      console.error("Error updating profile:", errorMessage)
      toast({
        title: "Error",
        description: (error as Error).message || "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Engineering Student Profile</CardTitle>
        <CardDescription>Update your personal information and academic details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g., Maharashtra, Tamil Nadu, Karnataka"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="engineeringBranch">Engineering Branch</Label>
            <Select onValueChange={(value) => handleSelectChange("engineeringBranch", value)} value={formData.engineeringBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Select your engineering branch" />
              </SelectTrigger>
              <SelectContent>
                {engineeringBranches.map((branch) => (
                  <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="collegeYear">Year of Study</Label>
            <Select onValueChange={(value) => handleSelectChange("collegeYear", value)} value={formData.collegeYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select your current year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="collegeNameAndLocation">College Name and Location</Label>
            <Input
              id="collegeNameAndLocation"
              name="collegeNameAndLocation"
              value={formData.collegeNameAndLocation}
              onChange={handleChange}
              placeholder="e.g., IIT Delhi, New Delhi"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests">Technical Interests (comma-separated)</Label>
            <Input
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="e.g., Machine Learning, IoT, Robotics"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}