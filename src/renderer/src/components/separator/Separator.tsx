import { cn } from '@renderer/utils'
import { ComponentProps, ReactElement } from 'react'

interface SeparatorProps extends ComponentProps<'div'> {
  text: string
}

export const Separator = ({ className, text, ...props }: SeparatorProps): ReactElement => {
  return (
    <div className={cn('border-t-2 mt-3 py-1 px-3 text-sm font-main', className)} {...props}>
      {text}
    </div>
  )
}
