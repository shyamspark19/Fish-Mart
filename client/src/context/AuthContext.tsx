import React, { createContext, useEffect, useState } from 'react'
import * as authService from '../services/authService'

interface AuthContextValue {
  user: any | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role?: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('fm_token'))

  useEffect(() => {
    async function load() {
      if (token) {
        try {
          const resp = await authService.me(token)
          setUser(resp.user)
        } catch (err) {
          setUser(null)
          setToken(null)
          authService.setAuthToken(null)
          localStorage.removeItem('fm_token')
        }
      }
    }
    load()
  }, [token])

  const login = async (email: string, password: string) => {
    const resp = await authService.login({ email, password })
    if (resp.token) {
      setToken(resp.token)
      localStorage.setItem('fm_token', resp.token)
      setUser(resp.user)
    }
  }

  const register = async (name: string, email: string, password: string, role?: string) => {
    const resp = await authService.register({ name, email, password, role })
    if (resp.token) {
      setToken(resp.token)
      localStorage.setItem('fm_token', resp.token)
      setUser(resp.user)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    authService.setAuthToken(null)
    localStorage.removeItem('fm_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
