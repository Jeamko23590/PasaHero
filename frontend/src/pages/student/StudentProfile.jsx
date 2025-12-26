import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { User, Mail, Phone, MapPin, Calendar, Shield, Save, Eye, EyeOff } from 'lucide-react'

export default function StudentProfile() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.student?.phone || '09171234567',
    address: user?.student?.address || 'Manila, Philippines',
    emergency_contact: 'Maria Dela Cruz',
    emergency_phone: '09181234567'
  })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  })

  const handleSave = () => {
    // API call would go here
    setEditing(false)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-500">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-xl font-bold">{user?.name}</h2>
          <p className="text-gray-500">{user?.student?.student_id || 'STU-2024-00001'}</p>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700 font-medium">Active Student</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn btn-secondary text-sm">Edit</button>
            ) : (
              <button onClick={handleSave} className="btn btn-primary text-sm flex items-center gap-2">
                <Save className="w-4 h-4" /> Save
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              ) : (
                <p className="flex items-center gap-2 text-gray-900">
                  <User className="w-4 h-4 text-gray-400" /> {formData.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {editing ? (
                <input
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              ) : (
                <p className="flex items-center gap-2 text-gray-900">
                  <Mail className="w-4 h-4 text-gray-400" /> {formData.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {editing ? (
                <input
                  type="tel"
                  className="input"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              ) : (
                <p className="flex items-center gap-2 text-gray-900">
                  <Phone className="w-4 h-4 text-gray-400" /> {formData.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {editing ? (
                <input
                  type="text"
                  className="input"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              ) : (
                <p className="flex items-center gap-2 text-gray-900">
                  <MapPin className="w-4 h-4 text-gray-400" /> {formData.address}
                </p>
              )}
            </div>
          </div>

          <hr className="my-6" />

          <h4 className="font-medium mb-4">Emergency Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
              {editing ? (
                <input
                  type="text"
                  className="input"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                />
              ) : (
                <p className="text-gray-900">{formData.emergency_contact}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              {editing ? (
                <input
                  type="tel"
                  className="input"
                  value={formData.emergency_phone}
                  onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
                />
              ) : (
                <p className="text-gray-900">{formData.emergency_phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="card lg:col-span-3">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5" /> Change Password
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                className="input"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                className="input"
                value={passwordData.new_password_confirmation}
                onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})}
              />
            </div>
          </div>
          <button className="btn btn-primary mt-4">Update Password</button>
        </div>
      </div>
    </div>
  )
}
