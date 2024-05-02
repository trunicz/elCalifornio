import { useAuthStore } from '@renderer/stores/useAuth'
import { ReactNode } from 'react'
import { useLocation } from 'wouter'

export const ProtectedRoute = ({ children }: { children: ReactNode }): ReactNode => {
  const [location, setLocation] = useLocation()

  const { user } = useAuthStore()

  if (user) {
    setLocation('/app')
  } else {
    setLocation('/login')
  }
  console.log(location, user)

  return children
}
