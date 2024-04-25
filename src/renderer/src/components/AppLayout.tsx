import { cn } from '@renderer/utils'
import { ComponentProps, ReactElement } from 'react'
import { Button, MenuButton } from './button'
import {
  LuUsers,
  LuUserCog,
  LuShapes,
  LuHeartHandshake,
  LuFileEdit,
  LuLogOut,
  LuSwords,
  LuHome,
  LuBookOpenCheck,
  LuSticker
} from 'react-icons/lu'
import { Separator } from './separator'

export const AppLayout = ({
  className,
  children,
  ...props
}: ComponentProps<'main'>): ReactElement => {
  return (
    <main className={cn('bg-main py-4 theme-light h-full flex', className)} {...props}>
      <AppMenu>
        <div className="min-h-12 flex items-center justify-center gap-2">
          <LuSwords />
          App Name
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <MenuButton icon={<LuHome />} to="/" text="Inicio" />
          <Separator text="Usuarios" />
          <MenuButton icon={<LuUsers />} to="/users" text="Usuarios" />
          <MenuButton icon={<LuUserCog />} to="/clients" text="Clientes" />
          <Separator text="Productos" />
          <MenuButton icon={<LuHeartHandshake />} to="/rent" text="Rentar" />
          <MenuButton icon={<LuShapes />} to="/inventory" text="Inventario" />
          <Separator text="Historial" />
          <MenuButton icon={<LuFileEdit />} to="/contracts" text="Contratos" />
          <MenuButton icon={<LuSticker />} to="/bills" text="Recibos" />
          <MenuButton icon={<LuBookOpenCheck />} to="/audit" text="Auditoria" />
        </div>
        <Button text="Cerrar Sesión" className="text-base" icon={<LuLogOut />} />
      </AppMenu>
      {children}
    </main>
  )
}

interface AppHeaderButton extends ComponentProps<'header'> {}

const AppHeader = ({ className, title, children, ...props }: AppHeaderButton): ReactElement => {
  return (
    <header className={cn('bg-main flex justify-end text-lg p-2 border-b-2', className)} {...props}>
      {children}
      <h1 className="col-span-4 text-center ">{title}</h1>
    </header>
  )
}

const AppMenu = ({ className, children, ...props }: ComponentProps<'section'>): ReactElement => {
  return (
    <section
      className={cn('bg-main border-e-2 min-w-[250px] p-4 gap-2 flex flex-col text-xl', className)}
      {...props}
    >
      {children}
    </section>
  )
}

const AppContent = ({ className, children, ...props }: ComponentProps<'section'>): ReactElement => {
  return (
    <section className={cn('bg-main flex-1 px-4 flex flex-col gap-2', className)} {...props}>
      {children}
    </section>
  )
}

interface AppPageOptions extends ComponentProps<'section'> {
  pageTitle: string
}

const AppPageOptions = ({
  className,
  children,
  pageTitle,
  ...props
}: AppPageOptions): ReactElement => {
  return (
    <section className={cn('flex p-2', className)} {...props}>
      <h1>{pageTitle}</h1>
      {children}
    </section>
  )
}

AppLayout.Header = AppHeader
AppLayout.Menu = AppMenu
AppLayout.Content = AppContent
AppLayout.PageOptions = AppPageOptions
