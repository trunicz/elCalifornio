import { cn } from '@renderer/utils'
import { ComponentProps, ReactElement } from 'react'

export const Button = ({
  className,
  children,
  ...props
}: ComponentProps<'button'>): ReactElement => {
  return (
    <button
      className={cn(
        'bg-zinc-700 w-auto h-auto px-6 py-2 rounded-lg hover:bg-zinc-600 duration-100 active:scale-95 transition-all',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
