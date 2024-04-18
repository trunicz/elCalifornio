import { AppLayout, Button } from '@renderer/components'
import { ReactElement } from 'react'
import {
  LuUsers,
  LuUserCog,
  LuShapes,
  LuHeartHandshake,
  LuFileEdit,
  LuChevronRight
} from 'react-icons/lu'

export const MainPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Header />
      <AppLayout.Menu>
        <Button icon={<LuUsers />} text="Usuarios" />
        <Button icon={<LuUserCog />} text="Clientes" />
        <Button icon={<LuShapes />} text="Inventario" />
        <Button icon={<LuHeartHandshake />} text="Rentar" />
        <Button icon={<LuFileEdit />} text="Contratos" />
        <Button icon={<LuChevronRight />} to="/second" text="Mas Opciones" />
      </AppLayout.Menu>
    </AppLayout>
  )
}
