import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-blue-500 to-blue-700 text-white py-20">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">AI-Powered Learning & Career Platform for Engineering Students</h1>
            <p className="text-xl mb-8">Personalized learning paths, skill assessments, and career recommendations tailored for Indian engineering students.</p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Personalized Learning Paths</h3>
                <p>Tailored curriculum based on your skills, interests, and career goals.</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Skill Assessments</h3>
                <p>Evaluate your technical skills and track your progress over time.</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Career Recommendations</h3>
                <p>Get AI-powered career suggestions and job opportunities matching your profile.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 AI-Powered Learning Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}