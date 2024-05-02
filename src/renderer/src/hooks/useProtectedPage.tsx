import { ComponentProps, ReactNode } from 'react'

export const useProtectedPage = ({ children }: ComponentProps<'div'>): ReactNode => {
  return children
}
