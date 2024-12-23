"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProfileData {
  id: string
  fullName: string
  avatarUrl: string
  attendanceRate: number
  averageTestScore: number
  extracurricularScore: number
  codingSkillScore: number
  communicationScore: number
  leadershipScore: number
  engineeringBranch: string
  collegeYear: string
}

export function StudentDashboard({ profilesData }: { profilesData: ProfileData[] }) {
  const [selectedProfile, setSelectedProfile] = useState<ProfileData>(profilesData[0])

  const performanceData = [
    { name: 'Attendance', score: selectedProfile.attendanceRate },
    { name: 'Test Score', score: selectedProfile.averageTestScore },
    { name: 'Extracurricular', score: selectedProfile.extracurricularScore },
    { name: 'Coding', score: selectedProfile.codingSkillScore },
    { name: 'Communication', score: selectedProfile.communicationScore },
    { name: 'Leadership', score: selectedProfile.leadershipScore },
  ]

  const compareData = profilesData.map(profile => ({
    name: profile.fullName,
    'Test Score': profile.averageTestScore,
    'Coding Skill': profile.codingSkillScore,
  }))

  return (
    <div className="container p-4 mx-auto">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-4xl font-bold text-primary"
        >
          Student Dashboard
        </motion.h1>
      </motion.div>

      {/* Profile Selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-4">
            {profilesData.map((profile) => (
              <motion.div
                key={profile.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedProfile(profile)}
                className={`cursor-pointer p-2 rounded-lg ${selectedProfile.id === profile.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
              >
                <Avatar className="w-16 h-16 mb-2">
                  <AvatarImage src={profile.avatarUrl} />
                  <AvatarFallback>{profile.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium text-center">{profile.fullName}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Profile Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{selectedProfile.fullName}'s Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p><strong>Engineering Branch:</strong> {selectedProfile.engineeringBranch}</p>
              <p><strong>Year:</strong> {selectedProfile.collegeYear}</p>
            </div>
            <div>
              <p><strong>Attendance Rate:</strong> {selectedProfile.attendanceRate}%</p>
              <p><strong>Average Test Score:</strong> {selectedProfile.averageTestScore}/100</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="individual">
            <TabsList className="mb-4">
              <TabsTrigger value="individual">Individual Performance</TabsTrigger>
              <TabsTrigger value="compare">Compare Scores</TabsTrigger>
            </TabsList>
            <TabsContent value="individual">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="hsl(var(--primary))" name="Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="compare">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={compareData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Test Score" fill="hsl(var(--primary))" />
                    <Bar dataKey="Coding Skill" fill="hsl(var(--secondary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

