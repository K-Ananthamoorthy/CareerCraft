"use client"

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Clock, BarChart, BookOpen, Video, Code, Award, Users, Star, ChevronRight } from 'lucide-react'
import YouTubeEmbed from '@/components/Learning-path/YoutubeEmbed'
import AssessmentComponent from '@/components/Learning-path/Assessment'
import EnrollmentConfirmation from '@/components/EnrollmentConfirmation'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface LearningPath {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  slug: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  content: {
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
}

interface Enrollment {
  id: string;
  enrolled_at: string;
}

interface UserProgress {
  module_id: string;
  completed: boolean;
  completed_at: string | null;
  quiz_score?: number;
}

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function LearningPathPage({ params }: { params: { slug: string } }) {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [quizzes, setQuizzes] = useState<{ [key: string]: Quiz[] }>({})
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEnrollmentConfirmation, setShowEnrollmentConfirmation] = useState(false)
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: pathData, error: pathError } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('slug', params.slug)
        .single()

      if (pathError) {
        console.error('Error fetching learning path:', pathError)
        router.push('/404')
        return
      }

      setLearningPath(pathData)

      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .eq('learning_path_id', pathData.id)
        .order('order_index')

      if (modulesError) {
        console.error('Error fetching modules:', modulesError)
      } else {
        setModules(modulesData)

        const quizzesPromises = modulesData.map(module =>
          supabase
            .from('quizzes')
            .select('*')
            .eq('module_id', module.id)
        )

        const quizzesResults = await Promise.all(quizzesPromises)
        const quizzesMap: { [key: string]: Quiz[] } = {}
        quizzesResults.forEach((result, index) => {
          if (result.error) {
            console.error(`Error fetching quizzes for module ${modulesData[index].id}:`, result.error)
          } else {
            quizzesMap[modulesData[index].id] = result.data
          }
        })
        setQuizzes(quizzesMap)
      }

      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('learning_path_id', pathData.id)
        .single()

      if (enrollmentError && enrollmentError.code !== 'PGRST116') {
        console.error('Error fetching enrollment:', enrollmentError)
      } else {
        setEnrollment(enrollmentData)
      }

      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('learning_path_id', pathData.id)

      if (progressError) {
        console.error('Error fetching user progress:', progressError)
      } else {
        setUserProgress(progressData || [])
      }

      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('learning_path_id', pathData.id)

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError)
      } else {
        setReviews(reviewsData)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [params.slug, supabase, router])

  const handleEnroll = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('enrollments')
      .insert({ user_id: user.id, learning_path_id: learningPath!.id })
      .select()
      .single()

    if (error) {
      console.error('Error enrolling:', error)
    } else {
      setEnrollment(data)
    }
  }

  const handleEnrollClick = () => {
    setShowEnrollmentConfirmation(true)
  }

  const handleEnrollConfirm = async () => {
    await handleEnroll()
    setShowEnrollmentConfirmation(false)
  }

  const handleExitCourse = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('user_id', user.id)
      .eq('learning_path_id', learningPath!.id)

    if (error) {
      console.error('Error exiting course:', error)
    } else {
      setEnrollment(null)
      setUserProgress([])
      setShowExitConfirmation(false)
    }
  }

  const handleModuleCompletion = async (moduleId: string, quizScore?: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        learning_path_id: learningPath!.id,
        module_id: moduleId,
        completed: true,
        completed_at: new Date().toISOString(),
        quiz_score: quizScore
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating progress:', error)
    } else {
      setUserProgress(prev => [...prev.filter(p => p.module_id !== moduleId), data])
    }
  }

  const calculateProgress = () => {
    if (modules.length === 0) return 0
    const completedModules = userProgress.filter(p => p.completed).length
    return (completedModules / modules.length) * 100
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!learningPath) {
    return <div className="flex items-center justify-center h-screen">Learning path not found</div>
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-10 mx-auto"
    >
      <motion.div 
        className="grid gap-8 mb-12 md:grid-cols-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="md:col-span-2">
          <h1 className="mb-4 text-4xl font-bold">{learningPath.title}</h1>
          <p className="mb-6 text-xl text-muted-foreground">{learningPath.description}</p>
          <div className="flex flex-wrap gap-4 mb-6">
            <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
              <Clock className="w-5 h-5 mr-2" />
              <span>{learningPath.duration}</span>
            </motion.div>
            <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
              <BarChart className="w-5 h-5 mr-2" />
              <span>{learningPath.level}</span>
            </motion.div>
            <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
              <BookOpen className="w-5 h-5 mr-2" />
              <span>{modules.length} Modules</span>
            </motion.div>
            <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
              <Users className="w-5 h-5 mr-2" />
              <span>{enrollment ? 'Enrolled' : 'Not Enrolled'}</span>
            </motion.div>
            <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              <span>{reviews.length > 0 ? `${(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)} (${reviews.length} reviews)` : 'No reviews yet'}</span>
            </motion.div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {enrollment ? (
              <Button size="lg" onClick={() => setShowExitConfirmation(true)}>Exit Course</Button>
            ) : (
              <Button size="lg" onClick={handleEnrollClick}>Enroll Now</Button>
            )}
          </motion.div>
        </div>
        <motion.div 
          className="relative h-64 overflow-hidden rounded-lg md:h-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src="/placeholder.svg?height=300&width=400"
            alt={learningPath.title}
            layout="fill"
            objectFit="cover"
          />
        </motion.div>
      </motion.div>

      {enrollment && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="mb-4 text-2xl font-semibold">Your Progress</h2>
          <Progress value={calculateProgress()} className="w-full" />
          <p className="mt-2 text-center">{Math.round(calculateProgress())}% Complete</p>
          <p className="mt-2 text-center text-muted-foreground">
            Estimated time to complete: {Math.ceil((100 - calculateProgress()) / 100 * parseInt(learningPath.duration))} weeks
          </p>
        </motion.div>
      )}

      <Tabs defaultValue="overview" className="mb-12">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <motion.div 
            className="grid gap-8 md:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="md:col-span-2">
              <h2 className="mb-4 text-2xl font-semibold">Course Overview</h2>
              <p className="mb-4">This comprehensive course will take you through all aspects of {learningPath.title}. You'll gain hands-on experience and be ready to apply your skills in real-world scenarios.</p>
              <h3 className="mb-2 text-xl font-semibold">What you'll learn:</h3>
              <ul className="mb-4 list-disc list-inside">
                <li>Fundamental principles and concepts</li>
                <li>Practical application of theories</li>
                <li>Industry best practices and tools</li>
                <li>Real-world problem-solving techniques</li>
              </ul>
              <YouTubeEmbed videoId="dQw4w9WgXcQ" title="Course Introduction" />
            </div>
            <div>
              <h3 className="mb-4 text-xl font-semibold">This course includes:</h3>
              <ul className="space-y-2">
                <motion.li className="flex items-center" whileHover={{ x: 5 }}>
                  <Video className="w-5 h-5 mr-2" /> {modules.length} modules
                </motion.li>
                <motion.li className="flex items-center" whileHover={{ x: 5 }}>
                  <BookOpen className="w-5 h-5 mr-2" /> Comprehensive learning materials
                </motion.li>
                <motion.li className="flex items-center" whileHover={{ x: 5 }}>
                  <Code className="w-5 h-5 mr-2" /> Hands-on exercises
                </motion.li>
                <motion.li className="flex items-center" whileHover={{ x: 5 }}>
                  <Award className="w-5 h-5 mr-2" /> Certificate of completion
                </motion.li>
              </ul>
            </div>
          </motion.div>
        </TabsContent>
        <TabsContent value="curriculum">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-2xl font-semibold">Course Curriculum</h2>
            <Accordion type="single" collapsible className="w-full">
              {modules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <AccordionItem value={`module-${module.id}`}>
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <BookOpen className="w-5 h-5 mr-2" />
                          <span>{module.title}</span>
                        </div>
                        {userProgress.find(p => p.module_id === module.id && p.completed) && (
                          <span className="text-green-500">Completed</span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">{module.description}</p>
                      {quizzes[module.id] && quizzes[module.id].map((quiz) => (
                        <AssessmentComponent
                          key={quiz.id}
                          quiz={quiz}
                          onComplete={(score) => handleModuleCompletion(module.id, score)}
                        />
                      ))}
                      {!userProgress.find(p => p.module_id === module.id && p.completed) && (
                        <Button onClick={() => handleModuleCompletion(module.id)}>Mark as Completed</Button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </TabsContent>
        <TabsContent value="reviews">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-2xl font-semibold">Student Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <motion.div 
                  key={review.id} 
                  className="pb-4 border-b"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="ml-2 font-semibold">{review.rating} out of 5</span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                  <p className="mt-2 text-sm">Anonymous - {new Date(review.created_at).toLocaleDateString()}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>
        <TabsContent value="faq">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-2xl font-semibold">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What are the prerequisites for this course?</AccordionTrigger>
                <AccordionContent>
                  The prerequisites for this course include basic programming knowledge and familiarity with web technologies. Specific requirements may vary depending on the course level.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How long do I have access to the course materials?</AccordionTrigger>
                <AccordionContent>
                  You will have lifetime access to the course materials once enrolled. This includes any future updates to the course content.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is there a certificate upon completion?</AccordionTrigger>
                <AccordionContent>
                  Yes, you will receive a certificate of completion once you have finished all the modules and passed the final assessment.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </TabsContent>
      </Tabs>

      {calculateProgress() === 100 && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button size="lg" onClick={() => router.push(`/certificate/${learningPath.id}`)}>
            View Certificate
          </Button>
        </motion.div>
      )}

      <EnrollmentConfirmation
        isOpen={showEnrollmentConfirmation}
        onClose={() => setShowEnrollmentConfirmation(false)}
        onConfirm={handleEnrollConfirm}
        learningPath={learningPath}
      />

      {showExitConfirmation && (
        <Alert>
          <AlertTitle>Are you sure you want to exit this course?</AlertTitle>
          <AlertDescription>
            Your progress will be saved, but you will need to re-enroll to continue.
          </AlertDescription>
          <div className="flex justify-end mt-4 space-x-4">
            <Button variant="outline" onClick={() => setShowExitConfirmation(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleExitCourse}>Exit Course</Button>
          </div>
        </Alert>
      )}
    </motion.div>
  )
}

