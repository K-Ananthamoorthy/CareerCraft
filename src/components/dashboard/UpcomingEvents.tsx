import { CalendarIcon, GraduationCapIcon, ClockIcon } from 'lucide-react'

interface UpcomingEventsProps {
  events: Array<{ title: string; date: string; type: string }> | undefined
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'workshop':
        return <GraduationCapIcon className="w-5 h-5" />
      case 'deadline':
        return <ClockIcon className="w-5 h-5" />
      default:
        return <CalendarIcon className="w-5 h-5" />
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Upcoming Events</h2>
      <ul className="space-y-4">
        {events?.map((event, index) => (
          <li key={index} className="flex items-center space-x-3">
            {getIcon(event.type)}
            <div>
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

