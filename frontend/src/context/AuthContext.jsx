import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Mock users for demo (no backend needed)
const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@pasahero.com', role: 'admin', avatar: null },
  { id: 2, name: 'Mark Santos', email: 'mark.santos@pasahero.com', role: 'instructor', avatar: null },
  { id: 3, name: 'Juan Dela Cruz', email: 'juan@email.com', role: 'student', avatar: null },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Mock authentication - find user by email
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (foundUser && password === 'password') {
      localStorage.setItem('user', JSON.stringify(foundUser))
      localStorage.setItem('token', 'mock-token-' + foundUser.id)
      setUser(foundUser)
      return foundUser
    } else {
      throw new Error('Invalid credentials')
    }
  }

  const logout = async () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
