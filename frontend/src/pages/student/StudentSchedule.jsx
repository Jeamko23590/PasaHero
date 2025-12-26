import { useState } from 'react'
import { Calendar, Clock, User, MapPin, CheckCircle } from 'lucide-react'

const mockSchedules = [
  { id: 1, instructor: { full_name: 'Mark Santos' }, vehicle: { display_name: 'Toyota Vios' }, session_type: 'practical', scheduled_date: '2024-12-27', start_time: '08:00', end_time: '10:00', status: 'scheduled' },
  { id: 2, instructor: { full_name: 'Ana Reyes' }, vehicle: null, session_type: 'theory', scheduled_date: '2024-12-28', start_time: '09:00', end_time: '12:00', status: 'scheduled' },
  { id: 3, instructor: { full_name: 'Jose Cruz' }, vehicle: null, session_type: 'vr_simulation', scheduled_date: '2024-12-30', start_time: '14:00', end_time: '15:00', status: 'scheduled' },
  { id: 4, instructor: { full_name: 'Mark Santos' }, vehicle: { display_name: 'Toyota Vios' }, session_type: 'practical', scheduled_date: '2024-12-25', start_time: '08:00', end_time: '10:00', status: 'completed' },
  { id: 5, instructor: { full_name: 'Ana Reyes' }, vehicle: null, session_type: 'theory', scheduled_date: '2024-12-24', start_time: '09:00', end_time: '12:00', status: 'completed' },
]

export default function StudentSchedule() {
  const [filter, setFilter] = useState('upcoming')

  const upcoming = mockSchedules.filter(s => s.status === 'scheduled')
  const completed = mockSchedules.filter(s => s.status === 'completed')
  const displayed = filter === 'upcoming' ? upcoming : completed

  const getSessionColor = (type) => {
    const colors = {
      theory: 'border-blue-500 bg-blue-50',
      practical: 'border-green-500 bg-green-50',
      vr_simulation: 'border-purple-500 bg-purple-50',
      exam: 'border-orange-500 bg-orange-50'
    }
    return colors[type] || 'border-gray-500 bg-gray-50'
  }

  const getSessionIcon = (type) => {
    const icons = { theory: '📚', practical: '🚗', vr_simulation: '🎮', exam: '📝' }
    return icons[type] || '📋'
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Schedule</h1>
        <p className="text-gray-500">View your upcoming and past sessions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'upcoming' ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Completed ({completed.length})
        </button>
      </div>

      {/* Schedule List */}
      <div className="space-y-4">
        {displayed.map((session) => (
          <div key={session.id} className={`card border-l-4 ${getSessionColor(session.session_type)}`}>
            <div className="flex items-center gap-4">
              <div className="text-4xl">{getSessionIcon(session.session_type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg capitalize">{session.session_type.replace('_', ' ')}</h3>
                  {session.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {session.scheduled_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {session.start_time} - {session.end_time}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" /> {session.instructor.full_name}
                  </span>
                  {session.vehicle && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {session.vehicle.display_name}
                    </span>
                  )}
                </div>
              </div>
              {session.status === 'scheduled' && (
                <button className="btn btn-secondary text-sm">Reschedule</button>
              )}
            </div>
          </div>
        ))}

        {displayed.length === 0 && (
          <div className="card text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No {filter} sessions</p>
          </div>
        )}
      </div>
    </div>
  )
}
