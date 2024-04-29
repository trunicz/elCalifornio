import { AppLayout, SearchBar, Table } from '@renderer/components'
import { _clientData } from '@renderer/stores/mocks'
import { ReactElement, useState } from 'react'

export const ClientsPage = (): ReactElement => {
  const [clientsData, setClientsData] = useState(_clientData)
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Clientes">
          <SearchBar searchFunction={setClientsData} data={_clientData} />
        </AppLayout.PageOptions>
        <Table data={clientsData} />
      </AppLayout.Content>
    </AppLayout>
  )
}
