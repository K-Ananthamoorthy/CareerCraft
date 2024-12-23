"use client"

import React, { useState, useEffect, useCallback } from "react"
import { createClient } from '@supabase/supabase-js'
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit2, Trash2, Code, BarChart, Cloud, Settings } from 'lucide-react'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface CareerPath {
  id: number
  title: string
  description: string
  icon: string
  skills: string[]
  companies: string[]
  career_insights: string
  job_market_trends: string
  external_resources: { name: string; url: string }[]
}

interface ExternalResource {
  name: string
  url: string
}

const iconMap = {
  'code': Code,
  'bar-chart': BarChart,
  'cloud': Cloud,
  'settings': Settings,
  // Add more icon mappings as needed
}

export function CareerPathsAdminContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([])
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState<Partial<CareerPath>>({})
  const [skills, setSkills] = useState<string[]>([])
  const [companies, setCompanies] = useState<string[]>([])
  const [externalResources, setExternalResources] = useState<ExternalResource[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [newCompany, setNewCompany] = useState("")
  const [newResource, setNewResource] = useState<ExternalResource>({ name: "", url: "" })

  const fetchCareerPaths = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('career_paths')
        .select(`
          id,
          title,
          description,
          icon,
          career_insights,
          job_market_trends,
          career_path_skills (
            skills (name)
          ),
          career_path_companies (
            companies (name)
          ),
          external_resources (
            name,
            url
          )
        `)
        .ilike('title', `%${searchQuery}%`)

      if (error) throw error

      const formattedPaths = data.map((path: any) => ({
        ...path,
        skills: path.career_path_skills?.map((s: any) => s.skills.name) || [],
        companies: path.career_path_companies?.map((c: any) => c.companies.name) || [],
        external_resources: path.external_resources || []
      }))

      setCareerPaths(formattedPaths)
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to fetch career paths')
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    fetchCareerPaths()
  }, [fetchCareerPaths])

  const handleEdit = (career: CareerPath) => {
    setSelectedCareer(career)
    setFormData(career)
    setSkills(career.skills)
    setCompanies(career.companies)
    setExternalResources(career.external_resources)
    setIsEditMode(true)
  }

  const handleAdd = () => {
    setSelectedCareer(null)
    setFormData({})
    setSkills([])
    setCompanies([])
    setExternalResources([])
    setIsEditMode(true)
  }

  const handleSave = async () => {
    try {
      if (selectedCareer?.id) {
        // Update existing career path
        await supabase
          .from('career_paths')
          .update(formData)
          .eq('id', selectedCareer.id)

        // Update skills
        await supabase
          .from('career_path_skills')
          .delete()
          .eq('career_path_id', selectedCareer.id)

        for (const skill of skills) {
          const { data: skillData } = await supabase
            .from('skills')
            .select('id')
            .eq('name', skill)
            .single()

          if (skillData) {
            await supabase
              .from('career_path_skills')
              .insert({ career_path_id: selectedCareer.id, skill_id: skillData.id })
          }
        }

        // Update companies
        await supabase
          .from('career_path_companies')
          .delete()
          .eq('career_path_id', selectedCareer.id)

        for (const company of companies) {
          const { data: companyData } = await supabase
            .from('companies')
            .select('id')
            .eq('name', company)
            .single()

          if (companyData) {
            await supabase
              .from('career_path_companies')
              .insert({ career_path_id: selectedCareer.id, company_id: companyData.id })
          }
        }

        // Update external resources
        await supabase
          .from('external_resources')
          .delete()
          .eq('career_path_id', selectedCareer.id)

        if (externalResources.length > 0) {
          const resourcesToInsert = externalResources.map(resource => ({
            ...resource,
            career_path_id: selectedCareer.id
          }))
          await supabase
            .from('external_resources')
            .insert(resourcesToInsert)
        }
      } else {
        // Create new career path
        const { data: newCareerPath } = await supabase
          .from('career_paths')
          .insert(formData)
          .select()
          .single()

        if (newCareerPath) {
          // Add skills
          for (const skill of skills) {
            const { data: skillData } = await supabase
              .from('skills')
              .select('id')
              .eq('name', skill)
              .single()

            if (skillData) {
              await supabase
                .from('career_path_skills')
                .insert({ career_path_id: newCareerPath.id, skill_id: skillData.id })
            }
          }

          // Add companies
          for (const company of companies) {
            const { data: companyData } = await supabase
              .from('companies')
              .select('id')
              .eq('name', company)
              .single()

            if (companyData) {
              await supabase
                .from('career_path_companies')
                .insert({ career_path_id: newCareerPath.id, company_id: companyData.id })
            }
          }

          // Add external resources
          if (externalResources.length > 0) {
            const resourcesToInsert = externalResources.map(resource => ({
              ...resource,
              career_path_id: newCareerPath.id
            }))
            await supabase
              .from('external_resources')
              .insert(resourcesToInsert)
          }
        }
      }

      setIsEditMode(false)
      fetchCareerPaths()
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this career path?')) return

    try {
      await supabase.from('career_paths').delete().eq('id', id)
      fetchCareerPaths()
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const IconComponent = ({ iconName }: { iconName: string }) => {
    const Icon = iconMap[iconName as keyof typeof iconMap] || Settings // Default to Settings icon if not found
    return <Icon className="w-4 h-4" />
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="text-center text-red-600">Error: {error}</div>

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search career paths..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Career Path
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {careerPaths.map((career, index) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <IconComponent iconName={career.icon} />
                  <CardTitle className="text-xl text-blue-800">{career.title}</CardTitle>
                </div>
                <CardDescription className="text-gray-600">{career.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(career)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(career.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={isEditMode} onOpenChange={(open) => !open && setIsEditMode(false)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCareer ? 'Edit' : 'Add'} Career Path</DialogTitle>
            <DialogDescription>
              {selectedCareer ? 'Edit the details of this career path.' : 'Add a new career path to the system.'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="companies">Companies</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-4 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <select
                    id="icon"
                    value={formData.icon || ''}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    {Object.keys(iconMap).map((iconName) => (
                      <option key={iconName} value={iconName}>
                        {iconName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-4 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="career_insights">Career Insights</Label>
                  <Textarea
                    id="career_insights"
                    value={formData.career_insights || ''}
                    onChange={(e) => setFormData({ ...formData, career_insights: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job_market_trends">Job Market Trends</Label>
                  <Textarea
                    id="job_market_trends"
                    value={formData.job_market_trends || ''}
                    onChange={(e) => setFormData({ ...formData, job_market_trends: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="mt-4 space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
                <Button
                  onClick={() => {
                    if (newSkill) {
                      setSkills([...skills, newSkill])
                      setNewSkill("")
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-blue-50"
                  >
                    <span>{skill}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="companies" className="mt-4 space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a company"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                />
                <Button
                  onClick={() => {
                    if (newCompany) {
                      setCompanies([...companies, newCompany])
                      setNewCompany("")
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {companies.map((company, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-blue-50"
                  >
                    <span>{company}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCompanies(companies.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="mt-4 space-y-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Resource name"
                      value={newResource.name}
                      onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                    />
                    <Input
                      placeholder="Resource URL"
                      value={newResource.url}
                      onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    />
                  </div>
                  <Button
                    className="self-end"
                    onClick={() => {
                      if (newResource.name && newResource.url) {
                        setExternalResources([...externalResources, newResource])
                        setNewResource({ name: "", url: "" })
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {externalResources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-blue-50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{resource.name}</h4>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          {resource.url}
                        </a>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExternalResources(externalResources.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditMode(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {selectedCareer ? 'Update' : 'Create'} Career Path
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

