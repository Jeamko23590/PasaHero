import { useState } from 'react'
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react'

const mockStudents = [
  { id: 1, student_id: 'STU-2024-00001', full_name: 'Juan Dela Cruz', email: 'juan@email.com', phone: '09171234567', license_type: 'non-pro', status: 'enrolled', age: 22 },
  { id: 2, student_id: 'STU-2024-00002', full_name: 'Maria Garcia', email: 'maria@email.com', phone: '09181234567', license_type: 'professional', status: 'in_progress', age: 28 },
  { id: 3, student_id: 'STU-2024-00003', full_name: 'Pedro Reyes', email: 'pedro@email.com', phone: '09191234567', license_type: 'motorcycle', status: 'completed', age: 25 },
  { id: 4, student_id: 'STU-2024-00004', full_name: 'Ana Santos', email: 'ana@email.com', phone: '09201234567', license_type: 'non-pro', status: 'pending', age: 19 },
  { id: 5, student_id: 'STU-2024-00005', full_name: 'Jose Cruz', email: 'jose@email.com', phone: '09211234567', license_type: 'professional', status: 'enrolled', age: 35 },
]

export default function Students() {
  const [students] = useState(mockStudents)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '', birth_date: '',
    address: '', license_type: 'non-pro', emergency_contact_name: '', emergency_contact_phone: ''
  })

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.student_id.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'badge-warning',
      enrolled: 'badge-primary',
      in_progress: 'badge-primary',
      completed: 'badge-success',
      dropped: 'badge-danger'
    }
    return <span className={`badge ${styles[status]}`}>{status.replace('_', ' ')}</span>
  }

  const getLicenseBadge = (type) => {
    const labels = { 'non-pro': 'Non-Pro', 'professional': 'Pro', 'motorcycle': 'MC' }
    return <span className="badge bg-gray-100 text-gray-700">{labels[type]}</span>
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submit:', formData)
    setShowModal(false)
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Students</h1>
          <p className="text-sm text-gray-500">Manage student registrations</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> <span>Add Student</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="input flex-1 sm:flex-none sm:w-auto text-sm">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="enrolled">Enrolled</option>
              <option value="completed">Completed</option>
            </select>
            <select className="input flex-1 sm:flex-none sm:w-auto text-sm">
              <option value="">All Types</option>
              <option value="non-pro">Non-Pro</option>
              <option value="professional">Pro</option>
              <option value="motorcycle">MC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs sm:text-sm text-gray-500">
                <th className="px-3 sm:px-4 py-3">Student ID</th>
                <th className="px-3 sm:px-4 py-3">Name</th>
                <th className="px-3 sm:px-4 py-3 hidden sm:table-cell">Contact</th>
                <th className="px-3 sm:px-4 py-3">Type</th>
                <th className="px-3 sm:px-4 py-3">Status</th>
                <th className="px-3 sm:px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-t hover:bg-gray-50 text-xs sm:text-sm">
                  <td className="px-3 sm:px-4 py-3 font-mono">{student.student_id}</td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="font-medium">{student.full_name}</div>
                    <div className="text-xs text-gray-500 sm:hidden">{student.email}</div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 hidden sm:table-cell">
                    <div className="text-sm">{student.email}</div>
                    <div className="text-xs text-gray-500">{student.phone}</div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">{getLicenseBadge(student.license_type)}</td>
                  <td className="px-3 sm:px-4 py-3">{getStatusBadge(student.status)}</td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded" title="View">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded hidden sm:block" title="Edit">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded hidden sm:block" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b">
              <h2 className="text-lg sm:text-xl font-bold">Register New Student</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name *</label>
                  <input type="text" className="input" required value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name *</label>
                  <input type="text" className="input" required value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input type="email" className="input" required value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input type="tel" className="input" required value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Birth Date *</label>
                  <input type="date" className="input" required value={formData.birth_date}
                    onChange={(e) => setFormData({...formData, birth_date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">License Type *</label>
                  <select className="input" value={formData.license_type}
                    onChange={(e) => setFormData({...formData, license_type: e.target.value})}>
                    <option value="non-pro">Non-Professional</option>
                    <option value="professional">Professional</option>
                    <option value="motorcycle">Motorcycle</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address *</label>
                  <textarea className="input" rows="2" required value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Emergency Contact</label>
                  <input type="text" className="input" value={formData.emergency_contact_name}
                    onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Emergency Phone</label>
                  <input type="tel" className="input" value={formData.emergency_contact_phone}
                    onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
