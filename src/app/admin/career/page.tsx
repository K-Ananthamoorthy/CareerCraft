import { CareerPathsAdminContent } from "./Career-paths-admin-content"

export default function AdminCareerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container px-4 py-10 mx-auto">
        <h1 className="mb-6 text-4xl font-bold text-blue-800">Career Paths Management</h1>
        <p className="mb-8 text-xl text-gray-600">
          Manage career paths, skills, companies, and resources for the career recommendations system.
        </p>
        <CareerPathsAdminContent />
      </main>
    </div>
  )
}

