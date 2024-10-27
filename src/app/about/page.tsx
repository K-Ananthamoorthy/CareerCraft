import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function About() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">About CareerCrafters Platform</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
          <CardDescription>Empowering engineering students with AI-driven learning and career guidance</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
           CareerCrafters  is dedicated to providing cutting-edge education and career support for aspiring engineers. 
            Our platform combines advanced AI technology with comprehensive learning resources to offer personalized learning 
            experiences and career guidance.
          </p>
          <p>
            We strive to bridge the gap between academic knowledge and industry requirements, ensuring our students are 
            well-prepared for the challenges of the modern tech industry.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="pl-6 space-y-2 list-disc">
            <li>Personalized learning paths based on individual assessments</li>
            <li>Real-time skill tracking and performance analytics</li>
            <li>AI-powered career recommendations</li>
            <li>Access to industry-relevant projects and internships</li>
            <li>Continuous platform updates to reflect the latest tech trends</li>
          </ul>
        </CardContent>
      </Card>
      <div className="mt-8 text-center">
        <Button size="lg">Start Your Learning Journey</Button>
      </div>
    </div>
  )
}