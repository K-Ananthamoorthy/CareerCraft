import { Metadata } from "next"
import StudentProfileForm from "@/components/StudentProfileForm"

export const metadata: Metadata = {
  title: "Student Profile | AI-Powered Learning Platform",
  description: "Update your engineering student profile and academic details",
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Engineering Student Profile</h1>
      <StudentProfileForm />
    </div>
  )
}