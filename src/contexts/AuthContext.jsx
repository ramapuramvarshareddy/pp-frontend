import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import API from '../api'  // ✅ Import the custom axios instance

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // ✅ Configure token in API headers
  useEffect(() => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete API.defaults.headers.common['Authorization']
    }
  }, [token])

  // ✅ Load user when app starts
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await API.get('/auth/me')
          setUser(response.data.user)
        } catch (error) {
          console.error('Failed to load user:', error)
          localStorage.removeItem('token')
          setToken(null)
          delete API.defaults.headers.common['Authorization']
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [token])

  // ✅ Login
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password })
      const { token: newToken, user: userData } = response.data
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      API.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  // ✅ Register
  const register = async (userData) => {
    try {
      const response = await API.post('/auth/register', userData)
      const { token: newToken, user: userInfo } = response.data
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userInfo)
      API.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete API.defaults.headers.common['Authorization']
    toast.success('Logged out successfully')
  }

  // ✅ Update Profile
  const updateProfile = async (profileData) => {
    try {
      const response = await API.put('/auth/profile', profileData)
      setUser(response.data.user)
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


