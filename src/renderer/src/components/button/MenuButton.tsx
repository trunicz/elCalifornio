import { cn } from '@renderer/utils'
import { ReactElement } from 'react'
import { useLocation } from 'wouter'
import { ButtonProps } from './Button'

export const MenuButton = ({
  className,
  children,
  text,
  to,
  icon,
  ...props
}: ButtonProps): ReactElement => {
  const [_, setLocation] = useLocation()
  if (!_) console.log(_)

  return (
    <button
      className={cn(
        'bg-secondary text-stroke px-6 py-2 hover:bg-primary  active:scale-95 transition-all hover:text-main border-2 border-stroke duration-150',
        {
          'flex flex-col justify-center items-center gap-2': icon
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
      {icon && <span className="text-5xl text-primary bg-main rounded-full p-3">{icon}</span>}
      {text}
      {children}
    </button>
  )
}
