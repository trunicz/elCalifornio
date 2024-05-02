import { useAuthStore } from '@renderer/stores/useAuth'
import { ReactNode, useEffect } from 'react'
import { useLocation } from 'wouter'

export const ProtectedRoute = ({ children }: { children: ReactNode }): ReactNode => {
  const [location, setLocation] = useLocation()
  const { user } = useAuthStore()

  useEffect(() => {
    if (user !== null) {
      setLocation('/')
    } else {
      setLocation('/login')
    }
  }, [user, location])

  return children
}
