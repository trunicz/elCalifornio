import { cn } from '@renderer/utils'
import { ComponentProps, ReactElement } from 'react'
import { useLocation } from 'wouter'

export interface ButtonProps extends ComponentProps<'button'> {
  icon?: ReactElement
  text?: string
  to?: string
  isIconOnly?: boolean
  iconLeft?: boolean
  isLoading?: boolean
}

export const Button = ({
  className,
  children,
  text,
  to,
  icon,
  iconLeft = false,
  isIconOnly,
  isLoading = false,
  ...props
}: ButtonProps): ReactElement => {
  const [_, setLocation] = useLocation()
  if (!_) console.log(_)

  return (
    <button
      className={cn(
        'flex items-center px-3 w-full py-2 hover:text-main text-stroke hover:bg-hover  active:scale-95 transition-all max-h-10 rounded-lg  border-2 border-base hover:border-transparent duration-150 font-normal',
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
      {isLoading && <span>loading...</span>}
    </button>
  )
}
