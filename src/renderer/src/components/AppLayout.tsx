import { cn } from '@renderer/utils'
import { ComponentProps, ReactElement } from 'react'
import { Button } from './button'

export const AppLayout = ({
  className,
  children,
  ...props
}: ComponentProps<'main'>): ReactElement => {
  return (
    <main className={cn('bg-blue-200 theme-light h-full flex flex-col', className)} {...props}>
      {children}
    </main>
  )
}

const AppHeader = ({
  className,
  title,
  children,
  ...props
}: ComponentProps<'header'>): ReactElement => {
  return (
    <header className={cn('bg-main text-stroke p-6 grid grid-cols-6', className)} {...props}>
      {children}
      <Button text="Perfil" />
      <h1 className="text-4xl col-span-4 text-center ">{title}</h1>
      <Button text="Ajustes" />
    </header>
  )
}

const AppMenu = ({ className, children, ...props }: ComponentProps<'section'>): ReactElement => {
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

AppLayout.Header = AppHeader
AppLayout.Menu = AppMenu
