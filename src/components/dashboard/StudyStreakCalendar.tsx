import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from 'lucide-react';

interface StudyStreakCalendarProps {
  streak: number[];
}

export default function StudyStreakCalendar({ streak }: StudyStreakCalendarProps) {
  const currentStreak = streak[streak.length - 1];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Study Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="text-4xl font-bold">{currentStreak}</p>
          <p className="text-sm text-muted-foreground">days in a row</p>
        </div>
        <div className="flex justify-center mt-4">
          {streak.slice(-7).map((day, index) => (
            <div
              key={index}
              className={`w-6 h-6 mx-1 rounded-full ${
                day > 0 ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

