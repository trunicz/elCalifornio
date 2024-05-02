import { cn } from '@renderer/utils'
import { ReactElement } from 'react'
import { Link, useLocation } from 'wouter'
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
  const [location] = useLocation()

  const isActive: boolean =
    (to === '/' && location === '/') || (to !== '/' && location.startsWith(to))

  return (
    <button
      className={cn(
        'text-stroke text-lg rounded-[10px] overflow-hidden hover:text-white transition-all hover:bg-hover duration-150 font-medium w-full active:scale-95',
        {
          '': icon,
          'bg-accent text-main hover:bg-hover': isActive
        },
        className
      )}
      {...props}
    >
      <Link to={to} className="flex p-2 items-center gap-2 w-full h-full ">
        {icon && <span className="text-2xl">{icon}</span>}
        <span className="w-full text-start">{text}</span>
        {children}
      </Link>
    </button>
  )
}
