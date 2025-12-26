import { useState } from 'react'
import {
  Users,
  GraduationCap,
  Calendar,
  DollarSign,
  Car,
  Award,
  TrendingUp,
  Clock,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

// Mock data for demo
const mockData = {
  stats: {
    total_students: 248,
    active_enrollments: 156,
    todays_sessions: 24,
    monthly_revenue: 485000,
    pending_payments: 125000,
    active_instructors: 12,
    available_vehicles: 8,
    certificates_issued: 45,
  },
  todays_schedule: [
    {
      id: 1,
      enrollment: { student: { full_name: 'Juan Dela Cruz' } },
      instructor: { full_name: 'Mark Santos' },
      session_type: 'practical',
      start_time: '08:00',
      status: 'in_progress',
    },
    {
      id: 2,
      enrollment: { student: { full_name: 'Maria Garcia' } },
      instructor: { full_name: 'Ana Reyes' },
      session_type: 'theory',
      start_time: '09:00',
      status: 'scheduled',
    },
    {
      id: 3,
      enrollment: { student: { full_name: 'Pedro Reyes' } },
      instructor: { full_name: 'Jose Cruz' },
      session_type: 'vr_simulation',
      start_time: '10:00',
      status: 'scheduled',
    },
  ],
  enrollment_trend: [
    { month: 'Jul', count: 32 },
    { month: 'Aug', count: 45 },
    { month: 'Sep', count: 38 },
    { month: 'Oct', count: 52 },
    { month: 'Nov', count: 48 },
    { month: 'Dec', count: 41 },
  ],
  session_distribution: { theory: 120, practical: 280, vr_simulation: 85, exam: 45 },
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

export default function Dashboard() {
  const [data] = useState(mockData)

  const statCards = [
    { label: 'Total Students', value: data.stats.total_students, icon: Users, color: 'bg-blue-500' },
    { label: 'Enrollments', value: data.stats.active_enrollments, icon: GraduationCap, color: 'bg-green-500' },
    { label: 'Sessions', value: data.stats.todays_sessions, icon: Calendar, color: 'bg-purple-500' },
    { label: 'Revenue', value: `₱${(data.stats.monthly_revenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'bg-yellow-500' },
    { label: 'Pending', value: `₱${(data.stats.pending_payments / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'bg-red-500' },
    { label: 'Instructors', value: data.stats.active_instructors, icon: Users, color: 'bg-indigo-500' },
    { label: 'Vehicles', value: data.stats.available_vehicles, icon: Car, color: 'bg-teal-500' },
    { label: 'Certificates', value: data.stats.certificates_issued, icon: Award, color: 'bg-pink-500' },
  ]

  const pieData = Object.entries(data.session_distribution).map(([name, value]) => ({ name, value }))

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status] || styles.scheduled}`}>
        {status === 'in_progress' ? 'Active' : status}
      </span>
    )
  }

  const getSessionIcon = (type) => {
    const icons = { theory: '📚', practical: '🚗', vr_simulation: '🎮', exam: '📝' }
    return icons[type] || '📋'
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome to PasaHero</p>
      </div>

      {/* Stats Grid - Single column on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 ${stat.color} rounded-xl flex items-center justify-center`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
        {/* Enrollment Trend */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="font-semibold mb-4">Enrollment Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data.enrollment_trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={30} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Session Distribution */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4">Sessions</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={25} outerRadius={50} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 justify-center">
            {pieData.map((item, i) => (
              <span key={i} className="flex items-center gap-1 text-xs">
                <span className="w-2 h-2 rounded" style={{ backgroundColor: COLORS[i] }}></span>
                {item.name.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Schedule - Card layout on mobile */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Today's Schedule</h3>
          <Clock className="w-4 h-4 text-gray-400" />
        </div>

        {/* Mobile: Card layout */}
        <div className="md:hidden space-y-3">
          {data.todays_schedule.map((session) => (
            <div key={session.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-blue-600">{session.start_time}</span>
                {getStatusBadge(session.status)}
              </div>
              <p className="font-medium text-sm">{session.enrollment.student.full_name}</p>
              <p className="text-xs text-gray-500">with {session.instructor.full_name}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                {getSessionIcon(session.session_type)} {session.session_type.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Table layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">Time</th>
                <th className="pb-3">Student</th>
                <th className="pb-3">Instructor</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.todays_schedule.map((session) => (
                <tr key={session.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{session.start_time}</td>
                  <td className="py-3">{session.enrollment.student.full_name}</td>
                  <td className="py-3">{session.instructor.full_name}</td>
                  <td className="py-3">
                    <span className="flex items-center gap-2">
                      {getSessionIcon(session.session_type)}
                      {session.session_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3">{getStatusBadge(session.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
