import { Metadata } from 'next';
import LearningPathsContent from '../../components/LearningPathContent';

export const metadata: Metadata = {
  title: 'Learning Paths | AI-Powered Learning Platform',
  description: 'Explore personalized learning paths tailored for engineering students',
};

export default function LearningPathsPage() {
  return (
    <div className="container py-10 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Learning Paths</h1>
      <p className="mb-8 text-lg">
        Explore personalized learning paths designed to enhance your skills and advance your career in engineering.
      </p>
      <LearningPathsContent /> {/* Use the client component here */}
    </div>
  );
}
