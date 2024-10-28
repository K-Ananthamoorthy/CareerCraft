"use client";

import LearningPathCard from '@/components/LearningPathCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import React, { useState, useEffect } from 'react';

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
];

export default function LearningPathsContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {learningPaths.map((path) => (
        <LearningPathCard key={path.slug} {...path} />
      ))}
    </div>
  );
}
