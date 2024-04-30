import { cn } from '@renderer/utils'
import { ReactElement } from 'react'
import { useLocation } from 'wouter'
import { ButtonProps } from './Button'

interface MenuButtonProps extends ButtonProps {
  to: string
}

export const MenuButton = ({
  className,
  children,
  text,
  to,
  icon,
  ...props
}: MenuButtonProps): ReactElement => {
  const [location, setLocation] = useLocation()

  return (
    <button
      className={cn(
        'text-stroke gap-2 flex items-center text-lg rounded-[10px] overflow-hidden hover:text-white transition-all hover:bg-hover duration-150 font-medium w-full active:scale-95 p-2',
        {
          '': icon,
          'bg-accent text-main hover:bg-hover': location.includes(to)
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
