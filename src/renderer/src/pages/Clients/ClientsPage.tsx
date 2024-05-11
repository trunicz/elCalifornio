import { AppLayout, Button, SearchBar, Table, useModal } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useClients } from '@renderer/hooks'
import { ReactElement, useEffect, useState } from 'react'
import { IoWarning } from 'react-icons/io5'
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
            <p className="text-lg flex gap-4">
              <span className="font-medium text-nowrap w-1/3 text-start">Nombre:</span>
              <span className="bg-gray-100 px-2  rounded-md">
                {client.name + ' ' + client.last_name}
              </span>
            </p>
            <p className="text-lg flex gap-4">
              <span className="font-medium text-nowrap w-1/3 text-start">Teléfono:</span>
              <span className="bg-gray-100 px-2  rounded-md">{client.phone}</span>
            </p>
            <p className="text-lg flex gap-4">
              <span className="font-medium text-nowrap w-1/3 text-start">Foráneo:</span>
              <span className="bg-gray-100 px-2  rounded-md">{client.isForeign ? 'Si' : 'No'}</span>
            </p>
            <p className="text-lg flex gap-4">
              <span className="font-medium text-nowrap w-1/3 text-start">Tipo de Cliente:</span>
              <span className="bg-gray-100 px-2  rounded-md">
                {client.client_type[0].type_name}
              </span>
            </p>
            <p className="text-lg flex gap-4">
              <span className="font-medium text-nowrap w-1/3 text-start">Dirección:</span>
              <span className="bg-gray-100 px-2  rounded-md">{client.address}</span>
            </p>
            <div className="flex gap-4 border-t-2 pt-4">
              <a
                className="bg-green-500 border-0 text-xl w-full rounded-lg py-2 transition-all active:scale-95 text-white  hover:bg-green-600"
                href={'whatsapp://send/?phone=' + client.phone}
              >
                Contactar con el cliente
              </a>
            </div>
          </>
        )
      }
    })
  }

  const editFunction = (id: string | number): void => {
    setLocation('/clients/' + id)
  }

  const remove = async (id: string | number): Promise<void> => {
    setClients(null)
    closeModal().then(async () => {
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
    })
  }

  const deleteFunction = async (id: string | number): Promise<void> => {
    openModal(
      <>
        <div className="flex flex-col gap-4">
          <div className="flex-1 animate-jump flex justify-center items-center text-9xl text-amber-500">
            <IoWarning />
          </div>
          <div className="">
            <p>Al realizar esta acción no se podrá deshacer</p>
            <p>¿Quiere continuar?</p>
          </div>
          <div className="flex gap-2">
            <Button
              className="animate-fade animate-ease-out animate-duration-200"
              color="danger"
              text="cancelar"
              onClick={closeModal}
            />
            <Button
              className="animate-fade animate-ease-out animate-duration-200"
              color="success"
              text="aceptar"
              onClick={() => remove(id)}
            />
          </div>
        </div>
      </>
    )
  }
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Clientes" addRoute="/clients/create">
          <SearchBar searchFunction={setClients} data={clientList} />
        </AppLayout.PageOptions>
        <Modal title="cliente" className="w-auto min-w-[450px]" />
        {clients ? (
          <Table
            data={clients}
            watchFunction={watchFunction}
            deleteFunction={deleteFunction}
            editFunction={editFunction}
            hiddenKeys={['tipo_cliente', 'foráneo', 'id']}
          />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}
