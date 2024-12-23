import { Metadata } from "next";
import CareerExplorationContent from "@/components/CareerRecommendationsContent";

export const metadata: Metadata = {
  title: "AI-Powered Career Recommendations | Learning Platform",
  description: "Explore career paths and job opportunities tailored to your skills, interests, and profile using our AI-powered recommendation system",
};

export default function CareerExplorationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container px-4 py-10 mx-auto">
        <h1 className="mb-6 text-4xl font-bold text-blue-800">AI-Powered Career Recommendations</h1>
        <p className="mb-8 text-xl text-gray-600">
          Discover exciting career paths tailored to your unique profile, skills, and interests. Our advanced AI system, powered by Gemini, provides personalized recommendations just for you. Explore each career to learn more and get detailed insights!
        </p>
        <CareerExplorationContent />
      </main>
    </div>
  );
}

