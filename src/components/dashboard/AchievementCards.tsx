import { motion } from 'framer-motion'

interface AchievementCardsProps {
  achievements: Array<{ title: string; description: string; icon: string }> | undefined
}

export default function AchievementCards({ achievements }: AchievementCardsProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Recent Achievements</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {achievements?.map((achievement, index) => (
          <motion.div
            key={index}
            className="p-4 text-white rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="mb-2 text-4xl">{achievement.icon}</div>
            <h3 className="font-semibold">{achievement.title}</h3>
            <p className="text-sm opacity-80">{achievement.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

