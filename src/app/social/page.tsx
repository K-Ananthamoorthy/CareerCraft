// import Header from '@/components/Header'
import SocialTab from '@/components/social/SocialTab'

export default function SocialPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-indigo-900">
      {/* <Header /> */}
      <main className="flex-1 p-6 overflow-y-auto">
        <SocialTab />
      </main>
    </div>
  )
}

