import { ComponentProps, ReactElement } from 'react'

export const AppLayout = ({ ...props }: ComponentProps<'div'>): ReactElement => {
  return <div {...props}>AppLayout</div>
}

const AppHeader = ({ ...props }: ComponentProps<'div'>): ReactElement => {
  return <div {...props}>Header</div>
}

const AppMenu = ({ ...props }: ComponentProps<'div'>): ReactElement => {
  return <div {...props}>Menu</div>
}

AppLayout.Menu = AppMenu
AppLayout.Header = AppHeader
