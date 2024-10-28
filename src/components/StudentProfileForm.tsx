'use client'

import { useState, useEffect, useRef } from "react"
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
import { CalendarIcon, GraduationCapIcon, MapPinIcon, BookOpenIcon, Upload } from "lucide-react"
import Confetti from 'react-confetti'

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
  avatarUrl: string
}

export default function StudentProfileForm({ initialProfile }: { initialProfile: ProfileData | null }) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("view")
  const [showConfetti, setShowConfetti] = useState(false)
  const confettiRef = useRef(null)
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
    avatarUrl: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from("student_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (error) {
          console.error("Error fetching profile:", error)
        } else if (data) {
          setFormData(data)
        }
      }
    }

    fetchProfile()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      setLoading(true);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User is not authenticated');
      }

      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(data.path);

        if (!publicUrlData) {
          throw new Error('Error fetching public URL');
        }

        const publicUrl = publicUrlData.publicUrl;

        // Encode the URL to handle special characters
        const encodedUrl = encodeURI(publicUrl);
        setFormData(prevData => ({ ...prevData, avatarUrl: encodedUrl }));
        
        toast({
          title: "Success",
          description: "Avatar uploaded successfully.",
        });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      
      // Handle URIError specifically
      if (error instanceof URIError) {
        toast({
          title: "Warning",
          description: "Avatar uploaded, but there might be an issue with the file name. The profile will still be updated.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "There was a problem uploading your avatar. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
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

      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)

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
      <div ref={confettiRef} className="relative">
        {showConfetti && (
          <Confetti
            width={confettiRef.current ? (confettiRef.current as HTMLElement).clientWidth : 300}
            height={confettiRef.current ? (confettiRef.current as HTMLElement).clientHeight : 200}
            recycle={false}
            numberOfPieces={200}
          />
        )}
        <CardHeader>
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="relative">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                <AvatarImage 
                  src={formData.avatarUrl ? decodeURI(formData.avatarUrl) : "/placeholder.svg"} 
                  alt={formData.fullName} 
                />
                <AvatarFallback>{formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              {activeTab === "edit" && (
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1 rounded-full cursor-pointer bg-primary text-primary-foreground">
                  <Upload className="w-4 h-4" />
                  <input id="avatar-upload" type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                </label>
              )}
            </div>
            <div>
              <CardTitle className="text-2xl text-center sm:text-left">{formData.fullName || "Your Name"}</CardTitle>
              <CardDescription className="text-center sm:text-left">{formData.engineeringBranch || "Your Engineering Branch"}</CardDescription>
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      </div>
    </Card>
  )
}