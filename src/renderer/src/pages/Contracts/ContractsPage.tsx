import { AppLayout, Button } from '@renderer/components'
import { useContracts } from '@renderer/hooks/useContracts'
import { ReactElement } from 'react'
import { LuFileBadge } from 'react-icons/lu'
import '/src/assets/contract.pdf?asset'

export const ContractsPage = (): ReactElement => {
  const { createContract } = useContracts()
  return (
    <AppLayout>
      <AppLayout.Content>
        <div className="flex-1 flex justify-center items-center">
          <Button
            className="w-auto gap-2"
            color="success"
            text="Crear Contrato"
            iconLeft={true}
            icon={<LuFileBadge />}
            onClick={() => createContract({ name: 'BENITO CAMELO' }, 'contract')}
          />
        </div>
      </AppLayout.Content>
    </AppLayout>
  )
}
