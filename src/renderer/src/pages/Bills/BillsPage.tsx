import { AppLayout, Button } from '@renderer/components'
import { ReactElement } from 'react'

export const BillsPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Header title="App Name" leftButton={<Button text="Volver" to="/second" />} />
      <AppLayout.Content>
        <h1>Tabla Recibos</h1>
      </AppLayout.Content>
    </AppLayout>
  )
}
