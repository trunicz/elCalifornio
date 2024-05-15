/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppLayout, Button, SearchBar, Table, useModal } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useClients } from '@renderer/hooks'
import { useAlert } from '@renderer/hooks/useAlert'
import { ReactElement, useEffect, useState } from 'react'
import { IoLogoWhatsapp, IoWarning } from 'react-icons/io5'
import { LuCheckCircle2, LuDownload, LuFolder } from 'react-icons/lu'
import { useLocation } from 'wouter'

export const ClientsPage = (): ReactElement => {
  const [, setLocation] = useLocation()
  const [clients, setClients] = useState<unknown[] | null>([])
  const { clientList, getAllClients, deleteClient, getClientById, getAllFiles, download } =
    useClients()
  const { Modal, openModal, closeModal } = useModal()
  const { Alert, emitAlert } = useAlert()

  useEffect(() => {
    getAllClients().then((response) => setClients(response))
  }, [])

  const preview = (id: string | number, src: string): void => {
    openModal(
      <div className="overflow-y-auto w-auto flex flex-col justify-center">
        <img
          src={src}
          alt="img"
          className="h-[500px] object-cover rounded-xl"
          onError={(e: any) => {
            e.onError = null
            e.target.src = '/src/assets/noImage.jpeg'
          }}
        />
        <Button
          className="bg-gray-500 text-white hover:bg-gray-600 transition-all mt-2"
          text="volver"
          onClick={() => seeFiles(id)}
        />
      </div>
    )
  }

  const seeFiles = (id: string | number): void => {
    getAllFiles(id).then((prom: object[]) => {
      const files = Array.from(prom)
      openModal(
        <div className="overflow-y-auto flex flex-col gap-4">
          {files.map((file: any, index) => {
            const imageURL =
              import.meta.env.VITE_SUPABASE_URL +
              '/storage/v1/object/public/clients_storage/clients/' +
              id +
              '/' +
              file.name

            return (
              <section
                key={file.name + index}
                className="transition-all flex border overflow-hidden rounded-xl hover:bg-gray-100"
              >
                <div
                  className="flex flex-1 items-center h-[70px]"
                  onClick={() => preview(id, imageURL)}
                >
                  <div className="w-24 flex justify-center items-center border-r">
                    <img
                      className="object-cover h-full"
                      src={imageURL}
                      onError={(e: any) => {
                        e.onError = null
                        e.target.src = '/src/assets/noImage.jpeg'
                      }}
                      alt={file.name}
                    />
                  </div>
                  <h3 className="text-xl w-full p-2">{file.name}</h3>
                </div>
                <button
                  className="w-24 text-center text-xl flex justify-center items-center hover:bg-gray-200 transition-all active:bg-gray-300/75"
                  onClick={() =>
                    download(id, file.name).then((msg) => {
                      emitAlert(`Archivo guardado en: ${msg}`, 'success', `${msg}`)
                    })
                  }
                >
                  <LuDownload />
                </button>
              </section>
            )
          })}
        </div>
      )
    })
  }

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
            <div className="flex gap-2 border-t-2 items-center pt-4 text-xl">
              <button
                className="bg-gray-400 border-0 text-xl w-auto p-2 px-7 rounded-lg transition-all active:scale-95 flex items-center gap-2 text-white  hover:bg-gray-500/80"
                color="warning"
                onClick={() => seeFiles(id)}
              >
                <LuFolder />
                Archivos
              </button>
              <a
                className="bg-green-500 border-0 text-xl w-full rounded-lg flex items-center gap-2  px-4 p-2 transition-all active:scale-95 text-white  hover:bg-green-600"
                href={'whatsapp://send/?phone=' + client.phone}
              >
                <IoLogoWhatsapp />
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
          <div>
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
        <Modal title="Cliente" className="w-auto min-w-[450px]" />
        {Alert}
        {clientList ? (
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
