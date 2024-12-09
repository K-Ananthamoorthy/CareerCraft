import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentActivitiesProps {
  activities: string[];
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

