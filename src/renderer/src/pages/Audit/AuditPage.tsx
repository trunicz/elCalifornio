import { AppLayout, Button } from '@renderer/components'
import { ReactElement } from 'react'

export const AuditPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Header title="App Name" leftButton={<Button text="Volver" to="/second" />} />
      <AppLayout.Content>
        <h1>Tabla Auditoria</h1>
      </AppLayout.Content>
    </AppLayout>
  )
}
