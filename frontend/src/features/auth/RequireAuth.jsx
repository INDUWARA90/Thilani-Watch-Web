import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './useAuth'

export const RequireAuth = () => {
  const { isAuthenticated, isRestoring } = useAuth()
  const location = useLocation()

  if (isRestoring) {
    return <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 font-bold text-emerald-950">Restoring your session...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
