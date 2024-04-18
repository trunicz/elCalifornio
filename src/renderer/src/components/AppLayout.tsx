import { cn } from '@renderer/utils'
import { ComponentProps, ReactElement } from 'react'

export const AppLayout = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>): ReactElement => {
  return (
    <div className={cn('bg-blue-200 h-full', className)} {...props}>
      {children}
    </div>
  )
}

const AppHeader = ({ className, children, ...props }: ComponentProps<'div'>): ReactElement => {
  return (
    <div
      className={cn(
        'bg-zinc-800 p-6  border-b-2 border-zinc-400 flex justify-center items-center',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const AppMenu = ({ className, children, ...props }: ComponentProps<'div'>): ReactElement => {
  return (
    <div className={cn('bg-zinc-900 h-full p-6', className)} {...props}>
      {children}
    </div>
  )
}

AppLayout.Menu = AppMenu
AppLayout.Header = AppHeader
