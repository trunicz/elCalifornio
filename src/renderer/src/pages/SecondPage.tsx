import { AppLayout, Button } from '@renderer/components'
import { ReactElement } from 'react'
import { LuSticker, LuFileSearch, LuChevronLeft } from 'react-icons/lu'

export const SecondPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Header />
      <AppLayout.Menu>
        <Button icon={<LuChevronLeft />} to="/" text="Regresar" />
        <Button icon={<LuSticker />} text="Recibos" />
        <Button icon={<LuFileSearch />} text="Auditoria" />
      </AppLayout.Menu>
    </AppLayout>
  )
}
