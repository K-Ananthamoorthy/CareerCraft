import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Users, BarChart } from 'lucide-react'

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/admin/assessments">
            <PlusCircle className="w-4 h-4 mr-2" />
            Manage Assessments
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/users">
            <Users className="w-4 h-4 mr-2" />
            Manage Users
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/insights">
            <BarChart className="w-4 h-4 mr-2" />
            View Insights
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

