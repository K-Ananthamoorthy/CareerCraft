import { Metadata } from "next";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ClientDashboard from "@/components/dashboard/ClientDashboard"; // Import the Client Component
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | AI-Powered Learning Platform",
  description: "View your progress, assessments, and career recommendations",
};

// Server-side function to fetch user data
export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to homepage if no user is found
    redirect('/');
  }

  return <ClientDashboard user={user} />;
}
