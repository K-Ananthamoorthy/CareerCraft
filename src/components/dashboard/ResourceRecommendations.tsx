import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, Link } from 'lucide-react';

interface ResourceRecommendationsProps {
  resources: { title: string; type: string; url: string }[];
}

export default function ResourceRecommendations({ resources }: ResourceRecommendationsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "article":
        return <BookOpen className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      default:
        return <Link className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Recommended Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {resources.map((resource, index) => (
            <li key={index} className="flex items-center">
              {getIcon(resource.type)}
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm hover:underline"
              >
                {resource.title}
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

