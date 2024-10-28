"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SkillsOverview from "@/components/dashboard/SkillsOverview";
import AssessmentScores from "@/components/dashboard/AssesmentScores";
import { Briefcase, BookOpen } from 'lucide-react';
import LoadingAnimation from "@/components/LoadingSpinner";
import React, { useState, useEffect } from "react";

// Define a type for the props expected by ClientDashboard
interface ClientDashboardProps {
  user: any; // Adjust 'any' to the specific user type if available
}

export default function ClientDashboard({ user }: ClientDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for a moment
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="container px-4 py-6 mx-auto sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-primary">Welcome to Your Engineering Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <SkillsOverview />
        <AssessmentScores />
      </div>
      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Recommended Learning Paths
            </CardTitle>
            <CardDescription>Personalized suggestions based on your profile and assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="pl-5 mb-4 space-y-2 list-disc">
              <li>Advanced Data Structures and Algorithms</li>
              <li>Full Stack Web Development with React and Node.js</li>
              <li>Machine Learning Fundamentals</li>
              <li>Cloud Computing and DevOps</li>
            </ul>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/learning-paths">Explore Learning Paths</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Career Opportunities
            </CardTitle>
            <CardDescription>Internships and job openings matching your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="pl-5 mb-4 space-y-2 list-disc">
              <li>Software Engineering Intern at TCS, Bangalore</li>
              <li>Web Developer at Infosys, Hyderabad</li>
              <li>Data Analyst at Wipro, Chennai</li>
              <li>DevOps Engineer at Tech Mahindra, Pune</li>
            </ul>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/career-recommendations">View All Opportunities</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
