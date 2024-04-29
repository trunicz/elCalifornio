import { Menu } from '@headlessui/react'
import { ReactElement } from 'react'
import { Link } from 'wouter'
import { ButtonProps } from './Button'
import { cn } from '@renderer/utils'

interface DropDownButtonType extends ButtonProps {
  options?: Array<{ [x: string]: string }>
}

export const DropDownButton = ({
  className,
  children,
  text,
  to,
  icon,
  isIconOnly
}: DropDownButtonType): ReactElement => {
  return (
    <Menu>
      <Menu.Button
        className={cn(
          'px-3 py-2 active:scale-95 bg-main border-2 transition-all duration-101 hover:text-white hover:bg-primary',
          {
            '': icon,
            'w-auto px-4 py-1': isIconOnly
          },
          className
        )}
      >
        {!isIconOnly && <span className="w-full">{text}</span>}
        {icon && <span className="text-xl">{icon}</span>}
        {children}
      </Menu.Button>
      <Menu.Items className="fixed end-10 mt-10 drop-shadow-2xl bg-main border-2 text-nowrap flex flex-col">
        <Menu.Item>
          <Link
            className="min-w-32 active:bg-primary active:scale-95 bg-main active:text-white hover:text-white hover:bg-primary text-black p-3 transition-all duration-150"
            to={to || ''}
          ></Link>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}
