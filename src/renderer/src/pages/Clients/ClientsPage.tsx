import { AppLayout, SearchBar, Table } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useClients } from '@renderer/hooks'
import { ReactElement, useEffect, useState } from 'react'

export const ClientsPage = (): ReactElement => {
  const [clients, setClients] = useState<unknown[] | null>([])
  const { clientList, getAllClients } = useClients()

  useEffect(() => {
    getAllClients().then((response) => setClients(response))
  }, [])
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Clientes">
          <SearchBar searchFunction={setClients} data={clientList} />
        </AppLayout.PageOptions>
        {clientList ? <Table data={clients} /> : <Loading />}
      </AppLayout.Content>
    </AppLayout>
  )
}
