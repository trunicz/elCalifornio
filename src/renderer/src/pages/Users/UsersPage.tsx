import { AppLayout, Button, Table } from '@renderer/components'
import { ReactElement } from 'react'
import { _userData } from '@renderer/stores/mocks'

export const UsersPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Header title="App Name" leftButton={<Button text="Volver" to="/" />} />
      <AppLayout.Content>
        <Table data={_userData} />
      </AppLayout.Content>
    </AppLayout>
  )
}
