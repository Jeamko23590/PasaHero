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
    <div className="p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold">My Schedule</h1>
        <p className="text-sm text-gray-500">Your sessions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium text-sm ${filter === 'upcoming' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium text-sm ${filter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
        >
          Completed ({completed.length})
        </button>
      </div>

      {/* Schedule List */}
      <div className="space-y-3">
        {displayed.map((session) => (
          <div key={session.id} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${getSessionColor(session.session_type)}`}>
            <div className="flex items-start gap-3">
              <div className="text-2xl md:text-3xl">{getSessionIcon(session.session_type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold capitalize">{session.session_type.replace('_', ' ')}</h3>
                  {session.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {session.scheduled_date}</p>
                  <p className="flex items-center gap-1"><Clock className="w-3 h-3" /> {session.start_time} - {session.end_time}</p>
                  <p className="flex items-center gap-1"><User className="w-3 h-3" /> {session.instructor.full_name}</p>
                  {session.vehicle && <p className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {session.vehicle.display_name}</p>}
                </div>
              </div>
            </div>
          </div>
        ))}

        {displayed.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No {filter} sessions</p>
          </div>
        )}
      </div>
    </div>
  )
}
