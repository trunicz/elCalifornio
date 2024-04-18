import { AppLayout, Button } from '@renderer/components'
import { ReactElement } from 'react'

export const UsersPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Header title="App Name" leftButton={<Button text="Volver" to="/" />} />
      <AppLayout.Content>
        <h1>tabla</h1>
      </AppLayout.Content>
    </AppLayout>
  )
}
