import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function ResultsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Assessment Results</h1>
      <p className="mb-6">Your assessment has been submitted successfully.</p>
      <Button asChild>
        <Link href="/assessment">Back to Assessments</Link>
      </Button>
    </div>
  )
}