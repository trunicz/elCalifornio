import { cn } from '@renderer/utils'
import { ComponentProps, ReactElement } from 'react'
import { Button, DropDownButton } from './button'

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
    <header className={cn('bg-main text-stroke p-6 grid grid-cols-6', className)} {...props}>
      {children}
      {leftButton ? leftButton : <DropDownButton />}
      <h1 className="text-4xl col-span-4 text-center ">{title}</h1>
      {rightButton ? rightButton : <Button text="Ajustes" />}
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

const AppContent = ({ className, children, ...props }: ComponentProps<'section'>): ReactElement => {
  return (
    <section className={cn('bg-main text-stroke flex-1 p-6 text-xl ', className)} {...props}>
      {children}
    </section>
  )
}

AppLayout.Header = AppHeader
AppLayout.Menu = AppMenu
AppLayout.Content = AppContent
