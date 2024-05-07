import { AppLayout, SearchBar, Table, useModal } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useClients } from '@renderer/hooks'
import { ReactElement, useEffect, useState } from 'react'

export const ClientsPage = (): ReactElement => {
  const [clients, setClients] = useState<unknown[] | null>([])
  const { clientList, getAllClients, getClientById } = useClients()
  const { Modal, openModal } = useModal()

  useEffect(() => {
    getAllClients().then((response) => setClients(response))
  }, [])

  const watchFunction = (id: string | number): void => {
    getClientById(id).then((res) => {
      if (res) {
        const client = res[0]
        openModal(
          <>
            {/* {JSON.stringify(client)} */}
            <p className="text-lg flex gap-2">
              <span className="font-bold text-nowrap">Nombre:</span>
              <span className="">{client.name + ' ' + client.last_name}</span>
            </p>
            <p className="text-lg flex gap-2">
              <span className="font-bold text-nowrap">Correo:</span>
              <span className="">{client.email}</span>
            </p>
            <p className="text-lg flex gap-2">
              <span className="font-bold text-nowrap">Teléfono:</span>
              <span className="">{client.phone}</span>
            </p>
            <p className="text-lg flex gap-2">
              <span className="font-bold text-nowrap">Foráneo:</span>
              <span className="">{client.isForeing ? 'Si' : 'No'}</span>
            </p>
            <p className="text-lg flex gap-2">
              <span className="font-bold text-nowrap">Tipo de Cliente:</span>
              <span className="">{client.client_type[0].type_name}</span>
            </p>
            <p className="text-lg flex gap-2">
              <span className="font-bold text-nowrap">Dirección:</span>
              <span className="">{client.address}</span>
            </p>
          </>
        )
      }
    })
  }
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Clientes">
          <SearchBar searchFunction={setClients} data={clientList} />
        </AppLayout.PageOptions>
        <Modal title="cliente" className="w-auto" />
        {clientList ? <Table data={clients} watchFunction={watchFunction} /> : <Loading />}
      </AppLayout.Content>
    </AppLayout>
  )
}
