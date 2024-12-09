"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import LearningPathCard from '@/components/LearningPathCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  slug: string;
}

interface LearningPathsContentProps {
  filter?: string;
}

export default function LearningPathsContent({ filter }: LearningPathsContentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchLearningPaths() {
      try {
        let query = supabase.from('learning_paths').select('*')
        
        if (filter && filter !== 'all') {
          query = query.eq('level', filter)
        }
        
        const { data, error } = await query
        
        if (error) {
          throw error;
        }

        setLearningPaths(data || []);
      } catch (error) {
        console.error('Error fetching learning paths:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLearningPaths();
  }, [supabase, filter]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div 
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {learningPaths.map((path, index) => (
        <motion.div
          key={path.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <LearningPathCard {...path} />
        </motion.div>
      ))}
    </motion.div>
  );
}

