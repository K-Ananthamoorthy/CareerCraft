import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Career Recommendations | AI-Powered Learning Platform",
  description: "Explore career paths and job opportunities tailored to your skills and interests",
}

const careerPaths = [
  {
    title: "Software Developer",
    description: "Design, develop, and maintain software applications",
    skills: ["Programming", "Problem Solving", "Software Design"],
    companies: ["TCS", "Infosys", "Wipro", "HCL Technologies"],
  },
  {
    title: "Data Scientist",
    description: "Analyze and interpret complex data to help organizations make better decisions",
    skills: ["Machine Learning", "Statistics", "Data Visualization"],
    companies: ["Amazon", "Microsoft", "IBM", "Mu Sigma"],
  },
  {
    title: "Cloud Solutions Architect",
    description: "Design and implement cloud computing strategies for organizations",
    skills: ["Cloud Platforms", "Networking", "Security"],
    companies: ["AWS", "Google Cloud", "Microsoft Azure", "Oracle Cloud"],
  },
  {
    title: "DevOps Engineer",
    description: "Implement and manage continuous delivery systems and methodologies",
    skills: ["CI/CD", "Containerization", "Automation"],
    companies: ["Cognizant", "Tech Mahindra", "Accenture", "Capgemini"],
  },
]

export default function CareerRecommendationsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Career Recommendations</h1>
      <p className="mb-6 text-lg">
        Based on your skills, interests, and assessment results, here are some recommended career paths for you to explore:
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {careerPaths.map((career, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{career.title}</CardTitle>
              <CardDescription>{career.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Key Skills:</h3>
              <ul className="list-disc pl-5 mb-4">
                {career.skills.map((skill, skillIndex) => (
                  <li key={skillIndex}>{skill}</li>
                ))}
              </ul>
              <h3 className="font-semibold mb-2">Top Companies in India:</h3>
              <ul className="list-disc pl-5 mb-4">
                {career.companies.map((company, companyIndex) => (
                  <li key={companyIndex}>{company}</li>
                ))}
              </ul>
              <Button>Explore This Career Path</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}