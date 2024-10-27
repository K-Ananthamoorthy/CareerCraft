import { Metadata } from 'next'
import LearningPathCard from '@/components/LearningPathCard'

export const metadata: Metadata = {
  title: 'Learning Paths | AI-Powered Learning Platform',
  description: 'Explore personalized learning paths tailored for engineering students',
}

const learningPaths = [
  {
    title: "Full Stack Web Development",
    description: "Master modern web technologies and build complex web applications",
    duration: "12 weeks",
    level: "Intermediate",
    slug: "full-stack-web-development"
  },
  {
    title: "Machine Learning Fundamentals",
    description: "Learn the basics of machine learning and AI algorithms",
    duration: "8 weeks",
    level: "Beginner",
    slug: "machine-learning-fundamentals"
  },
  {
    title: "Advanced Data Structures and Algorithms",
    description: "Improve your problem-solving skills with advanced DSA concepts",
    duration: "10 weeks",
    level: "Advanced",
    slug: "advanced-dsa"
  },
  {
    title: "Cloud Computing and DevOps",
    description: "Explore cloud platforms and learn DevOps practices",
    duration: "6 weeks",
    level: "Intermediate",
    slug: "cloud-computing-devops"
  }
]

export default function LearningPathsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Learning Paths</h1>
      <p className="mb-8 text-lg">
        Explore personalized learning paths designed to enhance your skills and advance your career in engineering.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {learningPaths.map((path) => (
          <LearningPathCard key={path.slug} {...path} />
        ))}
      </div>
    </div>
  )
}