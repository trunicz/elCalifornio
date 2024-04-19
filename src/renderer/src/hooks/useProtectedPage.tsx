import { ComponentProps, ReactElement } from 'react'

export const useProtectedPage = ({ children }: ComponentProps<'div'>): ReactElement => {
  return <>{children}</>
}
