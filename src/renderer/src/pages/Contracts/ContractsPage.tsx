import { AppLayout, Button } from '@renderer/components'
import { ReactElement } from 'react'
import { LuFileBadge } from 'react-icons/lu'

export const ContractsPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Content>
        <div className="flex-1 flex justify-center items-center">
          <a href="/src/renderer/src/assets/frame.png" download={'frame.png'}>
            <Button
              className="w-auto gap-2"
              color="success"
              text="Crear Contrato"
              iconLeft={true}
              icon={<LuFileBadge />}
            />
          </a>
        </div>
      </AppLayout.Content>
    </AppLayout>
  )
}
