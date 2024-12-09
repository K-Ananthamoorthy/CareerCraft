"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SkillsOverview from "@/components/dashboard/SkillsOverview";
import AssessmentScores from "@/components/dashboard/AssesmentScores";
import { Briefcase, BookOpen, Bell, Award } from 'lucide-react';
import LoadingAnimation from "@/components/LoadingSpinner";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";

interface ClientDashboardProps {
  user: User;
}

interface DashboardData {
  learningPaths: string[];
  careerOpportunities: { title: string; company: string; location: string }[];
  recentAchievements: string[];
}

export default function ClientDashboard({ user }: ClientDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('learning_paths, career_opportunities, recent_achievements')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        setDashboardData({
          learningPaths: data.learning_paths,
          careerOpportunities: data.career_opportunities,
          recentAchievements: data.recent_achievements,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [user.id, supabase]);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="container px-4 py-6 mx-auto sm:px-6 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 text-3xl font-bold text-primary"
      >
        Welcome to Your Engineering Dashboard, {user.email}
      </motion.h1>
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SkillsOverview userId={user.id} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AssessmentScores userId={user.id} />
        </motion.div>
      </div>
      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
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
                {dashboardData?.learningPaths.map((path, index) => (
                  <li key={index}>{path}</li>
                ))}
              </ul>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/learning-paths">Explore Learning Paths</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
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
                {dashboardData?.careerOpportunities.map((opportunity, index) => (
                  <li key={index}>
                    {opportunity.title} at {opportunity.company}, {opportunity.location}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/career-recommendations">View All Opportunities</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Recent Achievements
            </CardTitle>
            <CardDescription>Your latest accomplishments and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="pl-5 mb-4 space-y-2 list-disc">
              {dashboardData?.recentAchievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

