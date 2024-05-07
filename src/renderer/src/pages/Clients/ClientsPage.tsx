import { AppLayout, Button, SearchBar, Table, useModal } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useClients } from '@renderer/hooks'
import { ReactElement, useEffect, useState } from 'react'
import { LuCheckCircle2 } from 'react-icons/lu'
import { useLocation } from 'wouter'

export const ClientsPage = (): ReactElement => {
  const [, setLocation] = useLocation()
  const [clients, setClients] = useState<unknown[] | null>([])
  const { clientList, getAllClients, deleteClient, getClientById } = useClients()
  const { Modal, openModal, closeModal } = useModal()

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
              <span className="font-medium text-nowrap">Nombre:</span>
              <span className="bg-accent px-2 text-white rounded-md">
                {client.name + ' ' + client.last_name}
              </span>
            </p>
            <p className="text-lg flex gap-2">
              <span className="font-medium text-nowrap">Correo:</span>
              <span className="bg-accent px-2 text-white rounded-md">{client.email}</span>
            </p>
            <p className="text-lg flex gap-2">
              <span className="font-medium text-nowrap">Teléfono:</span>
              <span className="bg-accent px-2 text-white rounded-md">{client.phone}</span>
            </p>
            <p className="text-lg flex gap-2">
              <span className="font-medium text-nowrap">Foráneo:</span>
              <span className="bg-accent px-2 text-white rounded-md">
                {client.isForeign ? 'Si' : 'No'}
              </span>
            </p>
            <p className="text-lg flex gap-2">
              <span className="font-medium text-nowrap">Tipo de Cliente:</span>
              <span className="bg-accent px-2 text-white rounded-md">
                {client.client_type[0].type_name}
              </span>
            </p>
            <p className="text-lg flex gap-2">
              <span className="font-medium text-nowrap">Dirección:</span>
              <span className="bg-accent px-2 text-white rounded-md">{client.address}</span>
            </p>
          </>
        )
      }
    })
  }

  const editFunction = (id: string | number): void => {
    setLocation('/clients/' + id)
  }

  const deleteFunction = async (id: string | number): Promise<void> => {
    await deleteClient(id).then(async () => {
      await getAllClients().then((res) => setClients(res))
      openModal(
        <div>
          <span className="animate-fade-up text-6xl mb-4 flex justify-center text-green-500">
            <LuCheckCircle2 />
          </span>
          <h3>¡El cliente se elimino con éxito!</h3>
          <Button className="mt-4" color="success" text="Aceptar" onClick={() => closeModal()} />
        </div>
      )
    })
  }
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Clientes" addRoute="/clients/create">
          <SearchBar searchFunction={setClients} data={clientList} />
        </AppLayout.PageOptions>
        <Modal title="cliente" className="w-auto" />
        {clientList ? (
          <Table
            data={clients}
            watchFunction={watchFunction}
            deleteFunction={deleteFunction}
            editFunction={editFunction}
          />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}
