import { AppLayout, MenuButton } from '@renderer/components'
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
      <AppLayout.Header title="App Name" />
      <AppLayout.Menu>
        <MenuButton icon={<LuUsers />} to="/users" text="Usuarios" />
        <MenuButton icon={<LuUserCog />} text="Clientes" />
        <MenuButton icon={<LuShapes />} text="Inventario" />
        <MenuButton icon={<LuHeartHandshake />} text="Rentar" />
        <MenuButton icon={<LuFileEdit />} text="Contratos" />
        <MenuButton icon={<LuChevronRight />} to="/second" text="Mas Opciones" />
      </AppLayout.Menu>
    </AppLayout>
  )
}
