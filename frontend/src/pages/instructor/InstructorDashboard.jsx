import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Calendar, Users, CheckCircle, Clock, MapPin, Star, X } from 'lucide-react'

const initialSchedules = [
  { id: 1, enrollment: { student: { full_name: 'Juan Dela Cruz' } }, session_type: 'practical', start_time: '08:00', end_time: '10:00', status: 'completed', vehicle: { display_name: 'Toyota Vios' }, rating: 4 },
  { id: 2, enrollment: { student: { full_name: 'Maria Garcia' } }, session_type: 'practical', start_time: '10:00', end_time: '12:00', status: 'in_progress', vehicle: { display_name: 'Honda City' }, rating: null },
  { id: 3, enrollment: { student: { full_name: 'Pedro Reyes' } }, session_type: 'vr_simulation', start_time: '14:00', end_time: '15:00', status: 'scheduled', vehicle: null, rating: null },
  { id: 4, enrollment: { student: { full_name: 'Ana Santos' } }, session_type: 'practical', start_time: '15:00', end_time: '17:00', status: 'scheduled', vehicle: { display_name: 'Toyota Vios' }, rating: null },
]

export default function InstructorDashboard() {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState(initialSchedules)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')

  const stats = [
    { label: 'Today', value: schedules.length, icon: Calendar, color: 'bg-blue-500' },
    { label: 'This Week', value: 18, icon: Clock, color: 'bg-purple-500' },
    { label: 'Students', value: 12, icon: Users, color: 'bg-green-500' },
    { label: 'Completed', value: 45, icon: CheckCircle, color: 'bg-orange-500' },
  ]

  const startSession = (id) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, status: 'in_progress' } : s))
  }

  const openCompleteModal = (session) => {
    setSelectedSession(session)
    setRating(0)
    setFeedback('')
    setShowCompleteModal(true)
  }

  const completeSession = () => {
    if (selectedSession) {
      setSchedules(prev => prev.map(s => s.id === selectedSession.id ? { ...s, status: 'completed', rating } : s))
      setShowCompleteModal(false)
    }
  }

  const getSessionIcon = (type) => {
    const icons = { theory: '📚', practical: '🚗', vr_simulation: '🎮', exam: '📝' }
    return icons[type] || '📋'
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Good day, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-sm text-gray-500">Here's your schedule for today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 md:mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <h2 className="font-semibold mb-4">Today's Schedule</h2>
        <div className="space-y-3">
          {schedules.map((session) => (
            <div key={session.id} className={`p-3 md:p-4 rounded-lg border-l-4 ${
              session.status === 'in_progress' ? 'border-yellow-500 bg-yellow-50' :
              session.status === 'completed' ? 'border-green-500 bg-green-50' :
              'border-blue-500 bg-blue-50'
            }`}>
              {/* Mobile Layout */}
              <div className="md:hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-blue-600">{session.start_time} - {session.end_time}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    session.status === 'completed' ? 'bg-green-100 text-green-700' :
                    session.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>{session.status.replace('_', ' ')}</span>
                </div>
                <p className="font-medium">{getSessionIcon(session.session_type)} {session.enrollment.student.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">{session.session_type.replace('_', ' ')}</p>
                {session.vehicle && <p className="text-xs text-gray-500 mt-1">🚗 {session.vehicle.display_name}</p>}
                <div className="mt-2 flex gap-2">
                  {session.status === 'scheduled' && (
                    <button onClick={() => startSession(session.id)} className="btn btn-primary text-xs py-1 flex-1">Start</button>
                  )}
                  {session.status === 'in_progress' && (
                    <button onClick={() => openCompleteModal(session)} className="btn btn-success text-xs py-1 flex-1">Complete</button>
                  )}
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold">{session.start_time}</p>
                    <p className="text-xs text-gray-500">{session.end_time}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getSessionIcon(session.session_type)}</span>
                      <span className="font-medium">{session.enrollment.student.full_name}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="capitalize">{session.session_type.replace('_', ' ')}</span>
                      {session.vehicle && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {session.vehicle.display_name}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session.status === 'completed' ? 'bg-green-100 text-green-700' :
                    session.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>{session.status.replace('_', ' ')}</span>
                  {session.status === 'scheduled' && <button onClick={() => startSession(session.id)} className="btn btn-primary text-sm py-1">Start</button>}
                  {session.status === 'in_progress' && <button onClick={() => openCompleteModal(session)} className="btn btn-success text-sm py-1">Complete</button>}
                  {session.status === 'completed' && session.rating && (
                    <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < session.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Modal */}
      {showCompleteModal && selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold">Complete Session</h2>
              <button onClick={() => setShowCompleteModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="font-medium">{selectedSession.enrollment.student.full_name}</p>
                <p className="text-sm text-gray-500">{selectedSession.session_type.replace('_', ' ')} • {selectedSession.start_time}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rate this session</label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)}>
                      <Star className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea className="input" rows="2" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowCompleteModal(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button onClick={completeSession} className="btn btn-success flex-1">Complete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
