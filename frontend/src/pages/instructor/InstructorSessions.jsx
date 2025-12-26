import { useState } from 'react'
import { Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react'

const mockSessions = [
  { id: 1, student: 'Juan Dela Cruz', session_type: 'practical', date: '2024-12-25', time: '08:00 - 10:00', status: 'completed', rating: 4, notes: 'Good progress on parallel parking' },
  { id: 2, student: 'Maria Garcia', session_type: 'theory', date: '2024-12-25', time: '10:00 - 12:00', status: 'completed', rating: 5, notes: 'Excellent understanding of traffic rules' },
  { id: 3, student: 'Pedro Reyes', session_type: 'vr_simulation', date: '2024-12-24', time: '14:00 - 15:00', status: 'completed', rating: 3, notes: 'Needs more practice on highway driving' },
  { id: 4, student: 'Ana Santos', session_type: 'practical', date: '2024-12-24', time: '08:00 - 10:00', status: 'no_show', rating: null, notes: 'Student did not attend' },
  { id: 5, student: 'Jose Cruz', session_type: 'exam', date: '2024-12-23', time: '09:00 - 11:00', status: 'completed', rating: 5, notes: 'Passed practical exam' },
]

export default function InstructorSessions() {
  const [sessions] = useState(mockSessions)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.status === filter)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'no_show': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getSessionBadge = (type) => {
    const colors = {
      theory: 'bg-blue-100 text-blue-700',
      practical: 'bg-green-100 text-green-700',
      vr_simulation: 'bg-purple-100 text-purple-700',
      exam: 'bg-orange-100 text-orange-700'
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type]}`}>{type.replace('_', ' ')}</span>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Session Log</h1>
        <p className="text-gray-500">History of all your teaching sessions</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search sessions..." 
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" 
            />
          </div>
          <select className="input w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="no_show">No Show</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="card">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-4 py-3">Date & Time</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((session) => (
              <tr key={session.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{session.date}</div>
                  <div className="text-sm text-gray-500">{session.time}</div>
                </td>
                <td className="px-4 py-3 font-medium">{session.student}</td>
                <td className="px-4 py-3">{getSessionBadge(session.session_type)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(session.status)}
                    <span className="capitalize">{session.status.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {session.rating ? (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < session.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                      ))}
                    </div>
                  ) : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{session.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
