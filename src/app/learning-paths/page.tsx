import { Metadata } from 'next';
import LearningPathsContent from '@/components/Learning-path/LearningPathContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: 'Learning Paths | AI-Powered Learning Platform',
  description: 'Explore personalized learning paths tailored for engineering students',
};

export default function LearningPathsPage() {
  return (
    <div className="container py-10 mx-auto">
      <h1 className="mb-6 text-4xl font-bold text-center">Discover Your Learning Path</h1>
      <p className="mb-8 text-xl text-center text-muted-foreground">
        Embark on a journey of knowledge and skill enhancement tailored just for you.
      </p>
      
      <Tabs defaultValue="all" className="mb-12">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Paths</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <LearningPathsContent />
        </TabsContent>
        <TabsContent value="beginner">
          <LearningPathsContent filter="Beginner" />
        </TabsContent>
        <TabsContent value="intermediate">
          <LearningPathsContent filter="Intermediate" />
        </TabsContent>
        <TabsContent value="advanced">
          <LearningPathsContent filter="Advanced" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

