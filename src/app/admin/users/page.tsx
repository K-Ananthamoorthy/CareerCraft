'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Edit, Trash2 } from 'lucide-react'
import { EditUserForm } from '../components/EditUserForm'
import { deleteUser } from '@/app/actions/user-actions'
import { StudentProfile } from '@/types/student-profile'

export default function UsersPage() {
  const [profiles, setProfiles] = useState<StudentProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<StudentProfile | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchProfiles()
  }, [])

  async function fetchProfiles() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
      
      if (error) throw error
      setProfiles(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch student profiles",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredProfiles = profiles.filter(profile => 
    profile.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.engineeringBranch?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (user: StudentProfile) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId)
        setProfiles(profiles.filter(profile => profile.id !== userId))
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        })
      }
    }
  }

  const handleViewDetails = (user: StudentProfile) => {
    setSelectedUser(user)
    setIsDetailsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6 space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or branch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Branch & Year</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Performance Metrics</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={profile.avatarUrl} />
                            <AvatarFallback>
                              {profile.fullName?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{profile.fullName}</div>
                            <div className="text-sm text-muted-foreground">{profile.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{profile.engineeringBranch}</div>
                        <div className="text-sm text-muted-foreground">Year {profile.collegeYear}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">{profile.collegeNameAndLocation}</div>
                        {profile.activeBacklogs && (
                          <div className="text-sm text-red-500">Has active backlogs</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            Attendance: {profile.attendanceRate}%
                          </div>
                          <div className="text-sm">
                            Avg. Score: {profile.averageTestScore}/100
                          </div>
                          <div className="text-sm">
                            Coding: {profile.codingSkillScore}/10
                          </div>
                          <div className="text-sm">
                            Communication: {profile.communicationScore}/10
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleViewDetails(profile)}>
                            <Search className="w-4 h-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleEdit(profile)}>
                            <Edit className="w-4 h-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(profile.id)}>
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <EditUserForm
              user={selectedUser}
              onClose={() => {
                setIsEditDialogOpen(false)
                fetchProfiles() // Refresh the user list after editing
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Full Name</h3>
                <p>{selectedUser.fullName}</p>
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>{selectedUser.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Engineering Branch</h3>
                <p>{selectedUser.engineeringBranch}</p>
              </div>
              <div>
                <h3 className="font-semibold">College Year</h3>
                <p>{selectedUser.collegeYear}</p>
              </div>
              <div>
                <h3 className="font-semibold">College Name and Location</h3>
                <p>{selectedUser.collegeNameAndLocation}</p>
              </div>
              <div>
                <h3 className="font-semibold">Performance Metrics</h3>
                <p>Attendance Rate: {selectedUser.attendanceRate}%</p>
                <p>Average Test Score: {selectedUser.averageTestScore}/100</p>
                <p>Coding Skill Score: {selectedUser.codingSkillScore}/10</p>
                <p>Communication Score: {selectedUser.communicationScore}/10</p>
                <p>Extracurricular Score: {selectedUser.extracurricularScore}/10</p>
                <p>Leadership Score: {selectedUser.leadershipScore}/10</p>
              </div>
              <div>
                <h3 className="font-semibold">Internship Experience</h3>
                <p>{selectedUser.internshipExperience} months</p>
              </div>
              <div>
                <h3 className="font-semibold">Active Backlogs</h3>
                <p>{selectedUser.activeBacklogs || 'None'}</p>
              </div>
              <div>
                <h3 className="font-semibold">Skills</h3>
                <p>{selectedUser.skills || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="font-semibold">Dream Companies</h3>
                <p>{selectedUser.dream_companies || 'Not specified'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

