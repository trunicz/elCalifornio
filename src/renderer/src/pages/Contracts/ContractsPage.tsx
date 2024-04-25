import { AppLayout } from '@renderer/components'
import { ReactElement } from 'react'

export const ContractsPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.Header title="App Name" />
        <h1>Tabla contratos</h1>
      </AppLayout.Content>
    </AppLayout>
  )
}
