import { AppLayout } from '@renderer/components'
import { ReactElement } from 'react'

export const MainPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.Header title="App Name" />
      </AppLayout.Content>
    </AppLayout>
  )
}
