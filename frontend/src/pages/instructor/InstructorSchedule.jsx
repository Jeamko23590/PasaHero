import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, User, Car, Plus, X } from 'lucide-react'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'

const initialSchedules = [
  { id: 1, enrollment: { student: { full_name: 'Juan Dela Cruz' } }, session_type: 'practical', scheduled_date: '2024-12-26', start_time: '08:00', end_time: '10:00', status: 'scheduled', vehicle: { display_name: 'Toyota Vios' } },
  { id: 2, enrollment: { student: { full_name: 'Maria Garcia' } }, session_type: 'theory', scheduled_date: '2024-12-26', start_time: '10:00', end_time: '12:00', status: 'scheduled' },
  { id: 3, enrollment: { student: { full_name: 'Pedro Reyes' } }, session_type: 'vr_simulation', scheduled_date: '2024-12-27', start_time: '09:00', end_time: '10:00', status: 'scheduled' },
  { id: 4, enrollment: { student: { full_name: 'Ana Santos' } }, session_type: 'practical', scheduled_date: '2024-12-27', start_time: '14:00', end_time: '16:00', status: 'scheduled', vehicle: { display_name: 'Honda City' } },
  { id: 5, enrollment: { student: { full_name: 'Jose Cruz' } }, session_type: 'exam', scheduled_date: '2024-12-28', start_time: '08:00', end_time: '10:00', status: 'scheduled', vehicle: { display_name: 'Toyota Vios' } },
]

const mockStudents = [
  { id: 1, full_name: 'Juan Dela Cruz' },
  { id: 2, full_name: 'Maria Garcia' },
  { id: 3, full_name: 'Pedro Reyes' },
  { id: 4, full_name: 'Ana Santos' },
  { id: 5, full_name: 'Jose Cruz' },
]

const mockVehicles = [
  { id: 1, display_name: 'Toyota Vios (ABC-123)' },
  { id: 2, display_name: 'Honda City (XYZ-789)' },
  { id: 3, display_name: 'Yamaha Mio (MOT-001)' },
]

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']

export default function InstructorSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [schedules, setSchedules] = useState(initialSchedules)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    student_id: '',
    session_type: 'practical',
    scheduled_date: '',
    start_time: '',
    duration: '1',
    vehicle_id: '',
    notes: ''
  })

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getSessionColor = (type) => {
    const colors = {
      theory: 'bg-blue-100 border-blue-400 text-blue-800',
      practical: 'bg-green-100 border-green-400 text-green-800',
      vr_simulation: 'bg-purple-100 border-purple-400 text-purple-800',
      exam: 'bg-orange-100 border-orange-400 text-orange-800'
    }
    return colors[type] || 'bg-gray-100 border-gray-400'
  }

  const getSchedulesForDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return schedules.filter(s => s.scheduled_date === dateStr)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const student = mockStudents.find(s => s.id === parseInt(formData.student_id))
    const vehicle = formData.vehicle_id ? mockVehicles.find(v => v.id === parseInt(formData.vehicle_id)) : null
    
    const endHour = parseInt(formData.start_time.split(':')[0]) + parseInt(formData.duration)
    const endTime = `${endHour.toString().padStart(2, '0')}:00`

    const newSchedule = {
      id: Date.now(),
      enrollment: { student: { full_name: student?.full_name || 'Unknown' } },
      session_type: formData.session_type,
      scheduled_date: formData.scheduled_date,
      start_time: formData.start_time,
      end_time: endTime,
      status: 'scheduled',
      vehicle: vehicle ? { display_name: vehicle.display_name } : null,
      notes: formData.notes
    }

    setSchedules([...schedules, newSchedule])
    setShowModal(false)
    setFormData({
      student_id: '',
      session_type: 'practical',
      scheduled_date: '',
      start_time: '',
      duration: '1',
      vehicle_id: '',
      notes: ''
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Schedule</h1>
          <p className="text-gray-500">View and manage your teaching schedule</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Schedule
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentDate(prev => addDays(prev, -7))} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </h2>
            <button onClick={() => setCurrentDate(prev => addDays(prev, 7))} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button onClick={() => setCurrentDate(new Date())} className="btn btn-secondary text-sm">Today</button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4">
        <span className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded bg-blue-400"></span> Theory</span>
        <span className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded bg-green-400"></span> Practical</span>
        <span className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded bg-purple-400"></span> VR Simulation</span>
        <span className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded bg-orange-400"></span> Exam</span>
      </div>

      {/* Week View */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day, i) => (
            <div key={i} className={`p-4 text-center border-r last:border-r-0 ${isSameDay(day, new Date()) ? 'bg-blue-50' : ''}`}>
              <div className="text-sm text-gray-500">{format(day, 'EEE')}</div>
              <div className={`text-xl font-bold ${isSameDay(day, new Date()) ? 'text-blue-600' : ''}`}>{format(day, 'd')}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 min-h-[400px]">
          {weekDays.map((day, i) => {
            const daySchedules = getSchedulesForDay(day)
            return (
              <div key={i} className="border-r last:border-r-0 p-2 space-y-2">
                {daySchedules.map((schedule) => (
                  <div key={schedule.id} className={`p-2 rounded-lg border-l-4 text-xs ${getSessionColor(schedule.session_type)}`}>
                    <div className="font-bold">{schedule.start_time} - {schedule.end_time}</div>
                    <div className="font-medium mt-1 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {schedule.enrollment.student.full_name}
                    </div>
                    <div className="capitalize mt-1">{schedule.session_type.replace('_', ' ')}</div>
                    {schedule.vehicle && (
                      <div className="flex items-center gap-1 mt-1 text-gray-600">
                        <Car className="w-3 h-3" /> {schedule.vehicle.display_name.split(' ')[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg m-4">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Add New Schedule</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Student *</label>
                  <select 
                    className="input" 
                    required
                    value={formData.student_id}
                    onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                  >
                    <option value="">Select student...</option>
                    {mockStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.full_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Session Type *</label>
                  <select 
                    className="input"
                    value={formData.session_type}
                    onChange={(e) => setFormData({...formData, session_type: e.target.value})}
                  >
                    <option value="theory">Theory Class</option>
                    <option value="practical">Practical Driving</option>
                    <option value="vr_simulation">VR Simulation</option>
                    <option value="exam">Examination</option>
                  </select>
                </div>

                {(formData.session_type === 'practical' || formData.session_type === 'exam') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Vehicle</label>
                    <select 
                      className="input"
                      value={formData.vehicle_id}
                      onChange={(e) => setFormData({...formData, vehicle_id: e.target.value})}
                    >
                      <option value="">Select vehicle...</option>
                      {mockVehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.display_name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date *</label>
                    <input 
                      type="date" 
                      className="input" 
                      required
                      value={formData.scheduled_date}
                      onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time *</label>
                    <select 
                      className="input" 
                      required
                      value={formData.start_time}
                      onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                    >
                      <option value="">Select time...</option>
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Duration *</label>
                  <select 
                    className="input"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  >
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea 
                    className="input" 
                    rows="2"
                    placeholder="Any special instructions..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
