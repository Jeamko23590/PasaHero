import { useState } from 'react'
import { Search, Phone, Mail, TrendingUp } from 'lucide-react'

const mockStudents = [
  { id: 1, full_name: 'Juan Dela Cruz', email: 'juan@email.com', phone: '09171234567', course: 'TDC + PDC Non-Pro', progress: 65, sessions_completed: 8, next_session: '2024-12-27 08:00' },
  { id: 2, full_name: 'Maria Garcia', email: 'maria@email.com', phone: '09181234567', course: 'Professional Driver Course', progress: 40, sessions_completed: 5, next_session: '2024-12-26 10:00' },
  { id: 3, full_name: 'Pedro Reyes', email: 'pedro@email.com', phone: '09191234567', course: 'Motorcycle Course', progress: 85, sessions_completed: 12, next_session: '2024-12-28 09:00' },
  { id: 4, full_name: 'Ana Santos', email: 'ana@email.com', phone: '09201234567', course: 'TDC + PDC Non-Pro', progress: 20, sessions_completed: 3, next_session: '2024-12-27 14:00' },
]

export default function InstructorStudents() {
  const [students] = useState(mockStudents)
  const [search, setSearch] = useState('')

  const filtered = students.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Students</h1>
        <p className="text-gray-500">Students currently assigned to you</p>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((student) => (
          <div key={student.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{student.full_name}</h3>
                <p className="text-sm text-gray-500">{student.course}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{student.progress}%</p>
                <p className="text-xs text-gray-500">Progress</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${student.progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-gray-500">Sessions Completed</p>
                <p className="font-medium">{student.sessions_completed}</p>
              </div>
              <div>
                <p className="text-gray-500">Next Session</p>
                <p className="font-medium">{student.next_session}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <a href={`mailto:${student.email}`} className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
                <Mail className="w-4 h-4" /> Email
              </a>
              <a href={`tel:${student.phone}`} className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
                <Phone className="w-4 h-4" /> Call
              </a>
              <button className="ml-auto btn btn-secondary text-sm py-1">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
