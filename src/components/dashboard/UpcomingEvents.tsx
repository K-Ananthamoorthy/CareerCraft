import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UpcomingEventsProps {
  events: { title: string; date: string }[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {events.map((event, index) => (
            <li key={index}>
              <span className="font-medium">{event.title}</span> - {event.date}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

