import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Calendar, BookOpen, Award, Clock, TrendingUp, CheckCircle } from 'lucide-react'

const mockData = {
  enrollment: {
    course: { name: 'TDC + PDC Non-Professional', theory_hours: 15, practical_hours: 8, vr_simulation_hours: 2 },
    theory_hours_completed: 10,
    practical_hours_completed: 5,
    vr_hours_completed: 1,
    progress_percentage: 64,
    expiry_date: '2025-03-01'
  },
  upcoming_schedules: [
    { id: 1, instructor: { full_name: 'Mark Santos' }, session_type: 'practical', scheduled_date: '2024-12-27', start_time: '08:00', end_time: '10:00' },
    { id: 2, instructor: { full_name: 'Ana Reyes' }, session_type: 'theory', scheduled_date: '2024-12-28', start_time: '09:00', end_time: '12:00' },
    { id: 3, instructor: { full_name: 'Jose Cruz' }, session_type: 'vr_simulation', scheduled_date: '2024-12-30', start_time: '14:00', end_time: '15:00' },
  ],
  stats: {
    completed_sessions: 12,
    certificates_earned: 1,
    progress: 64
  }
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [data] = useState(mockData)

  const getSessionIcon = (type) => {
    const icons = { theory: '📚', practical: '🚗', vr_simulation: '🎮', exam: '📝' }
    return icons[type] || '📋'
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500">Track your driving course progress</p>
      </div>

      {/* Course Progress Card */}
      <div className="card mb-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold opacity-90">Current Course</h2>
            <p className="text-2xl font-bold">{data.enrollment.course.name}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{data.enrollment.progress_percentage}%</p>
            <p className="text-sm opacity-80">Complete</p>
          </div>
        </div>
        <div className="h-3 bg-white/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${data.enrollment.progress_percentage}%` }}
          />
        </div>
        <p className="text-sm mt-2 opacity-80">Valid until: {data.enrollment.expiry_date}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.enrollment.theory_hours_completed}/{data.enrollment.course.theory_hours}</p>
              <p className="text-sm text-gray-500">Theory Hours</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.enrollment.practical_hours_completed}/{data.enrollment.course.practical_hours}</p>
              <p className="text-sm text-gray-500">Practical Hours</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.enrollment.vr_hours_completed}/{data.enrollment.course.vr_simulation_hours}</p>
              <p className="text-sm text-gray-500">VR Hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {data.upcoming_schedules.map((session) => (
            <div key={session.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl">{getSessionIcon(session.session_type)}</div>
              <div className="flex-1">
                <p className="font-medium capitalize">{session.session_type.replace('_', ' ')}</p>
                <p className="text-sm text-gray-500">with {session.instructor.full_name}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{session.scheduled_date}</p>
                <p className="text-sm text-gray-500">{session.start_time} - {session.end_time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
