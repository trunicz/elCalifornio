import { AppLayout, SearchBar, Table, useModal } from '@renderer/components'
import { ReactElement, useEffect, useState } from 'react'
// import { _userData } from '@renderer/stores/mocks'
import { Loading } from '@renderer/components/Loading'
import { UserIdentity } from '@supabase/supabase-js'
import { useAdmin } from '@renderer/hooks/useAdmin'
import { formatDate } from '@renderer/utils'
import { useLocation } from 'wouter'

export const UsersPage = (): ReactElement => {
  const { getUsers, getUser, usersList, deleteUser } = useAdmin()
  const [data, setData] = useState<unknown | UserIdentity[]>(null)
  const [selectedUser, setSelectedUser] = useState<object | null>(null)
  const [, setLocation] = useLocation()

  const { Modal, openModal } = useModal()

  useEffect(() => {
    getUsers().then((res) => {
      setData(res)
    })
  }, [])

  const onDeleteUser = async (id: string): Promise<void> => {
    try {
      setData(null)
      await deleteUser(id).then(async () => {
        await getUsers().then((res) => setData(res))
      })
    } catch (error) {
      console.error(error)
    }
  }

  const watchUser = (id: string): void => {
    getUser(id).then((res) => {
      setSelectedUser(res)
      openModal()
    })
  }

  const editUser = (id: string): void => {
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
              <div key={index} className="w-full flex justify-start  mt-1">
                {key.replaceAll('_', ' ')}:
                <span className="ms-auto bg-gray-500 text-white px-2 rounded-lg">
                  {formatDate(selectedUser[key])}
                </span>
              </div>
            ))}
        </Modal>
        {data ? (
          <Table
            data={data}
            editFunction={editUser}
            deleteFunction={onDeleteUser}
            watchFunction={watchUser}
          />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}
