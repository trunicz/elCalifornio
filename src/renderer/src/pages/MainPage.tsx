import { AppLayout } from '@renderer/components'
import { ReactElement } from 'react'

export const MainPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Header>
        <h1 className="text-4xl">App Name</h1>
      </AppLayout.Header>
      <AppLayout.Menu>
        <AppLayout.MenuButtons />
      </AppLayout.Menu>
    </AppLayout>
  )
}
