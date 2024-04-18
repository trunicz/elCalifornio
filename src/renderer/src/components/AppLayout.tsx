import { cn } from '@renderer/utils'
import { ComponentProps, ReactElement } from 'react'
import { Button } from './button'
import {
  LuUsers,
  LuUserCog,
  LuShapes,
  LuHeartHandshake,
  LuFileEdit,
  LuChevronRight
} from 'react-icons/lu'

export const AppLayout = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>): ReactElement => {
  return (
    <main className={cn('bg-blue-200 theme-light h-full flex flex-col', className)} {...props}>
      {children}
    </main>
  )
}

const AppHeader = ({ className, children, ...props }: ComponentProps<'div'>): ReactElement => {
  return (
    <header
      className={cn('bg-main text-stroke p-6 flex justify-center items-center', className)}
      {...props}
    >
      {children}
    </header>
  )
}

const AppMenu = ({ className, children, ...props }: ComponentProps<'div'>): ReactElement => {
  return (
    <section
      className={cn(
        'bg-main flex-1 p-6 overflow-hidden grid grid-rows-2 font-bold text-xl grid-cols-3 gap-6',
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export const AppMenuButtons = (): ReactElement => {
  return (
    <>
      <Button icon={<LuUsers />} text="Usuarios" />
      <Button icon={<LuUserCog />} text="Clientes" />
      <Button icon={<LuShapes />} text="Inventario" />
      <Button icon={<LuHeartHandshake />} text="Rentar" />
      <Button icon={<LuFileEdit />} text="Contratos" />
      <Button icon={<LuChevronRight />} text="Mas Opciones" />
    </>
  )
}

AppLayout.Header = AppHeader
AppLayout.Menu = AppMenu
AppLayout.MenuButtons = AppMenuButtons
