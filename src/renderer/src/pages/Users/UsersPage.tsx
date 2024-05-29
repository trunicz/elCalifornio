/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppLayout, Button, SearchBar, Table, useModal } from '@renderer/components'
import { ReactElement, useEffect, useState } from 'react'
// import { _userData } from '@renderer/stores/mocks'
import { Loading } from '@renderer/components/Loading'
import { UserIdentity } from '@supabase/supabase-js'
import { useAdmin } from '@renderer/hooks/useAdmin'
import { formatDate } from '@renderer/utils'
import { useLocation } from 'wouter'
import { LuCheckCircle, LuMoreHorizontal } from 'react-icons/lu'
import { IoWarning } from 'react-icons/io5'

export const UsersPage = (): ReactElement => {
  const { getUsers, getUser, usersList, deleteUser } = useAdmin()
  const [data, setData] = useState<unknown | UserIdentity[]>(null)
  const [selectedUser, setSelectedUser] = useState<object | null>(null)
  const [, setLocation] = useLocation()

  const { Modal, openModal, closeModal } = useModal()

  useEffect(() => {
    getUsers().then((res) => {
      setData(res)
    })
  }, [])

  const removeUser = async (id: any): Promise<void> => {
    closeModal().then(async () => {
      setData(null)
      await deleteUser(id).then(async () => {
        await getUsers().then((res) => setData(res))
        openModal(
          <div>
            <span className="animate-fade-up animate-duration-200 text-6xl mb-4 flex justify-center text-green-500">
              <LuCheckCircle />
            </span>
            <h3>¡Se Elimino Correctamente!</h3>
            <Button className="mt-4" color="success" text="Aceptar" onClick={() => closeModal()} />
          </div>
        )
      })
    })
  }

  const onDeleteUser = async (id: string | number): Promise<void> => {
    setSelectedUser(null)
    try {
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
                onClick={() => removeUser(id)}
              />
            </div>
          </div>
        </>
      )
    } catch (error) {
      console.error(error)
    }
  }

  const watchUser = (id: string | number): void => {
    getUser(id).then((res) => {
      setSelectedUser(res)
      openModal(null)
    })
  }

  const editUser = (id: string | number): void => {
    setLocation('/users/' + id)
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Usuarios" addRoute="/users/create">
          <SearchBar searchFunction={setData} data={usersList} />
        </AppLayout.PageOptions>
        <Modal title="Usuario">
          {selectedUser &&
            Object.keys(selectedUser).map((key, index) => (
              <div key={index} className="w-full text-lg flex justify-start  mt-1">
                <span className="w-1/3 text-start">{key.replaceAll('_', ' ')}:</span>
                {selectedUser[key] ? (
                  <span className="bg-gray-100 ms-2 px-2 rounded-lg">
                    {formatDate(selectedUser[key])}
                  </span>
                ) : (
                  <span className="text-gray-500 flex text-xl items-center ms-2">
                    <LuMoreHorizontal />
                  </span>
                )}
              </div>
            ))}
        </Modal>
        {data ? (
          <Table
            data={data}
            canSeeMore={false}
            editFunction={editUser}
            deleteFunction={onDeleteUser}
            watchFunction={watchUser}
            hiddenKeys={['id']}
          />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}
