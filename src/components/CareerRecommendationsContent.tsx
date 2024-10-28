"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import React, { useState, useEffect } from "react";

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
];

export default function CareerRecommendationsContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {careerPaths.map((career, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{career.title}</CardTitle>
            <CardDescription>{career.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="mb-2 font-semibold">Key Skills:</h3>
            <ul className="pl-5 mb-4 list-disc">
              {career.skills.map((skill, skillIndex) => (
                <li key={skillIndex}>{skill}</li>
              ))}
            </ul>
            <h3 className="mb-2 font-semibold">Top Companies in India:</h3>
            <ul className="pl-5 mb-4 list-disc">
              {career.companies.map((company, companyIndex) => (
                <li key={companyIndex}>{company}</li>
              ))}
            </ul>
            <Button>Explore This Career Path</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
