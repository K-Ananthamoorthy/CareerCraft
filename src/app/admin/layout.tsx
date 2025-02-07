import { ReactNode } from 'react'
import Link from 'next/link'
import { Home, Users, FileText, BarChart, Settings } from 'lucide-react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          <Link href="/admin" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200">
            <Home className="w-5 h-5 mr-2" />
            Dashboard
          </Link>
          <Link href="/admin/users" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200">
            <Users className="w-5 h-5 mr-2" />
            Users
          </Link>
          <Link href="/admin/assessments" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200">
            <FileText className="w-5 h-5 mr-2" />
            Assessments
          </Link>
          <Link href="/admin/insights" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200">
            <BarChart className="w-5 h-5 mr-2" />
            Insights
          </Link>
          <Link href="/admin/learning-paths" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200">
            <Settings className="w-5 h-5 mr-2" />
            Learning-path
          </Link>
          <Link href="/admin/career" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200">
            <Settings className="w-5 h-5 mr-2" />
            Career-path
          </Link>
          <Link href="/admin/profile" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200">
            <Settings className="w-5 h-5 mr-2" />
            Analysis
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

