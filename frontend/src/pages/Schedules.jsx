import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, Car, X, CheckCircle, XCircle } from 'lucide-react'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'

const initialSchedules = [
  { id: 1, enrollment: { student: { full_name: 'Juan Dela Cruz' } }, instructor: { full_name: 'Mark Santos' }, vehicle: { display_name: 'Toyota Vios (ABC-123)' }, session_type: 'practical', scheduled_date: '2024-12-26', start_time: '08:00', end_time: '10:00', status: 'scheduled' },
  { id: 2, enrollment: { student: { full_name: 'Maria Garcia' } }, instructor: { full_name: 'Ana Reyes' }, vehicle: null, session_type: 'theory', scheduled_date: '2024-12-26', start_time: '09:00', end_time: '12:00', status: 'confirmed' },
  { id: 3, enrollment: { student: { full_name: 'Pedro Reyes' } }, instructor: { full_name: 'Jose Cruz' }, vehicle: null, session_type: 'vr_simulation', scheduled_date: '2024-12-26', start_time: '14:00', end_time: '15:00', status: 'scheduled' },
  { id: 4, enrollment: { student: { full_name: 'Ana Santos' } }, instructor: { full_name: 'Mark Santos' }, vehicle: { display_name: 'Honda City (XYZ-789)' }, session_type: 'practical', scheduled_date: '2024-12-27', start_time: '08:00', end_time: '10:00', status: 'scheduled' },
  { id: 5, enrollment: { student: { full_name: 'Jose Cruz' } }, instructor: { full_name: 'Ana Reyes' }, vehicle: null, session_type: 'exam', scheduled_date: '2024-12-27', start_time: '10:00', end_time: '11:00', status: 'scheduled' },
]

const mockStudents = [
  { id: 1, full_name: 'Juan Dela Cruz' },
  { id: 2, full_name: 'Maria Garcia' },
  { id: 3, full_name: 'Pedro Reyes' },
  { id: 4, full_name: 'Ana Santos' },
  { id: 5, full_name: 'Jose Cruz' },
]

const mockInstructors = [
  { id: 1, full_name: 'Mark Santos' },
  { id: 2, full_name: 'Ana Reyes' },
  { id: 3, full_name: 'Jose Cruz' },
]

const mockVehicles = [
  { id: 1, display_name: 'Toyota Vios (ABC-123)' },
  { id: 2, display_name: 'Honda City (XYZ-789)' },
  { id: 3, display_name: 'Yamaha Mio (MOT-001)' },
]

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']

export default function Schedules() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [schedules, setSchedules] = useState(initialSchedules)
  const [formData, setFormData] = useState({
    student_id: '', instructor_id: '', vehicle_id: '', session_type: 'practical',
    scheduled_date: '', start_time: '', duration: '2'
  })

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getSessionColor = (type) => {
    const colors = {
      theory: 'bg-blue-100 border-blue-300 text-blue-800',
      practical: 'bg-green-100 border-green-300 text-green-800',
      vr_simulation: 'bg-purple-100 border-purple-300 text-purple-800',
      exam: 'bg-orange-100 border-orange-300 text-orange-800'
    }
    return colors[type] || 'bg-gray-100 border-gray-300'
  }

  const getSessionIcon = (type) => {
    const icons = { theory: '📚', practical: '🚗', vr_simulation: '🎮', exam: '📝' }
    return icons[type] || '📋'
  }

  const getSchedulesForDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return schedules.filter(s => s.scheduled_date === dateStr)
  }

  const navigateWeek = (direction) => {
    setCurrentDate(prev => addDays(prev, direction * 7))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const student = mockStudents.find(s => s.id === parseInt(formData.student_id))
    const instructor = mockInstructors.find(i => i.id === parseInt(formData.instructor_id))
    const vehicle = formData.vehicle_id ? mockVehicles.find(v => v.id === parseInt(formData.vehicle_id)) : null
    const endHour = parseInt(formData.start_time.split(':')[0]) + parseInt(formData.duration)
    const endTime = `${endHour.toString().padStart(2, '0')}:00`

    const newSchedule = {
      id: Date.now(),
      enrollment: { student: { full_name: student?.full_name || 'Unknown' } },
      instructor: { full_name: instructor?.full_name || 'Unknown' },
      vehicle: vehicle ? { display_name: vehicle.display_name } : null,
      session_type: formData.session_type,
      scheduled_date: formData.scheduled_date,
      start_time: formData.start_time,
      end_time: endTime,
      status: 'scheduled'
    }

    setSchedules([...schedules, newSchedule])
    setShowModal(false)
    setFormData({ student_id: '', instructor_id: '', vehicle_id: '', session_type: 'practical', scheduled_date: '', start_time: '', duration: '2' })
  }

  const openDetail = (schedule) => {
    setSelectedSchedule(schedule)
    setShowDetailModal(true)
  }

  const updateStatus = (id, newStatus) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))
    setShowDetailModal(false)
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Schedules</h1>
          <p className="text-sm text-gray-500">Manage lessons</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> New Schedule
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-xl p-4 shadow-sm border mb-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigateWeek(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h2 className="text-sm md:text-base font-semibold">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </h2>
          </div>
          <button onClick={() => navigateWeek(1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-center mt-2">
          <button onClick={() => setCurrentDate(new Date())} className="btn btn-secondary text-sm">Today</button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></span> Theory</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 border border-green-300"></span> Practical</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-100 border border-purple-300"></span> VR</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-100 border border-orange-300"></span> Exam</span>
      </div>

      {/* Week Calendar */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day, i) => (
            <div key={i} className={`p-2 md:p-3 text-center border-r last:border-r-0 ${isSameDay(day, new Date()) ? 'bg-blue-50' : ''}`}>
              <div className="text-xs text-gray-500">{format(day, 'EEE')}</div>
              <div className={`text-base md:text-lg font-bold ${isSameDay(day, new Date()) ? 'text-blue-600' : ''}`}>{format(day, 'd')}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 min-h-[150px] md:min-h-[300px]">
          {weekDays.map((day, i) => {
            const daySchedules = getSchedulesForDay(day)
            return (
              <div key={i} className="border-r last:border-r-0 p-1 space-y-1">
                {daySchedules.map((schedule) => (
                  <div key={schedule.id} onClick={() => openDetail(schedule)}
                    className={`p-1 md:p-2 rounded border text-xs cursor-pointer ${getSessionColor(schedule.session_type)} ${schedule.status === 'cancelled' ? 'opacity-50' : ''}`}>
                    <div className="text-center md:text-left">{getSessionIcon(schedule.session_type)}</div>
                    <div className="hidden md:block text-xs mt-1 truncate">{schedule.enrollment.student.full_name.split(' ')[0]}</div>
                  </div>
                ))}
                {daySchedules.length === 0 && <div className="text-center text-gray-300 text-xs py-2">-</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile List */}
      <div className="md:hidden mt-4 space-y-2">
        <h3 className="font-semibold text-sm">Upcoming</h3>
        {schedules.filter(s => s.status !== 'cancelled').slice(0, 4).map((s) => (
          <div key={s.id} onClick={() => openDetail(s)} className={`p-3 rounded-lg border ${getSessionColor(s.session_type)}`}>
            <div className="flex justify-between text-sm">
              <span className="font-bold">{s.scheduled_date}</span>
              <span>{s.start_time}</span>
            </div>
            <p className="font-medium text-sm">{s.enrollment.student.full_name}</p>
            <p className="text-xs opacity-75">{getSessionIcon(s.session_type)} {s.session_type.replace('_', ' ')}</p>
          </div>
        ))}
      </div>

      {/* New Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold">New Session</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Student</label>
                <select className="input" required value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})}>
                  <option value="">Select...</option>
                  {mockStudents.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select className="input" value={formData.session_type} onChange={(e) => setFormData({...formData, session_type: e.target.value})}>
                  <option value="theory">Theory</option>
                  <option value="practical">Practical</option>
                  <option value="vr_simulation">VR</option>
                  <option value="exam">Exam</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Instructor</label>
                <select className="input" required value={formData.instructor_id} onChange={(e) => setFormData({...formData, instructor_id: e.target.value})}>
                  <option value="">Select...</option>
                  {mockInstructors.map(i => <option key={i.id} value={i.id}>{i.full_name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" className="input" required value={formData.scheduled_date} onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <select className="input" required value={formData.start_time} onChange={(e) => setFormData({...formData, start_time: e.target.value})}>
                    <option value="">Select...</option>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold">Session Details</h2>
              <button onClick={() => setShowDetailModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              <div className={`p-3 rounded-lg mb-4 ${getSessionColor(selectedSchedule.session_type)}`}>
                <span className="font-semibold">{getSessionIcon(selectedSchedule.session_type)} {selectedSchedule.session_type.replace('_', ' ')}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Student</span><span className="font-medium">{selectedSchedule.enrollment.student.full_name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Instructor</span><span className="font-medium">{selectedSchedule.instructor.full_name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{selectedSchedule.scheduled_date}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium">{selectedSchedule.start_time} - {selectedSchedule.end_time}</span></div>
              </div>
              {selectedSchedule.status !== 'completed' && selectedSchedule.status !== 'cancelled' && (
                <div className="flex gap-2 mt-4">
                  <button onClick={() => updateStatus(selectedSchedule.id, 'completed')} className="btn btn-success flex-1 text-sm">
                    <CheckCircle className="w-4 h-4 inline mr-1" /> Complete
                  </button>
                  <button onClick={() => updateStatus(selectedSchedule.id, 'cancelled')} className="btn btn-danger text-sm">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
