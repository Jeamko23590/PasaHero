import { useState } from 'react'
import { Plus, Search, DollarSign, TrendingUp, CheckCircle } from 'lucide-react'

const mockEnrollments = [
  { id: 1, enrollment_number: 'ENR-202412-0001', student: { full_name: 'Juan Dela Cruz' }, course: { name: 'TDC + PDC Non-Pro', price: 5500 }, enrollment_date: '2024-12-01', expiry_date: '2025-03-01', status: 'active', payment_status: 'paid', amount_paid: 5500, balance: 0, progress_percentage: 65 },
  { id: 2, enrollment_number: 'ENR-202412-0002', student: { full_name: 'Maria Garcia' }, course: { name: 'Professional Driver Course', price: 8500 }, enrollment_date: '2024-12-05', expiry_date: '2025-03-05', status: 'active', payment_status: 'partial', amount_paid: 5000, balance: 3500, progress_percentage: 30 },
  { id: 3, enrollment_number: 'ENR-202412-0003', student: { full_name: 'Pedro Reyes' }, course: { name: 'Motorcycle Course', price: 3500 }, enrollment_date: '2024-11-15', expiry_date: '2025-02-15', status: 'completed', payment_status: 'paid', amount_paid: 3500, balance: 0, progress_percentage: 100 },
  { id: 4, enrollment_number: 'ENR-202412-0004', student: { full_name: 'Ana Santos' }, course: { name: 'TDC + PDC Non-Pro', price: 5500 }, enrollment_date: '2024-12-20', expiry_date: '2025-03-20', status: 'active', payment_status: 'pending', amount_paid: 0, balance: 5500, progress_percentage: 0 },
]

const mockCourses = [
  { id: 1, name: 'TDC + PDC Non-Pro', price: 5500, theory_hours: 15, practical_hours: 8, vr_simulation_hours: 2 },
  { id: 2, name: 'Professional Driver Course', price: 8500, theory_hours: 20, practical_hours: 15, vr_simulation_hours: 5 },
  { id: 3, name: 'Motorcycle Course', price: 3500, theory_hours: 8, practical_hours: 5, vr_simulation_hours: 2 },
]

const mockStudents = [
  { id: 1, full_name: 'New Student 1', student_id: 'STU-2024-00010' },
  { id: 2, full_name: 'New Student 2', student_id: 'STU-2024-00011' },
]

export default function Enrollments() {
  const [enrollments] = useState(mockEnrollments)
  const [showModal, setShowModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState(null)
  const [formData, setFormData] = useState({ student_id: '', course_id: '', amount_paid: 0 })
  const [paymentAmount, setPaymentAmount] = useState('')

  const getStatusBadge = (status) => {
    const styles = { active: 'badge-primary', completed: 'badge-success', expired: 'badge-danger', cancelled: 'badge-warning' }
    return <span className={`badge ${styles[status]}`}>{status}</span>
  }

  const getPaymentBadge = (status) => {
    const styles = { paid: 'badge-success', partial: 'badge-warning', pending: 'badge-danger' }
    return <span className={`badge ${styles[status]}`}>{status}</span>
  }

  const openPaymentModal = (enrollment) => {
    setSelectedEnrollment(enrollment)
    setPaymentAmount('')
    setShowPaymentModal(true)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Enrollments</h1>
          <p className="text-gray-500">Manage course enrollments and payments</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Enrollment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{enrollments.filter(e => e.status === 'active').length}</p>
            <p className="text-sm text-gray-500">Active Enrollments</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{enrollments.filter(e => e.payment_status === 'paid').length}</p>
            <p className="text-sm text-gray-500">Fully Paid</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">₱{enrollments.reduce((sum, e) => sum + e.amount_paid, 0).toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Collected</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">₱{enrollments.reduce((sum, e) => sum + e.balance, 0).toLocaleString()}</p>
            <p className="text-sm text-gray-500">Pending Balance</p>
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-4 py-3">Enrollment #</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm">{enrollment.enrollment_number}</td>
                <td className="px-4 py-3 font-medium">{enrollment.student.full_name}</td>
                <td className="px-4 py-3">
                  <div>{enrollment.course.name}</div>
                  <div className="text-xs text-gray-500">₱{enrollment.course.price.toLocaleString()}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${enrollment.progress_percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{enrollment.progress_percentage}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getPaymentBadge(enrollment.payment_status)}
                    {enrollment.balance > 0 && (
                      <span className="text-xs text-gray-500">₱{enrollment.balance.toLocaleString()} due</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">{getStatusBadge(enrollment.status)}</td>
                <td className="px-4 py-3">
                  {enrollment.balance > 0 && (
                    <button 
                      onClick={() => openPaymentModal(enrollment)}
                      className="btn btn-success text-sm py-1 px-3"
                    >
                      Add Payment
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Enrollment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg m-4">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">New Enrollment</h2>
            </div>
            <form className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Student *</label>
                  <select className="input" value={formData.student_id}
                    onChange={(e) => setFormData({...formData, student_id: e.target.value})}>
                    <option value="">Choose a student...</option>
                    {mockStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.full_name} ({s.student_id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Select Course *</label>
                  <select className="input" value={formData.course_id}
                    onChange={(e) => setFormData({...formData, course_id: e.target.value})}>
                    <option value="">Choose a course...</option>
                    {mockCourses.map(c => (
                      <option key={c.id} value={c.id}>{c.name} - ₱{c.price.toLocaleString()}</option>
                    ))}
                  </select>
                </div>
                {formData.course_id && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Course Details</h4>
                    {(() => {
                      const course = mockCourses.find(c => c.id === parseInt(formData.course_id))
                      return course ? (
                        <div className="text-sm space-y-1">
                          <p>Theory Hours: {course.theory_hours}h</p>
                          <p>Practical Hours: {course.practical_hours}h</p>
                          <p>VR Simulation: {course.vr_simulation_hours}h</p>
                          <p className="font-medium mt-2">Total: ₱{course.price.toLocaleString()}</p>
                        </div>
                      ) : null
                    })()}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Initial Payment</label>
                  <input type="number" className="input" placeholder="0.00" value={formData.amount_paid}
                    onChange={(e) => setFormData({...formData, amount_paid: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Enrollment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md m-4">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Add Payment</h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-500">Student</p>
                <p className="font-medium">{selectedEnrollment.student.full_name}</p>
                <p className="text-sm text-gray-500 mt-2">Outstanding Balance</p>
                <p className="text-2xl font-bold text-red-600">₱{selectedEnrollment.balance.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Amount *</label>
                <input 
                  type="number" 
                  className="input" 
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  max={selectedEnrollment.balance}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowPaymentModal(false)} className="btn btn-secondary">Cancel</button>
                <button className="btn btn-success">Record Payment</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
