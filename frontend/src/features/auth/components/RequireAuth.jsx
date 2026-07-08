import { Navigate, Outlet, useLocation } from 'react-router'
import { LoadingState } from '@/shared/ui/LoadingState'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const RequireAuth = () => {
  const { isAuthenticated, isRestoring } = useAuth()
  const location = useLocation()

  if (isRestoring) {
    return <LoadingState label="Restoring your session" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
