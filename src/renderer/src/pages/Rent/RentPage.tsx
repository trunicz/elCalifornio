import { AppLayout } from '@renderer/components'
import { ReactElement } from 'react'

export const RentPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.Header title="App Name" />
        <h1>Tabla Rentas</h1>
      </AppLayout.Content>
    </AppLayout>
  )
}
