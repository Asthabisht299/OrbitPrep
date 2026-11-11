import React from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export default function Protected({ children }) {
  const { loading, user } = useAuth()
  if (loading) return <main className="loading-screen"><div><span className="loading-dot"/>Getting your space ready…</div></main>
  if (!user) return <Navigate to="/login" replace />
  return children
}
