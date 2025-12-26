import { useState } from 'react'
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react'

const mockSessions = [
  { id: 1, student: 'Juan Dela Cruz', session_type: 'practical', date: '2024-12-25', time: '08:00 - 10:00', status: 'completed', rating: 4, notes: 'Good progress on parallel parking' },
  { id: 2, student: 'Maria Garcia', session_type: 'theory', date: '2024-12-25', time: '10:00 - 12:00', status: 'completed', rating: 5, notes: 'Excellent understanding' },
  { id: 3, student: 'Pedro Reyes', session_type: 'vr_simulation', date: '2024-12-24', time: '14:00 - 15:00', status: 'completed', rating: 3, notes: 'Needs more practice' },
  { id: 4, student: 'Ana Santos', session_type: 'practical', date: '2024-12-24', time: '08:00 - 10:00', status: 'no_show', rating: null, notes: 'Did not attend' },
  { id: 5, student: 'Jose Cruz', session_type: 'exam', date: '2024-12-23', time: '09:00 - 11:00', status: 'completed', rating: 5, notes: 'Passed exam' },
]

export default function InstructorSessions() {
  const [sessions] = useState(mockSessions)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.status === filter)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'no_show': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getSessionColor = (type) => {
    const colors = { theory: 'bg-blue-100 text-blue-700', practical: 'bg-green-100 text-green-700', vr_simulation: 'bg-purple-100 text-purple-700', exam: 'bg-orange-100 text-orange-700' }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Session Log</h1>
        <p className="text-sm text-gray-500">History of your sessions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm" />
          </div>
          <select className="input md:w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="no_show">No Show</option>
          </select>
        </div>
      </div>

      {/* Mobile: Card Layout */}
      <div className="md:hidden space-y-3">
        {filtered.map((session) => (
          <div key={session.id} className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">{session.date}</span>
              <div className="flex items-center gap-1">
                {getStatusIcon(session.status)}
                <span className="text-xs capitalize">{session.status.replace('_', ' ')}</span>
              </div>
            </div>
            <p className="font-medium">{session.student}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-xs ${getSessionColor(session.session_type)}`}>
                {session.session_type.replace('_', ' ')}
              </span>
              <span className="text-xs text-gray-500">{session.time}</span>
            </div>
            {session.rating && (
              <div className="flex mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-sm ${i < session.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                ))}
              </div>
            )}
            {session.notes && <p className="text-xs text-gray-500 mt-2">{session.notes}</p>}
          </div>
        ))}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-4 py-3">Date</th>
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
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getSessionColor(session.session_type)}`}>
                    {session.session_type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(session.status)}
                    <span className="capitalize">{session.status.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {session.rating ? (
                    <div className="flex">{[...Array(5)].map((_, i) => <span key={i} className={i < session.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>)}</div>
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
