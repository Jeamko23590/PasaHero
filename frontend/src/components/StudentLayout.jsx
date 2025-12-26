import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  LayoutDashboard, Calendar, BookOpen, Award,
  Car, LogOut, UserCircle, Gamepad2, User
} from 'lucide-react'

const navItems = [
  { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/student/schedule', icon: Calendar, label: 'My Schedule' },
  { to: '/student/progress', icon: BookOpen, label: 'My Progress' },
  { to: '/student/vr', icon: Gamepad2, label: 'VR Training' },
  { to: '/student/certificates', icon: Award, label: 'Certificates' },
  { to: '/student/profile', icon: User, label: 'Profile' },
]

export default function StudentLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white flex flex-col">
        <div className="p-6 border-b border-green-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg">PasaHero</h1>
              <p className="text-xs text-green-300">Student Portal</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map(({ to, icon: Icon, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-green-600 text-white' 
                        : 'text-green-300 hover:bg-green-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-green-800">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <UserCircle className="w-8 h-8 text-green-300" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-green-400 truncate">{user?.student?.student_id || 'Student'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-green-300 hover:text-red-400 rounded-lg hover:bg-green-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}
