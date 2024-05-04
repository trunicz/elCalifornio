import { AppLayout, SearchBar, Table } from '@renderer/components'
import { ReactElement, useState } from 'react'
import { _userData } from '@renderer/stores/mocks'
import { Loading } from '@renderer/components/Loading'

export const UsersPage = (): ReactElement => {
  const [data, setData] = useState(_userData)
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Usuarios" addRoute="/users/create">
          <SearchBar searchFunction={setData} data={_userData} />
        </AppLayout.PageOptions>
        {data ? <Table data={data} /> : <Loading />}
      </AppLayout.Content>
    </AppLayout>
  )
}
