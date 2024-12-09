import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LearningProgressProps {
  progress: { course: string; progress: number }[];
}

export default function LearningProgress({ progress }: LearningProgressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progress.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-muted-foreground">{item.course}</span>
                <span className="text-sm font-medium text-primary">{item.progress}%</span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

