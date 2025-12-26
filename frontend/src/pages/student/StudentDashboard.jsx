import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Calendar, BookOpen, Award, TrendingUp } from 'lucide-react'

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
  ]
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [data] = useState(mockData)

  const getSessionIcon = (type) => {
    const icons = { theory: '📚', practical: '🚗', vr_simulation: '🎮', exam: '📝' }
    return icons[type] || '📋'
  }

  const stats = [
    { label: 'Theory', value: `${data.enrollment.theory_hours_completed}/${data.enrollment.course.theory_hours}h`, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Practical', value: `${data.enrollment.practical_hours_completed}/${data.enrollment.course.practical_hours}h`, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'VR', value: `${data.enrollment.vr_hours_completed}/${data.enrollment.course.vr_simulation_hours}h`, icon: Award, color: 'bg-purple-500' },
  ]

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-sm text-gray-500">Track your progress</p>
      </div>

      {/* Course Progress Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm opacity-80">Current Course</p>
            <p className="font-bold text-lg md:text-xl">{data.enrollment.course.name}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl md:text-4xl font-bold">{data.enrollment.progress_percentage}%</p>
          </div>
        </div>
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: `${data.enrollment.progress_percentage}%` }} />
        </div>
        <p className="text-xs mt-2 opacity-80">Valid until: {data.enrollment.expiry_date}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4 md:mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-3 md:p-4 shadow-sm border text-center">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-lg md:text-xl font-bold">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Upcoming Sessions</h2>
          <Calendar className="w-4 h-4 text-gray-400" />
        </div>
        <div className="space-y-3">
          {data.upcoming_schedules.map((session) => (
            <div key={session.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl">{getSessionIcon(session.session_type)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm capitalize">{session.session_type.replace('_', ' ')}</p>
                <p className="text-xs text-gray-500 truncate">with {session.instructor.full_name}</p>
              </div>
              <div className="text-right text-xs">
                <p className="font-medium">{session.scheduled_date}</p>
                <p className="text-gray-500">{session.start_time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
