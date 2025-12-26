import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Car, Eye, EyeOff, Loader2, GraduationCap, Users, Shield } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(email, password)
      switch (user.role) {
        case 'admin':
          navigate('/admin')
          break
        case 'instructor':
          navigate('/instructor')
          break
        case 'student':
          navigate('/student')
          break
        default:
          navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const demoLogins = [
    { role: 'Admin', email: 'admin@pasahero.com', icon: Shield, color: 'from-purple-500 to-purple-600', hoverColor: 'hover:from-purple-600 hover:to-purple-700' },
    { role: 'Instructor', email: 'mark.santos@pasahero.com', icon: Users, color: 'from-blue-500 to-blue-600', hoverColor: 'hover:from-blue-600 hover:to-blue-700' },
    { role: 'Student', email: 'juan@email.com', icon: GraduationCap, color: 'from-green-500 to-green-600', hoverColor: 'hover:from-green-600 hover:to-green-700' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Video Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* Replace this src with your actual video file path */}
          <source src="/videos/driving-bg.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Overlay for low opacity effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/80 to-indigo-900/85"></div>
        
        {/* Content on top of video */}
        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <Car className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">PasaHero</span>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Smart Driving School<br />Management Platform
            </h1>
            <p className="text-blue-100 text-lg max-w-md">
              Streamline your driving school operations with our comprehensive ERP solution. 
              Manage students, schedules, and certifications all in one place.
            </p>
            
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-blue-200 text-sm">Students Trained</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">98%</p>
                <p className="text-blue-200 text-sm">Pass Rate</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">15+</p>
                <p className="text-blue-200 text-sm">Instructors</p>
              </div>
            </div>
          </div>

          <div className="text-blue-200 text-sm">
            © 2024 PasaHero. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <Car className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">PasaHero</h1>
            <p className="text-gray-500">Smart Driving School Management</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-500 mt-1">Sign in to continue to your dashboard</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          {/* Demo Logins */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500">Quick Demo Access</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {demoLogins.map((demo) => (
                <button
                  key={demo.role}
                  onClick={() => {
                    setEmail(demo.email)
                    setPassword('password')
                  }}
                  className={`bg-gradient-to-r ${demo.color} ${demo.hoverColor} text-white py-3 px-4 rounded-xl transition-all flex flex-col items-center gap-1 shadow-md hover:shadow-lg`}
                >
                  <demo.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{demo.role}</span>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">
              Click a role above to auto-fill credentials, then click Sign In
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
