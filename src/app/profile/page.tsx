import { Metadata } from "next"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import StudentProfileForm from "@/components/StudentProfileForm"

export const metadata: Metadata = {
  title: "Student Profile | AI-Powered Learning Platform",
  description: "Update your engineering student profile and academic details",
}

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { user } } = await supabase.auth.getUser()
  
  let profile = null
  if (user) {
    const { data } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()
    profile = data
  }

  return (
    <div className="container px-4 py-10 mx-auto sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-center text-primary">Your Engineering Student Profile</h1>
      <div className="max-w-4xl mx-auto">
        <StudentProfileForm initialProfile={profile} />
      </div>
    </div>
  )
}