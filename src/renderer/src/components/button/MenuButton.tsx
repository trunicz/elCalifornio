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
        'text-stroke gap-2 flex items-center text-lg rounded-[10px] px-3 py-2 overflow-hidden hover:text-white transition-all hover:bg-stroke duration-150 font-medium w-full',
        {
          '': icon
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
      {icon && <span className="text-2xl">{icon}</span>}
      <span className="w-full text-start">{text}</span>
      {children}
    </button>
  )
}
