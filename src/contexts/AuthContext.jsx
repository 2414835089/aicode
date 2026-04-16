import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

const STORAGE_KEY = 'auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signInWithPassword = async ({ email, password }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 'mock-user-id',
          email: email,
          user_metadata: {
            name: email.split('@')[0]
          }
        }
        setUser(mockUser)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser))
        resolve({ data: { user: mockUser }, error: null })
      }, 800)
    })
  }

  const signUp = async ({ email, password, options }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 'mock-new-user-id',
          email: email,
          user_metadata: options?.data || {}
        }
        resolve({ data: { user: mockUser }, error: null })
      }, 800)
    })
  }

  const resetPasswordForEmail = async (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: {}, error: null })
      }, 800)
    })
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    return { error: null }
  }

  const value = {
    user,
    loading,
    signInWithPassword,
    signUp,
    resetPasswordForEmail,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
