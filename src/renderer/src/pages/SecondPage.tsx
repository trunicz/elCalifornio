import { AppLayout, MenuButton } from '@renderer/components'
import { ReactElement } from 'react'
import { LuSticker, LuFileSearch, LuChevronLeft } from 'react-icons/lu'

export const SecondPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Header />
      <AppLayout.Menu>
        <MenuButton icon={<LuChevronLeft />} to="/" text="Regresar" />
        <MenuButton icon={<LuSticker />} text="Recibos" />
        <MenuButton icon={<LuFileSearch />} text="Auditoria" />
      </AppLayout.Menu>
    </AppLayout>
  )
}
