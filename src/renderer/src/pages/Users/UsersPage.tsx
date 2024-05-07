import { AppLayout, Button, SearchBar, Table, useModal } from '@renderer/components'
import { ReactElement, useEffect, useState } from 'react'
// import { _userData } from '@renderer/stores/mocks'
import { Loading } from '@renderer/components/Loading'
import { UserIdentity } from '@supabase/supabase-js'
import { useAdmin } from '@renderer/hooks/useAdmin'
import { formatDate } from '@renderer/utils'
import { useLocation } from 'wouter'
import { LuCheckCircle, LuMoreHorizontal, LuXCircle } from 'react-icons/lu'

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

  const onDeleteUser = async (id: string | number): Promise<void> => {
    setSelectedUser(null)
    try {
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
    } catch (error) {
      console.error(error)
      openModal(
        <div>
          <span className="animate-fade-up text-6xl mb-4 flex justify-center text-red-500">
            <LuXCircle />
          </span>
          <h3>¡No se pudo eliminar el usuario!</h3>
          <span>{String(error)}</span>
          <Button className="mt-4" color="danger" text="Aceptar" onClick={() => closeModal()} />
        </div>
      )
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
                {key.replaceAll('_', ' ')}:
                {selectedUser[key] ? (
                  <span className="bg-accent ms-2 text-white px-2 rounded-lg">
                    {formatDate(selectedUser[key])}
                  </span>
                ) : (
                  <span className="text-accent flex text-xl items-center ms-2">
                    <LuMoreHorizontal />
                  </span>
                )}
              </div>
            ))}
        </Modal>
        {data ? (
          <Table
            data={data}
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
