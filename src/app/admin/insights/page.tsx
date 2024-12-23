'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Search, TrendingUp, Award, AlertTriangle, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface PerformanceInsight {
  id: string
  user_id: string
  profile_id: string
  prediction_score: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  enhanced_insights: string
  created_at: string
  student_profile: {
    fullName: string
    email: string
    avatarUrl: string
    engineeringBranch: string
    collegeYear: string
  }
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<PerformanceInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInsight, setSelectedInsight] = useState<PerformanceInsight | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchInsights()
  }, [])

  async function fetchInsights() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('performance_insights')
        .select(`
          *,
          student_profile:profile_id (
            fullName,
            email,
            avatarUrl,
            engineeringBranch,
            collegeYear
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setInsights(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch performance insights",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function deleteInsight(id: string) {
    try {
      const { error } = await supabase
        .from('performance_insights')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setInsights(insights.filter(insight => insight.id !== id))
      toast({
        title: "Success",
        description: "Insight deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete insight",
        variant: "destructive",
      })
    }
  }

  const filteredInsights = insights.filter(insight => 
    insight.student_profile?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insight.student_profile?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insight.student_profile?.engineeringBranch?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedInsights = filteredInsights.reduce((acc, insight) => {
    const userName = insight.student_profile?.fullName || 'Unknown User';
    if (!acc[userName]) {
      acc[userName] = [];
    }
    acc[userName].push(insight);
    return acc;
  }, {} as Record<string, PerformanceInsight[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6 space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name, email, or branch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            Object.entries(groupedInsights).map(([userName, userInsights]) => (
              <Card key={userName} className="mb-6">
                <CardHeader>
                  <CardTitle>{userName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {userInsights[0].student_profile?.email} - {userInsights[0].student_profile?.engineeringBranch}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {userInsights.map((insight) => (
                      <Card key={insight.id} className="relative">
                        <CardContent className="pt-6">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => deleteInsight(insight.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <div className="flex items-center mb-4 space-x-4">
                            <Avatar>
                              <AvatarImage src={insight.student_profile?.avatarUrl} />
                              <AvatarFallback>
                                {insight.student_profile?.fullName?.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{new Date(insight.created_at).toLocaleDateString()}</h3>
                              <p className="text-sm text-muted-foreground">
                                Year {insight.student_profile?.collegeYear}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium">Prediction Score</div>
                                <div className="text-sm font-medium">{insight.prediction_score.toFixed(1)}%</div>
                              </div>
                              <Progress value={insight.prediction_score} className="h-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="flex items-center mb-2 space-x-2">
                                  <Award className="w-4 h-4 text-green-500" />
                                  <span className="text-sm font-medium">Strengths</span>
                                </div>
                                <ul className="space-y-1 text-sm">
                                  {insight.strengths.slice(0, 2).map((strength, index) => (
                                    <li key={index} className="text-muted-foreground">{strength}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <div className="flex items-center mb-2 space-x-2">
                                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                  <span className="text-sm font-medium">Areas to Improve</span>
                                </div>
                                <ul className="space-y-1 text-sm">
                                  {insight.weaknesses.slice(0, 2).map((weakness, index) => (
                                    <li key={index} className="text-muted-foreground">{weakness}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => setSelectedInsight(insight)}
                                >
                                  View Full Insights
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-full sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Performance Insights for {selectedInsight?.student_profile?.fullName}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <div>
                                    <h4 className="mb-2 font-medium">Strengths</h4>
                                    <ul className="pl-4 space-y-1 list-disc">
                                      {selectedInsight?.strengths.map((strength, index) => (
                                        <li key={index}>{strength}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="mb-2 font-medium">Areas for Improvement</h4>
                                    <ul className="pl-4 space-y-1 list-disc">
                                      {selectedInsight?.weaknesses.map((weakness, index) => (
                                        <li key={index}>{weakness}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="mb-2 font-medium">Recommendations</h4>
                                    <ul className="pl-4 space-y-1 list-disc">
                                      {selectedInsight?.recommendations.map((recommendation, index) => (
                                        <li key={index}>{recommendation}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="mb-2 font-medium">Enhanced Insights</h4>
                                    <p className="whitespace-pre-line text-muted-foreground">
                                      {selectedInsight?.enhanced_insights}
                                    </p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

