import { Metadata } from "next";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import EnhancedDashboard from "@/components/dashboard/EnhancedDashboard";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | AI-Powered Learning Platform",
  description: "View your progress, skills, and achievements",
};

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return <EnhancedDashboard user={user} />;
}

