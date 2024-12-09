import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface PeerComparisonProps {
  comparison: { skill: string; userScore: number; averageScore: number }[];
}

export default function PeerComparison({ comparison }: PeerComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Peer Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comparison.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{item.skill}</span>
              </div>
              <div className="flex items-center">
                <Progress value={item.userScore} className="flex-grow h-2 mr-2" />
                <span className="text-xs font-medium">{item.userScore}%</span>
              </div>
              <div className="flex items-center mt-1">
                <Progress value={item.averageScore} className="flex-grow h-2 mr-2 bg-muted" />
                <span className="text-xs font-medium text-muted-foreground">{item.averageScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

