"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface Skill {
  name: string;
  level: number;
}

interface SkillsOverviewProps {
  userId: string;
}

export default function SkillsOverview({ userId }: SkillsOverviewProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchSkills() {
      const { data, error } = await supabase
        .from("user_skills")
        .select("name, level")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching skills:", error);
      } else if (data) {
        setSkills(data);
      }
    }

    fetchSkills();
  }, [userId, supabase]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {skills.length > 0 ? (
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    {skill.name}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {skill.level}%
                  </span>
                </div>
                <Progress value={skill.level} className="h-2" />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No skills data available</p>
        )}
      </CardContent>
    </Card>
  );
}

