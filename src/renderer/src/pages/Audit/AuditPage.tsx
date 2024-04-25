import { AppLayout } from '@renderer/components'
import { ReactElement } from 'react'

export const AuditPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.Header title="App Name" />
        <h1>Tabla Auditoria</h1>
      </AppLayout.Content>
    </AppLayout>
  )
}
