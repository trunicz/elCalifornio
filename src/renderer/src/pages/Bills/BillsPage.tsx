import { AppLayout } from '@renderer/components'
import { ReactElement } from 'react'

export const BillsPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.Header title="App Name" />
        <h1>Tabla Recibos</h1>
      </AppLayout.Content>
    </AppLayout>
  )
}
