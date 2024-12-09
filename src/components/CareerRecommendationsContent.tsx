"use client";

import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Briefcase, Code, BarChart, Cloud, Settings, ExternalLink, Lightbulb, TrendingUp } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

interface CareerPath {
  id: number;
  title: string;
  description: string;
  icon: string;
  skills: string[];
  companies: string[];
  career_insights: string;
  job_market_trends: string;
  external_resources: { name: string; url: string }[];
}

const iconMap: { [key: string]: React.ReactNode } = {
  'code': <Code className="w-6 h-6 text-blue-600" />,
  'bar-chart': <BarChart className="w-6 h-6 text-blue-600" />,
  'cloud': <Cloud className="w-6 h-6 text-blue-600" />,
  'settings': <Settings className="w-6 h-6 text-blue-600" />,
};

export default function CareerExplorationContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);

  useEffect(() => {
    async function fetchCareerPaths() {
      try {
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
          `);

        if (error) {
          throw new Error(error.message);
        }

        if (!data || data.length === 0) {
          throw new Error('No career paths found');
        }

        const formattedCareerPaths: CareerPath[] = data.map((path: any) => ({
          id: path.id,
          title: path.title,
          description: path.description,
          icon: path.icon,
          skills: path.career_path_skills.map((skill: any) => skill.skills.name),
          companies: path.career_path_companies.map((company: any) => company.companies.name),
          career_insights: path.career_insights,
          job_market_trends: path.job_market_trends,
          external_resources: path.external_resources,
        }));

        setCareerPaths(formattedCareerPaths);
      } catch (err) {
        console.error('Error fetching career paths:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCareerPaths();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {careerPaths.map((career, index) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105 bg-gradient-to-br from-white to-blue-50" onClick={() => setSelectedCareer(career)}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  {iconMap[career.icon] || <Briefcase className="w-6 h-6 text-blue-600" />}
                  <CardTitle className="text-2xl text-blue-800">{career.title}</CardTitle>
                </div>
                <CardDescription className="text-gray-600">{career.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="mb-2 font-semibold text-gray-700">Key Skills:</h3>
                <ul className="pl-5 mb-4 text-gray-600 list-disc">
                  {career.skills.slice(0, 3).map((skill, skillIndex) => (
                    <li key={skillIndex}>{skill}</li>
                  ))}
                </ul>
                <Button 
                  className="w-full transition-colors duration-300 bg-blue-600 hover:bg-blue-700"
                >
                  Explore This Career
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCareer && (
          <Dialog open={!!selectedCareer} onOpenChange={() => setSelectedCareer(null)}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="flex items-center text-2xl text-blue-800">
                  {iconMap[selectedCareer.icon] || <Briefcase className="w-6 h-6 mr-2 text-blue-600" />}
                  {selectedCareer.title}
                </DialogTitle>
                <DialogDescription>{selectedCareer.description}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="companies">Companies</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="space-y-4">
                    <section>
                      <h3 className="flex items-center mb-2 text-lg font-semibold text-gray-800">
                        <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                        Career Insights
                      </h3>
                      <p className="text-gray-600">{selectedCareer.career_insights}</p>
                    </section>
                    <section>
                      <h3 className="flex items-center mb-2 text-lg font-semibold text-gray-800">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                        Job Market Trends
                      </h3>
                      <p className="text-gray-600">{selectedCareer.job_market_trends}</p>
                    </section>
                    <section>
                      <h3 className="flex items-center mb-2 text-lg font-semibold text-gray-800">
                        <ExternalLink className="w-5 h-5 mr-2 text-blue-600" />
                        External Resources
                      </h3>
                      <ul className="space-y-2">
                        {selectedCareer.external_resources.map((resource, index) => (
                          <li key={index}>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                              <ExternalLink className="w-4 h-4 mr-1" /> {resource.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </TabsContent>
                <TabsContent value="skills">
                  <h3 className="flex items-center mb-2 text-lg font-semibold text-gray-800">
                    <Code className="w-5 h-5 mr-2 text-yellow-600" />
                    Key Skills
                  </h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {selectedCareer.skills.map((skill, index) => (
                      <li key={index} className="flex items-center px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="companies">
                  <h3 className="flex items-center mb-2 text-lg font-semibold text-gray-800">
                    <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
                    Top Companies
                  </h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {selectedCareer.companies.map((company, index) => (
                      <li key={index} className="flex items-center px-3 py-1 text-sm text-indigo-800 bg-indigo-100 rounded-full">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {company}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}

