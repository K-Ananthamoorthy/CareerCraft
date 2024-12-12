import { Metadata } from "next"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import StudentProfileForm from "@/components/StudentProfileForm"
import LoadingAnimation from "@/components/LoadingSpinner"
import React, { Suspense } from "react"

export const metadata: Metadata = {
  title: "Student Profile | AI-Powered Learning Platform",
  description: "Update your engineering student profile and academic details",
}

// Function to simulate a delay for loading
async function fetchUserProfile() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()
    
    // Simulate a delay of 1.5 seconds (1500 ms)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return data
  }
  return null
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <ProfileContent />
    </Suspense>
  )
}

async function ProfileContent() {
  const profile = await fetchUserProfile()

  return (
    <div className="container px-4 py-10 mx-auto sm:px-6 lg:px-8">
      <h1 className="text-5xl font-bold text-center mb-9 text-primary">Your Profile</h1>
      <div className="max-w-4xl mx-auto">
        <StudentProfileForm initialProfile={profile} />
      </div>
    </div>
  )
}
