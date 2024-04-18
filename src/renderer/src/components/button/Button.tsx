import { cn } from '@renderer/utils'
import { ComponentProps, ReactElement } from 'react'

interface ButtonProps extends ComponentProps<'button'> {
  icon?: ReactElement
  text?: string
}

export const Button = ({
  className,
  children,
  text,
  icon,
  ...props
}: ButtonProps): ReactElement => {
  return (
    <button
      className={cn(
        'bg-secondary text-stroke px-6 py-2 rounded-lg hover:bg-primary  active:scale-95 transition-all hover:text-main border-2 border-stroke duration-150',
        {
          'flex flex-col justify-center items-center gap-2': icon
        },
        className
      )}
      {...props}
    >
      <span className="text-5xl text-primary bg-main rounded-full p-3">{icon}</span>
      {text}
      {children}
    </button>
  )
}
