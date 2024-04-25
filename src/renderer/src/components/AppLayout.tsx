import { cn } from '@renderer/utils'
import { ComponentProps, ReactElement } from 'react'
import { Button, DropDownButton } from './button'

export const AppLayout = ({
  className,
  children,
  ...props
}: ComponentProps<'main'>): ReactElement => {
  return (
    <main className={cn('bg-blue-200 theme-light h-full flex', className)} {...props}>
      {children}
    </main>
  )
}

interface AppHeaderButton extends ComponentProps<'header'> {
  leftButton?: ReactElement
  rightButton?: ReactElement
}

const AppHeader = ({
  className,
  leftButton,
  rightButton,
  title,
  children,
  ...props
}: AppHeaderButton): ReactElement => {
  return (
    <header className={cn('bg-main p-6 grid grid-cols-6', className)} {...props}>
      {children}
      {leftButton ? leftButton : <DropDownButton />}
      <h1 className="text-4xl col-span-4 text-center ">{title}</h1>
      {rightButton ? rightButton : <Button text="Ajustes" />}
    </header>
  )
}

const AppMenu = ({ className, children, ...props }: ComponentProps<'section'>): ReactElement => {
  return (
    <section className={cn('bg-main w-[250px] p-4 flex flex-col text-xl', className)} {...props}>
      {children}
    </section>
  )
}

const AppContent = ({ className, children, ...props }: ComponentProps<'section'>): ReactElement => {
  return (
    <section className={cn('bg-main text-xl ', className)} {...props}>
      {children}
    </section>
  )
}

AppLayout.Header = AppHeader
AppLayout.Menu = AppMenu
AppLayout.Content = AppContent
