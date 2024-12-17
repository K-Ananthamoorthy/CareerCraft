import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface WelcomeHeaderProps {
  userProfile: {
    fullName: string
    avatarUrl: string
    engineeringBranch: string
  } | null
}

export default function WelcomeHeader({ userProfile }: WelcomeHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6 bg-gradient-to-r from-purple-500 to-blue-500">
          <div className="flex flex-col items-center space-y-4 text-center text-white sm:flex-row sm:space-y-0 sm:space-x-4 sm:text-left">
            <Avatar className="w-24 h-24 border-4 border-white sm:w-32 sm:h-32">
              <AvatarImage src={userProfile?.avatarUrl} />
              <AvatarFallback>{userProfile?.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">Welcome back, {userProfile?.fullName}!</h1>
              <p className="text-xl opacity-90">{userProfile?.engineeringBranch} Student</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

