import { AppLayout, Button } from '@renderer/components'
import { ReactElement } from 'react'

export const ClientsPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Header title="App Name" leftButton={<Button text="Volver" to="/" />} />
      <AppLayout.Content>
        <h1>Tabla Clientes</h1>
      </AppLayout.Content>
    </AppLayout>
  )
}
