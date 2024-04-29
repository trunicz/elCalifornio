import { cn } from '@renderer/utils'
import { ComponentProps, ReactElement } from 'react'
import { useLocation } from 'wouter'

export interface ButtonProps extends ComponentProps<'button'> {
  icon?: ReactElement
  text?: string
  to?: string
  isIconOnly?: boolean
  iconLeft?: boolean
}

export const Button = ({
  className,
  children,
  text,
  to,
  icon,
  iconLeft = false,
  isIconOnly,
  ...props
}: ButtonProps): ReactElement => {
  const [_, setLocation] = useLocation()
  if (!_) console.log(_)

  return (
    <button
      className={cn(
        'text-stroke flex items-center px-3 w-full py-2 hover:bg-primary  active:scale-95 transition-all max-h-10 hover:text-main border-2 border-primary rounded-lg duration-100 font-normal',
        {
          '': icon,
          'w-auto px-6 py-1': isIconOnly
        },
        className
      )}
      {...props}
      onClick={() => {
        if (to) {
          setLocation(to)
        }
      }}
    >
      {iconLeft && <span className="text-xl">{icon}</span>}
      {!isIconOnly && <span className="w-full">{text}</span>}
      {icon && !iconLeft && <span className="text-xl">{icon}</span>}
      {children}
    </button>
  )
}
