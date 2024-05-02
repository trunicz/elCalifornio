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
  LuHome,
  LuBookOpenCheck,
  LuSticker
} from 'react-icons/lu'
import { Separator } from './separator'
import { Link } from 'wouter'
import { useAuthStore } from '@renderer/stores/useAuth'

export const AppLayout = ({
  className,
  children,
  ...props
}: ComponentProps<'main'>): ReactElement => {
  const { signOut } = useAuthStore()
  return (
    <main className={cn('bg-main theme-light h-full flex', className)} {...props}>
      <AppMenu>
        <div className="flex items-center justify-center gap-2">
          <img src="/src/assets/frame.png?asset" className="w-[100px]  p-3" />
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
        <Button
          text="Cerrar Sesión"
          className="text-base text-stroke font-medium"
          icon={<LuLogOut />}
          onClick={() => signOut()}
        />
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
    <section className={cn('bg-main flex-1 flex flex-col overflow-hidden', className)} {...props}>
      <AppHeader title="nombre usuario" />
      {children}
    </section>
  )
}

interface AppPageOptions extends ComponentProps<'section'> {
  pageTitle: string
  hasAddButton?: boolean
  addRoute?: string
}

const AppPageOptions = ({
  className,
  children,
  pageTitle,
  hasAddButton = true,
  addRoute = '',
  ...props
}: AppPageOptions): ReactElement => {
  return (
    <section className={cn('flex items-center min-h-20 p-4 border-b-2', className)} {...props}>
      <h1 className="text-2xl w-full">{pageTitle}</h1>
      {children}
      {hasAddButton && (
        <Link
          className="ms-4 flex items-center justify-center border-2 hover:text-white transition-colors px-4 w-auto rounded-xl h-full border-emerald-400 text-emerald-400 font-medium hover:bg-emerald-400 gap-1"
          to={addRoute}
        >
          Agregar
        </Link>
      )}
    </section>
  )
}

AppLayout.Header = AppHeader
AppLayout.Menu = AppMenu
AppLayout.Content = AppContent
AppLayout.PageOptions = AppPageOptions
