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
import { CalendarIcon, GraduationCapIcon, MapPinIcon, BookOpenIcon, Upload, Sparkles, ChevronRight } from 'lucide-react'
import Confetti from 'react-confetti'
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

const engineeringBranches = [
  "Artificial Intelligence and Machine Learning (AIML)",
  "Artificial Intelligence and Data Science (AIDS)",
  "Computer Science and Engineering (CSE)",
  "Electronics and Communication Engineering (ECE)",
  "Mechanical Engineering (MECH)",
  "Civil Engineering (CIVIL)"
];

interface ProfileData {
  id: string
  user_id: string
  fullName: string
  dateOfBirth: string | null
  state: string
  engineeringBranch: string
  collegeYear: string
  collegeNameAndLocation: string
  interests: string
  avatarUrl: string
  age: number
  attendanceRate: number
  averageTestScore: number
  extracurricularScore: number
  codingSkillScore: number
  communicationScore: number
  leadershipScore: number
  internshipExperience: number
  hobbies: string
  goal: string
  activeBacklogs: string
  updated_at: string | null;
}

interface AssessmentResult {
  category: string
  score: number
}

interface PerformanceInsight {
  id: string
  profile_id: string
  prediction_score: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  enhanced_insights: string
  created_at: string
}

export default function StudentProfileForm() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("view")
  const [showConfetti, setShowConfetti] = useState(false)
  const confettiRef = useRef(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [formData, setFormData] = useState<ProfileData>({
    id: "",
    user_id: "",
    fullName: "New User",
    dateOfBirth: null,
    state: "",
    engineeringBranch: "",
    collegeYear: "",
    collegeNameAndLocation: "",
    interests: "",
    avatarUrl: "",
    age: 0,
    attendanceRate: 0,
    averageTestScore: 0,
    extracurricularScore: 0,
    codingSkillScore: 0,
    communicationScore: 0,
    leadershipScore: 0,
    internshipExperience: 0,
    hobbies: "",
    goal: "",
    activeBacklogs: "",
    updated_at: null,
  })

  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([])
  const [performanceInsights, setPerformanceInsights] = useState<PerformanceInsight[]>([])

  useEffect(() => {
    const fetchProfileAndInsights = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Fetch profile
          const { data: profile, error: profileError } = await supabase
            .from('student_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (profileError) throw profileError

          if (profile) {
            setFormData({
              ...formData,
              ...profile,
              fullName: profile.fullName || "New User",
              interests: profile.interests || "",
            })

            // Fetch performance insights separately
            const { data: insights, error: insightsError } = await supabase
              .from('performance_insights')
              .select('*')
              .eq('profile_id', profile.id)
              .order('created_at', { ascending: false })

            if (insightsError) throw insightsError

            if (insights) {
              setPerformanceInsights(insights)
            }
          }

          // Fetch assessment results
          const { data: results, error: resultsError } = await supabase
            .from('assessment_results')
            .select(`
              assessments (
                category
              ),
              score
            `)
            .eq('user_id', user.id)

          if (resultsError) throw resultsError

          if (results) {
            const formattedResults = results.map(result => ({
              category: result.assessments?.[0]?.category || 'Unknown',
              score: result.score
            }))
            setAssessmentResults(formattedResults)
          }
        }
      } catch (error) {
        console.error("Error in fetchProfileAndInsights:", error)
        toast({
          title: "Error",
          description: "Failed to fetch profile data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchProfileAndInsights()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
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
          ...formData,
          // No need to set updated_at manually, it will be handled by the trigger
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

  const renderPerformanceInsights = () => {
    if (performanceInsights.length === 0) {
      return (
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold">Performance Insights</h3>
          <p className="text-muted-foreground">No performance insights available yet.</p>
          <Button 
            onClick={() => router.push('/insights')}
            className="mt-2"
          >
            Get Performance Insights
          </Button>
        </div>
      );
    }

    const latestInsight = performanceInsights[0];
    return (
      <div className="mt-6">
        <h3 className="mb-4 text-lg font-semibold">Latest Performance Insight</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <h4 className="mb-2 font-medium">Prediction Score</h4>
              <div className="flex items-center">
                <Progress 
                  value={latestInsight.prediction_score} 
                  max={100}
                  className="w-full mr-4" 
                />
                <span className="font-bold">
                  {latestInsight.prediction_score.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium">Key Strengths</h4>
                <ul className="space-y-1">
                  {latestInsight.strengths.slice(0, 3).map((strength, index) => (
                    <li key={index} className="text-sm">• {strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium">Areas for Improvement</h4>
                <ul className="space-y-1">
                  {latestInsight.weaknesses.slice(0, 3).map((weakness, index) => (
                    <li key={index} className="text-sm">• {weakness}</li>
                  ))}
                </ul>
              </div>
            </div>
            <Button 
              onClick={() => router.push('/insights')}
              className="mt-4"
            >
              View Full Insights
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <Card className="w-full overflow-hidden">
        <motion.div
          className="relative p-8 text-white bg-gradient-to-r from-purple-600 to-blue-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            {[...Array(50)].map((_, i) => (
              <Sparkles
                key={i}
                className="absolute text-white"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 10 + 5}px`,
                }}
              />
            ))}
          </motion.div>
          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-bold">Unlock Your Academic Potential</h2>
            <p className="mb-6 text-lg">Dive into personalized insights and track your progress with our advanced analytics.</p>
            <Button
              onClick={() => router.push('/insights')}
              variant="secondary"
              size="lg"
              className="group"
            >
              View Performance Insights
              <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </Card>

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
                  <AvatarFallback>
                    {formData.fullName
                      ? formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                      : 'U'}
                  </AvatarFallback>
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
                        <p className="text-sm text-muted-foreground">{formData.dateOfBirth || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">State</p>
                        <p className="text-sm text-muted-foreground">{formData.state || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <GraduationCapIcon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Year of Study</p>
                        <p className="text-sm text-muted-foreground">{formData.collegeYear || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpenIcon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">College</p>
                        <p className="text-sm text-muted-foreground">{formData.collegeNameAndLocation || "Not set"}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Technical Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.interests?.split(',').map((interest, index) => (
                        <span key={index} className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
                          {interest.trim()}
                        </span>
                      )) || <span className="text-muted-foreground">No interests set</span>}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Academic Information</h3>
                    <p>Attendance Rate: {formData.attendanceRate}%</p>
                    <p>Average Test Score: {formData.averageTestScore}/100</p>
                    <p>Internship Experience: {formData.internshipExperience} months</p>
                    <p>Active Backlogs: {formData.activeBacklogs || "None"}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Skills and Scores</h3>
                    {assessmentResults.map((result, index) => (
                      <p key={index}>{result.category}: {result.score.toFixed(2)}/10</p>
                    ))}
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Personal Information</h3>
                    <p>Age: {formData.age}</p>
                    <p>Hobbies: {formData.hobbies || "Not set"}</p>
                    <p>Career Goal: {formData.goal || "Not set"}</p>
                  </div>
                  {renderPerformanceInsights()}
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
                        value={formData.dateOfBirth || ''}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
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
                      <Label htmlFor="attendanceRate">Attendance Rate (%)</Label>
                      <Input
                        id="attendanceRate"
                        name="attendanceRate"
                        type="number"
                        value={formData.attendanceRate}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="averageTestScore">Average Test Score</Label>
                      <Input
                        id="averageTestScore"
                        name="averageTestScore"
                        type="number"
                        value={formData.averageTestScore}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="internshipExperience">Internship Experience (months)</Label>
                      <Input
                        id="internshipExperience"
                        name="internshipExperience"
                        type="number"
                        value={formData.internshipExperience}
                        onChange={handleChange}
                        min="0"
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
                  <div className="space-y-2">
                    <Label htmlFor="hobbies">Hobbies</Label>
                    <Input
                      id="hobbies"
                      name="hobbies"
                      value={formData.hobbies}
                      onChange={handleChange}
                      placeholder="e.g., Reading, Photography, Hiking"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal">Career Goal</Label>
                    <Input
                      id="goal"
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
                      placeholder="e.g., Become a Data Scientist"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activeBacklogs">Active Backlogs (if any)</Label>
                    <Textarea
                      id="activeBacklogs"
                      name="activeBacklogs"
                      value={formData.activeBacklogs}
                      onChange={handleChange}
                      placeholder="Enter subject name and code for any active backlogs"
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
    </div>
  )
}

