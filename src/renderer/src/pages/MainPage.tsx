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
        <MenuButton icon={<LuUserCog />} to="/clients" text="Clientes" />
        <MenuButton icon={<LuShapes />} to="/inventory" text="Inventario" />
        <MenuButton icon={<LuHeartHandshake />} to="/rent" text="Rentar" />
        <MenuButton icon={<LuFileEdit />} to="/contracts" text="Contratos" />
        <MenuButton icon={<LuChevronRight />} to="/second" text="Mas Opciones" />
      </AppLayout.Menu>
    </AppLayout>
  )
}
