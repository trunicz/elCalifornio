import { AppLayout } from '@renderer/components'
import { ReactElement } from 'react'

export const ClientsPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Content>
        <h1>Tabla Clientes</h1>
      </AppLayout.Content>
    </AppLayout>
  )
}
