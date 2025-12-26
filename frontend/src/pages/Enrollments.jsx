import { useState } from 'react'
import { Plus, DollarSign, TrendingUp, CheckCircle, X } from 'lucide-react'

const mockEnrollments = [
  { id: 1, enrollment_number: 'ENR-202412-0001', student: { full_name: 'Juan Dela Cruz' }, course: { name: 'TDC + PDC Non-Pro', price: 5500 }, enrollment_date: '2024-12-01', expiry_date: '2025-03-01', status: 'active', payment_status: 'paid', amount_paid: 5500, balance: 0, progress_percentage: 65 },
  { id: 2, enrollment_number: 'ENR-202412-0002', student: { full_name: 'Maria Garcia' }, course: { name: 'Professional Driver', price: 8500 }, enrollment_date: '2024-12-05', expiry_date: '2025-03-05', status: 'active', payment_status: 'partial', amount_paid: 5000, balance: 3500, progress_percentage: 30 },
  { id: 3, enrollment_number: 'ENR-202412-0003', student: { full_name: 'Pedro Reyes' }, course: { name: 'Motorcycle Course', price: 3500 }, enrollment_date: '2024-11-15', expiry_date: '2025-02-15', status: 'completed', payment_status: 'paid', amount_paid: 3500, balance: 0, progress_percentage: 100 },
  { id: 4, enrollment_number: 'ENR-202412-0004', student: { full_name: 'Ana Santos' }, course: { name: 'TDC + PDC Non-Pro', price: 5500 }, enrollment_date: '2024-12-20', expiry_date: '2025-03-20', status: 'active', payment_status: 'pending', amount_paid: 0, balance: 5500, progress_percentage: 0 },
]

const mockCourses = [
  { id: 1, name: 'TDC + PDC Non-Pro', price: 5500, theory_hours: 15, practical_hours: 8, vr_simulation_hours: 2 },
  { id: 2, name: 'Professional Driver', price: 8500, theory_hours: 20, practical_hours: 15, vr_simulation_hours: 5 },
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
    const styles = { active: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700', expired: 'bg-red-100 text-red-700' }
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>{status}</span>
  }

  const getPaymentBadge = (status) => {
    const styles = { paid: 'bg-green-100 text-green-700', partial: 'bg-yellow-100 text-yellow-700', pending: 'bg-red-100 text-red-700' }
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>{status}</span>
  }

  const openPaymentModal = (enrollment) => {
    setSelectedEnrollment(enrollment)
    setPaymentAmount('')
    setShowPaymentModal(true)
  }

  const stats = [
    { label: 'Active', value: enrollments.filter(e => e.status === 'active').length, icon: TrendingUp, color: 'bg-blue-500' },
    { label: 'Paid', value: enrollments.filter(e => e.payment_status === 'paid').length, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Collected', value: `₱${(enrollments.reduce((sum, e) => sum + e.amount_paid, 0) / 1000).toFixed(0)}K`, icon: DollarSign, color: 'bg-yellow-500' },
    { label: 'Pending', value: `₱${(enrollments.reduce((sum, e) => sum + e.balance, 0) / 1000).toFixed(0)}K`, icon: DollarSign, color: 'bg-red-500' },
  ]

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Enrollments</h1>
          <p className="text-sm text-gray-500">Manage enrollments & payments</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> New Enrollment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-3 md:p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: Card Layout */}
      <div className="md:hidden space-y-3">
        {enrollments.map((enrollment) => (
          <div key={enrollment.id} className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium">{enrollment.student.full_name}</p>
                <p className="text-xs text-gray-500">{enrollment.course.name}</p>
              </div>
              {getStatusBadge(enrollment.status)}
            </div>
            
            {/* Progress */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium">{enrollment.progress_percentage}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${enrollment.progress_percentage}%` }} />
              </div>
            </div>

            {/* Payment Info */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getPaymentBadge(enrollment.payment_status)}
                {enrollment.balance > 0 && (
                  <span className="text-xs text-red-600 font-medium">₱{enrollment.balance.toLocaleString()} due</span>
                )}
              </div>
              <span className="text-xs text-gray-500">₱{enrollment.amount_paid.toLocaleString()} paid</span>
            </div>

            {/* Action Button */}
            {enrollment.balance > 0 && (
              <button 
                onClick={() => openPaymentModal(enrollment)}
                className="btn btn-success w-full text-sm py-2"
              >
                <DollarSign className="w-4 h-4 inline mr-1" /> Add Payment
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
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
                <td className="px-4 py-3">
                  <p className="font-medium">{enrollment.student.full_name}</p>
                  <p className="text-xs text-gray-500 font-mono">{enrollment.enrollment_number}</p>
                </td>
                <td className="px-4 py-3">
                  <p>{enrollment.course.name}</p>
                  <p className="text-xs text-gray-500">₱{enrollment.course.price.toLocaleString()}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${enrollment.progress_percentage}%` }} />
                    </div>
                    <span className="text-sm">{enrollment.progress_percentage}%</span>
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
                    <button onClick={() => openPaymentModal(enrollment)} className="btn btn-success text-sm py-1 px-3">
                      Pay
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold">New Enrollment</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student</label>
                <select className="input" value={formData.student_id}
                  onChange={(e) => setFormData({...formData, student_id: e.target.value})}>
                  <option value="">Select student...</option>
                  {mockStudents.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <select className="input" value={formData.course_id}
                  onChange={(e) => setFormData({...formData, course_id: e.target.value})}>
                  <option value="">Select course...</option>
                  {mockCourses.map(c => <option key={c.id} value={c.id}>{c.name} - ₱{c.price.toLocaleString()}</option>)}
                </select>
              </div>
              {formData.course_id && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  {(() => {
                    const course = mockCourses.find(c => c.id === parseInt(formData.course_id))
                    return course ? (
                      <>
                        <p>Theory: {course.theory_hours}h | Practical: {course.practical_hours}h | VR: {course.vr_simulation_hours}h</p>
                        <p className="font-bold mt-1">Total: ₱{course.price.toLocaleString()}</p>
                      </>
                    ) : null
                  })()}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Initial Payment</label>
                <input type="number" className="input" placeholder="0" value={formData.amount_paid}
                  onChange={(e) => setFormData({...formData, amount_paid: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold">Add Payment</h2>
              <button onClick={() => setShowPaymentModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4 text-center">
                <p className="text-sm text-gray-500">Student</p>
                <p className="font-medium">{selectedEnrollment.student.full_name}</p>
                <p className="text-sm text-gray-500 mt-3">Balance Due</p>
                <p className="text-3xl font-bold text-red-600">₱{selectedEnrollment.balance.toLocaleString()}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Payment Amount</label>
                <input 
                  type="number" 
                  className="input text-lg" 
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  max={selectedEnrollment.balance}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowPaymentModal(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button className="btn btn-success flex-1">
                  <CheckCircle className="w-4 h-4 inline mr-1" /> Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
