/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppLayout, Button, Form, SearchBar, Table, useModal } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useClients } from '@renderer/hooks'
import { ReactElement, useEffect, useState } from 'react'
import { IoWarning } from 'react-icons/io5'
import { LuReply } from 'react-icons/lu'
import { Link, useLocation } from 'wouter'
import * as Yup from 'yup'

export const ClientsBLPages = (): ReactElement => {
  const { getBannedClients, clientList, unBanClientById } = useClients()
  const [clients, setClients] = useState<any>()
  const [, setLocation] = useLocation()
  const { Modal, openModal, closeModal } = useModal()
  const { createClient } = useClients()

  useEffect(() => {
    loadInfo()
  }, [])

  const loadInfo = (): void => {
    getBannedClients().then((res: any) => {
      setClients(res)
    })
  }

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

  const shouldShowOptions = (row: any): boolean => {
    return !row.isBanned
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Lista Negra" hasAddButton={false}>
          <SearchBar searchFunction={setClients} data={clientList} />
          <Button
            text="Agregar Cliente"
            className=" w-auto text-nowrap ms-4  p-6 border-none bg-gray-400 text-white hover:bg-gray-500"
            onClick={() => createClientModal({ closeModal, openModal, loadInfo, createClient })}
          />
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
            hiddenKeys={['id', 'isBanned', 'strikes']}
            canSeeDelete={false}
            canSeeEdit={false}
            watchFunction={restoreClient}
            customMoreBtn={{ icon: <LuReply />, title: 'Regresar' }}
            shouldShowOptions={shouldShowOptions}
          />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}

const clientSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es obligatorio')
    .min(3, 'Ingrese un mínimo de 3 caracteres'),
  last_name: Yup.string()
    .required('El apellido es obligatorio')
    .min(3, 'Ingrese un mínimo de 3 caracteres')
})

const createClientModal = ({ closeModal, openModal, loadInfo, createClient }): void => {
  const onSubmit = (data: any): void => {
    const values = {
      name: data.name,
      last_name: data.last_name,
      address: 'Desconocido',
      isForeign: false,
      type: 1,
      phone: 'Desconocido',
      strikes: 3,
      isBanned: true
    }
    createClient(values).then(() => {
      closeModal()
      loadInfo()
    })
  }
  const content = (
    <div className="">
      <Form
        onSubmit={onSubmit}
        validationSchema={clientSchema}
        formDirection="col"
        hasRequiereMessage={false}
        fields={[
          {
            name: 'name',
            label: 'Nombre',
            as: 'input',
            type: 'text',
            isRequired: true
          },
          {
            name: 'last_name',
            label: 'Apellido',
            as: 'input',
            type: 'text',
            isRequired: true
          }
        ]}
      >
        <div className="flex gap-4">
          <Button
            type="button"
            text="cancelar"
            className=" w-full text-nowrap  border-none bg-red-400 text-white hover:bg-red-500"
            onClick={() => closeModal()}
          />
          <Button
            text="aceptar"
            className="w-full text-nowrap  border-none bg-green-400 text-white hover:bg-green-500"
          />
        </div>
      </Form>
    </div>
  )

  openModal(content, 'Agregar Cliente')
}
