"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

export default function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <motion.div 
      className="relative pb-[56.25%] h-0 overflow-hidden max-w-full mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.5 }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        onLoad={() => setIsLoaded(true)}
      ></iframe>
    </motion.div>
  )
}

