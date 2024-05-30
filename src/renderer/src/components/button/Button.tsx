import { cn } from '@renderer/utils'
import { ComponentProps, ReactElement } from 'react'

export interface ButtonProps extends ComponentProps<'button'> {
  color?: 'danger' | 'success' | 'warning' | 'info' | 'accent'
  icon?: ReactElement
  text?: string
  isIconOnly?: boolean
  iconLeft?: boolean
  isLoading?: boolean
}

export const Button = ({
  className,
  children,
  color,
  text,
  icon,
  iconLeft = false,
  isIconOnly,
  isLoading = false,
  ...props
}: ButtonProps): ReactElement => {
  const colorStyle: { [x: string]: string } = {
    danger: 'hover:bg-red-600 text-white border bg-red-500',
    success: 'hover:bg-green-600 text-white border bg-green-500',
    warning: 'hover:bg-amber-600 text-white border bg-amber-500',
    info: 'hover:bg-blue-600 text-white border bg-blue-500',
    accent: 'hover:bg-fuchsia-600 text-white border bg-fuchsia-500'
  }
  return (
    <button
      className={cn(
        'flex items-center px-3 text-white w-full py-2 hover:text-main text-stroke hover:bg-hover  active:scale-95 transition-all max-h-10 rounded-lg  border-2 border-base hover:border-transparent duration-150 font-normal',
        color ? colorStyle[color] : '',
        {
          '': icon,
          'w-auto px-6 py-1': isIconOnly
        },
        className
      )}
      {...props}
    >
      {iconLeft && <span className="text-xl">{icon}</span>}
      {!isIconOnly && text && <span className="w-full">{text}</span>}
      {icon && !iconLeft && <span className="text-xl">{icon}</span>}
      {children}
      {isLoading && <span>loading...</span>}
    </button>
  )
}
