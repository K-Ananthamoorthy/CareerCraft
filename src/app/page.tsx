import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Cpu, Briefcase } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-blue-500 to-blue-700 text-primary-foreground">
            <div className="container px-4 mx-auto text-center">
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">AI-Powered Learning & Career Platform for Engineering Students</h1>
            <p className="max-w-2xl mx-auto mb-8 text-xl">Personalized learning paths, skill assessments, and career recommendations tailored for Indian engineering students.</p>
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
            <h2 className="mb-12 text-3xl font-bold text-center">Key Features</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <BookOpen className="w-6 h-6 mr-2" />
                    Personalized Learning Paths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center">Tailored curriculum based on your skills, interests, and career goals.</p>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <Cpu className="w-6 h-6 mr-2" />
                    Skill Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center">Evaluate your technical skills and track your progress over time.</p>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <Briefcase className="w-6 h-6 mr-2" />
                    Career Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center">Get AI-powered career suggestions and job opportunities matching your profile.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-muted">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">&copy; 2024 AI-Powered Learning Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}