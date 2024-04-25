import { AppLayout, Button, MenuButton, Separator } from '@renderer/components'
import { ReactElement } from 'react'
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

export const MainPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Menu>
        <div className="min-h-20 flex items-center justify-center gap-2">
          <LuSwords />
          App Name
        </div>
        <div className="flex-1">
          <MenuButton icon={<LuHome />} to="/" text="Inicio" />
          <Separator text="Usuarios" />
          <MenuButton icon={<LuUsers />} to="/users" text="Usuarios" />
          <MenuButton icon={<LuUserCog />} to="/clients" text="Clientes" />
          <Separator text="Productos" />
          <MenuButton icon={<LuHeartHandshake />} to="/rent" text="Rentar" />
          <MenuButton icon={<LuShapes />} to="/inventory" text="Inventario" />
          <Separator text="Historial" />
          <MenuButton icon={<LuFileEdit />} to="/contracts" text="Contratos" />
          <MenuButton icon={<LuSticker />} to="/contracts" text="Recibos" />
          <MenuButton icon={<LuBookOpenCheck />} to="/contracts" text="Auditoria" />
        </div>
        <Button text="Cerrar Sesión" className="text-base" icon={<LuLogOut />} />
      </AppLayout.Menu>
      <AppLayout.Content>
        <AppLayout.Header title="App Name" />
      </AppLayout.Content>
    </AppLayout>
  )
}
