import { useAuth } from '../lib/auth'
import { Navigate, useLocation } from 'react-router-dom'
import Skeleton from './Skeleton'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Skeleton />

  if (!user) return <Navigate to="/prize/auth" state={{ from: location }} replace />

  if (requiredRole && profile?.role !== requiredRole && profile?.role !== 'admin') {
    if (profile?.role === 'admin') return <Navigate to="/prize/admin" replace />
    if (profile?.role === 'judge') return <Navigate to="/prize/judge" replace />
    return <Navigate to="/prize/dashboard" replace />
  }

  return children
}
