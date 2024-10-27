"use client"; // Add this line to mark the file as a client component

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Cpu, Briefcase, TrendingUp, UserCheck, Layers } from 'lucide-react';
import LoadingAnimation from '@/components/LoadingSpinner'; // Import the LoadingAnimation

export default function LandingPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Adjust the delay as needed
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingAnimation />; // Use the LoadingAnimation component
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-indigo-600 to-purple-800 text-primary-foreground">
          <div className="container px-4 mx-auto text-center">
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
              AI-Powered Platform for Student Excellence
            </h1>
            <p className="max-w-2xl mx-auto mb-8 text-xl">
              Unlock your full potential with personalized learning paths, skill enhancement, and career insights tailored for engineering students.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container px-4 mx-auto">
            <h2 className="mb-12 text-3xl font-bold text-center">Key Features for Student Excellence</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <BookOpen className="w-6 h-6 mr-2" />
                    Customized Learning Paths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center">
                    Tailored study plans designed to enhance your academic journey and maximize your strengths.
                  </p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <Cpu className="w-6 h-6 mr-2" />
                    Skill Development Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center">
                    Identify and nurture your skills to achieve excellence in your chosen field.
                  </p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <Briefcase className="w-6 h-6 mr-2" />
                    Career Readiness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center">
                    Prepare for the future with personalized career guidance and job matching.
                  </p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 mr-2" />
                    Performance Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center">
                    Monitor your academic progress and gain insights to enhance your learning strategies.
                  </p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <UserCheck className="w-6 h-6 mr-2" />
                    Institutional Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center">
                    Access resources and support systems to foster your academic success.
                  </p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <Layers className="w-6 h-6 mr-2" />
                    AI-Enhanced Tutoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center">
                    Get real-time feedback and resources tailored to your unique learning needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-muted">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            &copy; 2024 AI-Powered Student Learning Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
