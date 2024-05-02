import { ReactNode } from 'react'
import { useLocation } from 'wouter'

export const ProtectedRoute = ({ children }: { children: ReactNode }): ReactNode => {
  const [location, setLocation] = useLocation()

  setLocation('/login')

  if (!location.includes('/')) {
    setLocation('/app')
  }
  return children
}
