import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Calendar, Users, CheckCircle, Clock, MapPin, User, Star, X } from 'lucide-react'

const initialSchedules = [
  { id: 1, enrollment: { student: { full_name: 'Juan Dela Cruz' } }, session_type: 'practical', start_time: '08:00', end_time: '10:00', status: 'completed', vehicle: { display_name: 'Toyota Vios' }, rating: 4, feedback: '' },
  { id: 2, enrollment: { student: { full_name: 'Maria Garcia' } }, session_type: 'practical', start_time: '10:00', end_time: '12:00', status: 'in_progress', vehicle: { display_name: 'Honda City' }, rating: null, feedback: '' },
  { id: 3, enrollment: { student: { full_name: 'Pedro Reyes' } }, session_type: 'vr_simulation', start_time: '14:00', end_time: '15:00', status: 'scheduled', vehicle: null, rating: null, feedback: '' },
  { id: 4, enrollment: { student: { full_name: 'Ana Santos' } }, session_type: 'practical', start_time: '15:00', end_time: '17:00', status: 'scheduled', vehicle: { display_name: 'Toyota Vios' }, rating: null, feedback: '' },
]

export default function InstructorDashboard() {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState(initialSchedules)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')

  const stats = {
    today_sessions: schedules.length,
    week_sessions: 18,
    total_students: 12,
    completed_this_month: 45 + schedules.filter(s => s.status === 'completed').length
  }

  const startSession = (id) => {
    setSchedules(prev => prev.map(s => 
      s.id === id ? { ...s, status: 'in_progress' } : s
    ))
  }

  const openCompleteModal = (session) => {
    setSelectedSession(session)
    setRating(0)
    setFeedback('')
    setShowCompleteModal(true)
  }

  const completeSession = () => {
    if (selectedSession) {
      setSchedules(prev => prev.map(s => 
        s.id === selectedSession.id ? { ...s, status: 'completed', rating, feedback } : s
      ))
      setShowCompleteModal(false)
      setSelectedSession(null)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status.replace('_', ' ')}</span>
  }

  const getSessionIcon = (type) => {
    const icons = { theory: '📚', practical: '🚗', vr_simulation: '🎮', exam: '📝' }
    return icons[type] || '📋'
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Good day, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500">Here's your schedule for today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.today_sessions}</p>
              <p className="text-sm text-gray-500">Today's Sessions</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.week_sessions}</p>
              <p className="text-sm text-gray-500">This Week</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total_students}</p>
              <p className="text-sm text-gray-500">Active Students</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed_this_month}</p>
              <p className="text-sm text-gray-500">Completed (Month)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
        <div className="space-y-3">
          {schedules.map((session) => (
            <div 
              key={session.id} 
              className={`p-4 rounded-lg border-l-4 ${
                session.status === 'in_progress' ? 'border-yellow-500 bg-yellow-50' :
                session.status === 'completed' ? 'border-green-500 bg-green-50' :
                'border-blue-500 bg-blue-50'
              }`}
            >
              <div className="flex items-center justify-between">
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
                      {session.vehicle && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {session.vehicle.display_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(session.status)}
                  {session.status === 'scheduled' && (
                    <button 
                      onClick={() => startSession(session.id)}
                      className="btn btn-primary text-sm py-1"
                    >
                      Start
                    </button>
                  )}
                  {session.status === 'in_progress' && (
                    <button 
                      onClick={() => openCompleteModal(session)}
                      className="btn btn-success text-sm py-1"
                    >
                      Complete
                    </button>
                  )}
                  {session.status === 'completed' && session.rating && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < session.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Session Modal */}
      {showCompleteModal && selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md m-4">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Complete Session</h2>
              <button onClick={() => setShowCompleteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-medium">{selectedSession.enrollment.student.full_name}</p>
                <p className="text-sm text-gray-500 capitalize">{selectedSession.session_type.replace('_', ' ')} • {selectedSession.start_time} - {selectedSession.end_time}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rate this session</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Feedback / Notes</label>
                <textarea
                  className="input"
                  rows="3"
                  placeholder="How did the student perform?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setShowCompleteModal(false)} className="btn btn-secondary">Cancel</button>
                <button onClick={completeSession} className="btn btn-success">Mark Complete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
