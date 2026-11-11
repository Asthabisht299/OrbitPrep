import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../auth.context'
import { login, register, logout, getMe } from '../services/auth.api'

export const useAuth = () => {
  const context = useContext(AuthContext)
  const { user, setUser, loading, setLoading } = context
  const [error, setError] = useState('')

  const handleLogin = async ({ email, password }) => {
    setLoading(true); setError('')
    try { const data = await login({ email, password }); setUser(data.user); return { ok: true } }
    catch (err) { const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Login failed.'; setError(message); return { ok: false, error: message } }
    finally { setLoading(false) }
  }
  const handleRegister = async ({ username, email, password }) => {
    setLoading(true); setError('')
    try { const data = await register({ username, email, password }); setUser(data.user); return { ok: true } }
    catch (err) { const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed.'; setError(message); return { ok: false, error: message } }
    finally { setLoading(false) }
  }
  const handleLogout = async () => {
    setLoading(true); setError('')
    try { await logout(); setUser(null); return { ok: true } }
    catch (err) { const message = err.response?.data?.message || err.message || 'Logout failed.'; setError(message); return { ok: false, error: message } }
    finally { setLoading(false) }
  }
  useEffect(() => {
    let active = true
    const getAndSetUser = async () => {
      try { const data = await getMe(); if (active) setUser(data.user) }
      catch { if (active) setUser(null) }
      finally { if (active) setLoading(false) }
    }
    getAndSetUser()
    return () => { active = false }
  }, [setLoading, setUser])

  return { user, loading, error, handleRegister, handleLogin, handleLogout }
}
