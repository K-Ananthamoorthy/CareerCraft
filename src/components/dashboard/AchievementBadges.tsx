import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from 'lucide-react';

interface AchievementBadgesProps {
  achievements: { title: string; icon: string }[];
}

export default function AchievementBadges({ achievements }: AchievementBadgesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 mb-2 text-3xl rounded-full bg-primary text-primary-foreground">
                {achievement.icon}
              </div>
              <p className="text-xs text-center">{achievement.title}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

