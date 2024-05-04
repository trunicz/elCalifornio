import { AppLayout, SearchBar, Table } from '@renderer/components'
import { ReactElement, useEffect, useState } from 'react'
// import { _userData } from '@renderer/stores/mocks'
import { Loading } from '@renderer/components/Loading'
import { UserIdentity } from '@supabase/supabase-js'
import { useAdmin } from '@renderer/hooks/useAdmin'

export const UsersPage = (): ReactElement => {
  const { users, usersList } = useAdmin()
  const [data, setData] = useState<unknown | UserIdentity[]>(null)

  useEffect(() => {
    users().then((response) => setData(response))
  }, [])
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Usuarios" addRoute="/users/create">
          <SearchBar searchFunction={setData} data={usersList} />
        </AppLayout.PageOptions>
        {data ? <Table data={data} /> : <Loading />}
      </AppLayout.Content>
    </AppLayout>
  )
}
