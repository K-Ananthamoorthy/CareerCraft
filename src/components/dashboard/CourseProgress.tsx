import { Progress } from "@/components/ui/progress"

interface CourseProgressProps {
  enrolledCourses: Array<{ title: string; progress: number }> | undefined
}

export default function CourseProgress({ enrolledCourses }: CourseProgressProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Course Progress</h2>
      <div className="space-y-4">
        {enrolledCourses?.map((course, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{course.title}</span>
              <span className="text-sm font-medium">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  )
}

