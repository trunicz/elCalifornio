import { AppLayout } from '@renderer/components'
import { ReactElement } from 'react'

export const CreateUserPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Agregar Usuario" hasAddButton={false} />
      </AppLayout.Content>
    </AppLayout>
  )
}
