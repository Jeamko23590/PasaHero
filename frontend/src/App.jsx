import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Layouts
import AdminLayout from './components/AdminLayout'
import InstructorLayout from './components/InstructorLayout'
import StudentLayout from './components/StudentLayout'

// Auth
import Login from './pages/Login'

// Admin Pages
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Enrollments from './pages/Enrollments'
import Schedules from './pages/Schedules'
import VRSimulation from './pages/VRSimulation'
import Records from './pages/Records'

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard'
import InstructorSchedule from './pages/instructor/InstructorSchedule'
import InstructorStudents from './pages/instructor/InstructorStudents'
import InstructorSessions from './pages/instructor/InstructorSessions'
import InstructorVR from './pages/instructor/InstructorVR'

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard'
import StudentSchedule from './pages/student/StudentSchedule'
import StudentProgress from './pages/student/StudentProgress'
import StudentVR from './pages/student/StudentVR'
import StudentCertificates from './pages/student/StudentCertificates'
import StudentProfile from './pages/student/StudentProfile'

function RootRedirect() {
  const { user, loading } = useAuth()
  
  if (loading) return null
  
  if (!user) return <Navigate to="/login" replace />
  
  switch (user.role) {
    case 'admin': return <Navigate to="/admin" replace />
    case 'instructor': return <Navigate to="/instructor" replace />
    case 'student': return <Navigate to="/student" replace />
    default: return <Navigate to="/login" replace />
  }
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RootRedirect />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="enrollments" element={<Enrollments />} />
              <Route path="schedules" element={<Schedules />} />
              <Route path="vr-simulation" element={<VRSimulation />} />
              <Route path="records" element={<Records />} />
            </Route>
          </Route>

          {/* Instructor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
            <Route path="/instructor" element={<InstructorLayout />}>
              <Route index element={<InstructorDashboard />} />
              <Route path="schedule" element={<InstructorSchedule />} />
              <Route path="students" element={<InstructorStudents />} />
              <Route path="sessions" element={<InstructorSessions />} />
              <Route path="vr" element={<InstructorVR />} />
            </Route>
          </Route>

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="schedule" element={<StudentSchedule />} />
              <Route path="progress" element={<StudentProgress />} />
              <Route path="vr" element={<StudentVR />} />
              <Route path="certificates" element={<StudentCertificates />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
