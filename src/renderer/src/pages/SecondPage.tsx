import { AppLayout, MenuButton } from '@renderer/components'
import { ReactElement } from 'react'
import { LuSticker, LuFileSearch, LuChevronLeft } from 'react-icons/lu'

export const SecondPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Header title="App Name" />
      <AppLayout.Menu>
        <MenuButton icon={<LuChevronLeft />} to="/" text="Regresar" />
        <MenuButton icon={<LuSticker />} to="/bills" text="Recibos" />
        <MenuButton icon={<LuFileSearch />} to="/audit" text="Auditoria" />
      </AppLayout.Menu>
    </AppLayout>
  )
}
