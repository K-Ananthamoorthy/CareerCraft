"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Trash2, Edit, Eye } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

interface StudyPlan {
  id: string;
  subject: string;
  duration: string;
  goals: string;
  plan: string;
  createdAt: number;
}

export default function EnhancedStudyPlanCreatorTool() {
  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState('')
  const [goals, setGoals] = useState('')
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate')
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null)
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedPlans = localStorage.getItem('studyPlans')
    if (savedPlans) {
      setStudyPlans(JSON.parse(savedPlans))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('studyPlans', JSON.stringify(studyPlans))
  }, [studyPlans])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !duration.trim() || !goals.trim()) {
      toast({ title: "Error", description: "Please fill in all fields.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`
        You are an AI study plan creator specialized in developing comprehensive study plans for students.
        Create a detailed study plan based on the following information:
        Subject: ${subject}
        Duration: ${duration}
        Goals: ${goals}
        Difficulty: ${difficulty}

        Create a detailed study plan that includes:
        1. An overview of the subject and main topics to be covered
        2. A weekly breakdown of study activities and topics
        3. Recommended resources including textbooks, online courses, and reference materials
        4. Suggested study techniques and strategies
        5. Milestones and progress checkpoints
        6. Tips for maintaining motivation and avoiding burnout
        7. A method for tracking progress and self-assessment, including practice questions and mock tests
        8. Preparation strategies for various types of assessments
        9. Integration of practical components and laboratory work, if applicable
        10. Suggestions for group study sessions and peer learning opportunities
        11. Guidance on balancing this subject with other coursework and extracurricular activities
        12. Recommendations for exam preparation, including strategies for tackling different question types

        Format your response as a JSON object with the following structure:
        {
          "overview": "Brief overview of the subject",
          "weeklyPlan": [
            {
              "week": 1,
              "topics": ["Topic 1", "Topic 2"],
              "activities": ["Activity 1", "Activity 2"]
            },
            ...
          ],
          "resources": ["Resource 1", "Resource 2", ...],
          "studyTechniques": ["Technique 1", "Technique 2", ...],
          "milestones": ["Milestone 1", "Milestone 2", ...],
          "motivationTips": ["Tip 1", "Tip 2", ...],
          "progressTracking": "Description of progress tracking method",
          "assessmentStrategies": ["Strategy 1", "Strategy 2", ...],
          "practicalWork": "Description of practical components, if applicable",
          "groupStudy": "Suggestions for group study",
          "balancingTips": ["Tip 1", "Tip 2", ...],
          "examPreparation": ["Strategy 1", "Strategy 2", ...]
        }
      `);
      const response = await result.response;
      const cleanedResponse = response.text().replace(/^```json\n|\n```$/g, '');
      const parsedPlan = JSON.parse(cleanedResponse);
      const newStudyPlan: StudyPlan = {
        id: Date.now().toString(),
        subject,
        duration,
        goals,
        plan: JSON.stringify(parsedPlan),
        createdAt: Date.now(),
      };
      setStudyPlan(newStudyPlan);
      setStudyPlans(prev => [...prev, newStudyPlan]);
      toast({ title: "Success", description: "Study plan created successfully.", variant: "default" })
    } catch (error) {
      console.error("Error creating study plan:", error);
      toast({ title: "Error", description: "An error occurred while creating the study plan. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePlan = (id: string) => {
    setStudyPlans(prev => prev.filter(plan => plan.id !== id))
    toast({ title: "Success", description: "Study plan deleted successfully.", variant: "default" })
  }

  const renderStudyPlan = (plan: StudyPlan) => {
    const parsedPlan = JSON.parse(plan.plan);
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">{plan.subject}</h3>
        <p><strong>Duration:</strong> {plan.duration}</p>
        <p><strong>Goals:</strong> {plan.goals}</p>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="overview">
            <AccordionTrigger>Overview</AccordionTrigger>
            <AccordionContent>{parsedPlan.overview}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="weeklyPlan">
            <AccordionTrigger>Weekly Plan</AccordionTrigger>
            <AccordionContent>
              {parsedPlan.weeklyPlan.map((week: any, index: number) => (
                <div key={index} className="mb-2">
                  <h4 className="font-semibold">Week {week.week}</h4>
                  <p><strong>Topics:</strong> {week.topics.join(", ")}</p>
                  <p><strong>Activities:</strong> {week.activities.join(", ")}</p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="resources">
            <AccordionTrigger>Resources</AccordionTrigger>
            <AccordionContent>
              <ul className="pl-5 list-disc">
                {parsedPlan.resources.map((resource: string, index: number) => (
                  <li key={index}>{resource}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="studyTechniques">
            <AccordionTrigger>Study Techniques</AccordionTrigger>
            <AccordionContent>
              <ul className="pl-5 list-disc">
                {parsedPlan.studyTechniques.map((technique: string, index: number) => (
                  <li key={index}>{technique}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="milestones">
            <AccordionTrigger>Milestones</AccordionTrigger>
            <AccordionContent>
              <ul className="pl-5 list-disc">
                {parsedPlan.milestones.map((milestone: string, index: number) => (
                  <li key={index}>{milestone}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="motivationTips">
            <AccordionTrigger>Motivation Tips</AccordionTrigger>
            <AccordionContent>
              <ul className="pl-5 list-disc">
                {parsedPlan.motivationTips.map((tip: string, index: number) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="progressTracking">
            <AccordionTrigger>Progress Tracking</AccordionTrigger>
            <AccordionContent>{parsedPlan.progressTracking}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="assessmentStrategies">
            <AccordionTrigger>Assessment Strategies</AccordionTrigger>
            <AccordionContent>
              <ul className="pl-5 list-disc">
                {parsedPlan.assessmentStrategies.map((strategy: string, index: number) => (
                  <li key={index}>{strategy}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="practicalWork">
            <AccordionTrigger>Practical Work</AccordionTrigger>
            <AccordionContent>{parsedPlan.practicalWork}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="groupStudy">
            <AccordionTrigger>Group Study</AccordionTrigger>
            <AccordionContent>{parsedPlan.groupStudy}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="balancingTips">
            <AccordionTrigger>Balancing Tips</AccordionTrigger>
            <AccordionContent>
              <ul className="pl-5 list-disc">
                {parsedPlan.balancingTips.map((tip: string, index: number) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="examPreparation">
            <AccordionTrigger>Exam Preparation</AccordionTrigger>
            <AccordionContent>
              <ul className="pl-5 list-disc">
                {parsedPlan.examPreparation.map((strategy: string, index: number) => (
                  <li key={index}>{strategy}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    )
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Enhanced Study Plan Creator Tool</h1>
      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create Plan</TabsTrigger>
          <TabsTrigger value="manage">Manage Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Study Plan Creator</CardTitle>
              <CardDescription>Enter details to create a new study plan</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject:</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Advanced Control Systems, Computer Networks, Structural Engineering..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Study Duration:</Label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 1 semester, 3 months, 1 year..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goals">Study Goals:</Label>
                  <Textarea
                    id="goals"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    placeholder="List your specific learning objectives, exam targets, or skill development goals..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level:</Label>
                  <Select value={difficulty} onValueChange={(value: 'Beginner' | 'Intermediate' | 'Advanced') => setDifficulty(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Create Study Plan
                </Button>
              </form>
            </CardContent>
          </Card>
          {studyPlan && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Generated Study Plan</CardTitle>
              </CardHeader>
              <CardContent>
                {renderStudyPlan(studyPlan)}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Study Plans</CardTitle>
              <CardDescription>View and manage your created study plans</CardDescription>
            </CardHeader>
            <CardContent>
              {studyPlans.length === 0 ? (
                <p>No study plans created yet.</p>
              ) : (
                <div className="space-y-4">
                  {studyPlans.map((plan) => (
                    <Card key={plan.id}>
                      <CardHeader>
                        <CardTitle>{plan.subject}</CardTitle>
                        <CardDescription>Created on: {new Date(plan.createdAt).toLocaleString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p><strong>Duration:</strong> {plan.duration}</p>
                        <p><strong>Goals:</strong> {plan.goals}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline"><Eye className="w-4 h-4 mr-2" /> View</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{plan.subject}</DialogTitle>
                              <DialogDescription>Created on: {new Date(plan.createdAt).toLocaleString()}</DialogDescription>
                            </DialogHeader>
                            {renderStudyPlan(plan)}
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" onClick={() => handleDeletePlan(plan.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

