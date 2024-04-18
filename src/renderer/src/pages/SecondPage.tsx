import { AppLayout, Button } from '@renderer/components'
import { ReactElement } from 'react'
import { LuUsers, LuUserCog, LuChevronLeft } from 'react-icons/lu'

export const SecondPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Header>
        <h1 className="text-4xl col-span-full text-center">App Name</h1>
      </AppLayout.Header>
      <AppLayout.Menu>
        <Button icon={<LuChevronLeft />} to="/" text="Menos Opciones" />
        <Button icon={<LuUsers />} text="Usuarios" />
        <Button icon={<LuUserCog />} text="Clientes" />
      </AppLayout.Menu>
    </AppLayout>
  )
}
