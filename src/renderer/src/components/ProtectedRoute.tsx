import { ReactNode } from 'react'
import { useLocation } from 'wouter'

export const ProtectedRoute = ({ children }: { children: ReactNode }): ReactNode => {
  const [location, setLocation] = useLocation()

  if (!location.includes('/app')) {
    setLocation('/app')
  }
  return children
}