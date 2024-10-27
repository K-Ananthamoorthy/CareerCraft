"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, GraduationCapIcon, MapPinIcon, BookOpenIcon } from "lucide-react"

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

interface ProfileData {
  fullName: string
  dateOfBirth: string
  state: string
  engineeringBranch: string
  collegeYear: string
  collegeNameAndLocation: string
  interests: string
}

export default function StudentProfileForm({ initialProfile }: { initialProfile: ProfileData | null }) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(initialProfile ? "view" : "edit")
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [formData, setFormData] = useState<ProfileData>({
    fullName: "",
    dateOfBirth: "",
    state: "",
    engineeringBranch: "",
    collegeYear: "",
    collegeNameAndLocation: "",
    interests: "",
  })

  useEffect(() => {
    if (initialProfile) {
      setFormData(initialProfile)
    }
  }, [initialProfile])

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

      setActiveTab("view")
      router.refresh()
    } catch (error) {
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src="/placeholder.svg" alt={formData.fullName} />
            <AvatarFallback>{formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{formData.fullName || "Your Name"}</CardTitle>
            <CardDescription>{formData.engineeringBranch || "Your Engineering Branch"}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">View Profile</TabsTrigger>
            <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="view">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p className="text-sm text-muted-foreground">{formData.dateOfBirth}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">State</p>
                    <p className="text-sm text-muted-foreground">{formData.state}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCapIcon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Year of Study</p>
                    <p className="text-sm text-muted-foreground">{formData.collegeYear}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpenIcon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">College</p>
                    <p className="text-sm text-muted-foreground">{formData.collegeNameAndLocation}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">Technical Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.split(',').map((interest, index) => (
                    <span key={index} className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
                      {interest.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="edit">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}