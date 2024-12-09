import { Metadata } from "next";
import CareerExplorationContent from "@/components/CareerRecommendationsContent";

export const metadata: Metadata = {
  title: "Career Exploration | AI-Powered Learning Platform",
  description: "Explore career paths and job opportunities tailored to your skills and interests",
};

export default function CareerExplorationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container px-4 py-10 mx-auto">
        <h1 className="mb-6 text-4xl font-bold text-blue-800">Career Exploration</h1>
        <p className="mb-8 text-xl text-gray-600">
          Discover exciting career paths tailored to your skills and interests. Click on a career to learn more!
        </p>
        <CareerExplorationContent />
      </main>
    </div>
  );
}

