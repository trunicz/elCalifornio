/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppLayout, Button, SearchBar, Table, useModal } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useClients } from '@renderer/hooks'
import { ReactElement, useEffect, useState } from 'react'
import { IoWarning } from 'react-icons/io5'
import { LuReply } from 'react-icons/lu'
import { Link, useLocation } from 'wouter'

export const ClientsBLPages = (): ReactElement => {
  const { getBannedClients, clientList, unBanClientById } = useClients()
  const [clients, setClients] = useState<any>()
  const [, setLocation] = useLocation()
  const { Modal, openModal, closeModal } = useModal()

  useEffect(() => {
    getBannedClients().then((res: any) => {
      setClients(res)
    })
  }, [])

  const restoreClient = (id: string | number): void => {
    if (id) {
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
                onClick={() => unBanClientById(id).then(() => setLocation('/clients'))}
              />
            </div>
          </div>
        </>
      )
    }
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Lista Negra" hasAddButton={false}>
          <SearchBar searchFunction={setClients} data={clientList} />
          <Link
            to="/clients"
            className="ms-4 flex items-center justify-center hover:bg-blue-500 px-4 w-auto rounded-xl h-full bg-blue-400 text-nowrap text-white font-medium active:scale-95 transition-all gap-1"
          >
            <span className="text-xl">
              <LuReply />
            </span>
            Clientes
          </Link>
        </AppLayout.PageOptions>
        <Modal title="Reactivar Cliente" />
        {clientList ? (
          <Table
            data={clients}
            hiddenKeys={['id']}
            canSeeDelete={false}
            canSeeEdit={false}
            watchFunction={restoreClient}
            customMoreBtn={{ icon: <LuReply />, title: 'Desbanear' }}
          />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}
