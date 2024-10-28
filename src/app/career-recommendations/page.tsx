import { Metadata } from "next";
import CareerRecommendationsContent from "@/components/CareerRecommendationsContent";

export const metadata: Metadata = {
  title: "Career Recommendations | AI-Powered Learning Platform",
  description: "Explore career paths and job opportunities tailored to your skills and interests",
};

export default function CareerRecommendationsPage() {
  return (
    <div className="container py-10 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Career Recommendations</h1>
      <p className="mb-6 text-lg">
        Based on your skills, interests, and assessment results, here are some recommended career paths for you to explore:
      </p>
      <CareerRecommendationsContent /> {/* Render the client component here */}
    </div>
  );
}
