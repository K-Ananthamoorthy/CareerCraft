// src/app/assessment/[id]/results/page.tsx
import ResultsPage from './ResultPage'

export default function Page({ params }: { params: { id: string } }) {
  return <ResultsPage params={params} />
}