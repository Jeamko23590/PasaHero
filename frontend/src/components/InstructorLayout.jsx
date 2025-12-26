import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  LayoutDashboard, Calendar, Users, ClipboardList,
  LogOut, UserCircle, Gamepad2, Menu, X
} from 'lucide-react'
import Logo from './Logo'

const navItems = [
  { to: '/instructor', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/instructor/schedule', icon: Calendar, label: 'My Schedule' },
  { to: '/instructor/students', icon: Users, label: 'My Students' },
  { to: '/instructor/sessions', icon: ClipboardList, label: 'Session Log' },
  { to: '/instructor/vr', icon: Gamepad2, label: 'VR Sessions' },
]

export default function InstructorLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex h-screen">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-blue-900 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-blue-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <div>
              <h1 className="font-bold text-lg">PasaHero</h1>
              <p className="text-xs text-blue-300">Instructor Portal</p>
            </div>
          </div>
          <button 
            onClick={closeSidebar}
            className="lg:hidden text-blue-300 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map(({ to, icon: Icon, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-blue-300 hover:bg-blue-800 hover:text-white'
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
        <div className="p-4 border-t border-blue-800">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <UserCircle className="w-8 h-8 text-blue-300" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-blue-400 truncate">Instructor</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-blue-300 hover:text-red-400 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b px-4 py-3 flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-bold">PasaHero</span>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
