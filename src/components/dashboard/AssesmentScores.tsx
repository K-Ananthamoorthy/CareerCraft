"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface AssessmentScoresProps {
  userId: string;
}

interface AssessmentScore {
  assessment: string;
  score: number;
}

export default function AssessmentScores({ userId }: AssessmentScoresProps) {
  const [assessmentScores, setAssessmentScores] = useState<AssessmentScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchAssessmentScores() {
      try {
        const { data, error } = await supabase
          .from('user_assessments')
          .select('assessment, score')
          .eq('user_id', userId);

        if (error) throw error;

        setAssessmentScores(data);
      } catch (error) {
        console.error('Error fetching assessment scores:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAssessmentScores();
  }, [userId, supabase]);

  if (isLoading) {
    return <div>Loading assessment scores...</div>;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Assessment Scores</CardTitle>
        <CardDescription>Your performance in recent assessments</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={assessmentScores} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="assessment"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => value.split(' ')[0]}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '4px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

