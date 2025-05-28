// lib/adminAuth.ts
import React from 'react'
import { supabase } from './supabaseClient'
import bcrypt from 'bcryptjs'

export interface AdminUser {
  id: string
  username: string
  email: string
  created_at: string
}

export class AdminAuth {
  private static readonly ADMIN_SESSION_KEY = 'admin_session'

  static async login(username: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    try {
      // Get admin user from database
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username.toLowerCase())
        .single()

      if (error || !adminUser) {
        return { success: false, error: 'Invalid credentials' }
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, adminUser.password_hash)
      
      if (!isPasswordValid) {
        return { success: false, error: 'Invalid credentials' }
      }

      // Create session
      const session = {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        created_at: adminUser.created_at,
        loginTime: Date.now()
      }

      // Store in sessionStorage (for this session only)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify(session))
      }

      return { 
        success: true, 
        user: {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          created_at: adminUser.created_at
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'An error occurred during login' }
    }
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.ADMIN_SESSION_KEY)
    }
  }

  static getCurrentUser(): AdminUser | null {
    if (typeof window === 'undefined') return null
    
    try {
      const sessionData = sessionStorage.getItem(this.ADMIN_SESSION_KEY)
      if (!sessionData) return null

      const session = JSON.parse(sessionData)
      
      // Check if session is still valid (24 hours)
      const sessionAge = Date.now() - session.loginTime
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours
      
      if (sessionAge > maxAge) {
        this.logout()
        return null
      }

      return {
        id: session.id,
        username: session.username,
        email: session.email,
        created_at: session.created_at
      }
    } catch {
      return null
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }
}

// Hook for React components
export function useAdminAuth() {
  const [user, setUser] = React.useState<AdminUser | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const currentUser = AdminAuth.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login: AdminAuth.login,
    logout: () => {
      AdminAuth.logout()
      setUser(null)
    }
  }
}
