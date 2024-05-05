import { AppLayout, SearchBar, Table } from '@renderer/components'
import { ReactElement, useEffect, useState } from 'react'
// import { _userData } from '@renderer/stores/mocks'
import { Loading } from '@renderer/components/Loading'
import { UserIdentity } from '@supabase/supabase-js'
import { useAdmin } from '@renderer/hooks/useAdmin'

export const UsersPage = (): ReactElement => {
  const { getUsers, usersList, deleteUser } = useAdmin()
  const [data, setData] = useState<unknown | UserIdentity[]>(null)

  useEffect(() => {
    getUsers().then((res) => {
      setData(res)
    })
  }, [])

  const funDeleteUser = async (id: string): Promise<void> => {
    try {
      setData(null)
      await deleteUser(id).then(async () => {
        await getUsers().then((res) => setData(res))
      })
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Usuarios" addRoute="/users/create">
          <SearchBar searchFunction={setData} data={usersList} />
        </AppLayout.PageOptions>
        {data ? <Table data={data} deleteFunction={funDeleteUser} /> : <Loading />}
      </AppLayout.Content>
    </AppLayout>
  )
}
