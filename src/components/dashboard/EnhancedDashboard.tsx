"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap, Trophy, BookOpen } from 'lucide-react';
import SkillsOverview from "./SkillsOverview";
import HeroTiles from "./HeroTiles";
import RecentActivities from "./RecentActvities";
import UpcomingEvents from "./UpcomingEvents";
import LearningProgress from "./LearningProgress";
import AchievementBadges from "./AchievementBadges";
import PeerComparison from "./PeerComparison";
import ResourceRecommendations from "./ResourceRecommendations";
import InteractiveCalendar from "./InteractiveCalendar";

interface EnhancedDashboardProps {
  user: User;
}

interface DashboardData {
  fullName: string;
  recentActivities: string[];
  upcomingEvents: { title: string; date: string }[];
  learningProgress: { course: string; progress: number }[];
  studyStreak: number[];
  achievements: { title: string; icon: string }[];
  peerComparison: { skill: string; userScore: number; averageScore: number }[];
  recommendedResources: { title: string; type: string; url: string }[];
}

export default function EnhancedDashboard({ user }: EnhancedDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("student_profiles")
          .select("fullName")
          .eq("user_id", user.id)
          .single();

        if (profileError) throw profileError;

        const { data, error } = await supabase
          .from("dashboard_data")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        setDashboardData({
          ...data,
          fullName: profileData?.fullName || user.email || "Student",
        } as DashboardData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [user.id, user.email, supabase]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container px-4 py-6 mx-auto sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center mb-6 space-x-2"
      >
        <Sparkles className="w-8 h-8 text-yellow-400" />
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">
          Welcome, {dashboardData?.fullName || user.email || "Student"}!
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <InteractiveCalendar userId={user.id} />
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Skills Overview</CardTitle>
              <Zap className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <SkillsOverview userId={user.id} />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
              <Trophy className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <LearningProgress progress={dashboardData?.learningProgress || []} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6"
      >
        <HeroTiles userId={user.id} />
      </motion.div>

      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <RecentActivities activities={dashboardData?.recentActivities || []} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <UpcomingEvents events={dashboardData?.upcomingEvents || []} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <AchievementBadges achievements={dashboardData?.achievements || []} />
        </motion.div>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <PeerComparison comparison={dashboardData?.peerComparison || []} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Recommended Resources</CardTitle>
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ResourceRecommendations resources={dashboardData?.recommendedResources || []} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

