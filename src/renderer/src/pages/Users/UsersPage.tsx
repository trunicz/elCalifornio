import { AppLayout, SearchBar, Table } from '@renderer/components'
import { ReactElement, useState } from 'react'
import { _userData } from '@renderer/stores/mocks'

export const UsersPage = (): ReactElement => {
  const [userData, setUserData] = useState([])

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Usuarios" addRoute="/users/create">
          <SearchBar searchFunction={setUserData} data={_userData} />
        </AppLayout.PageOptions>
        <Table data={userData} />
      </AppLayout.Content>
    </AppLayout>
  )
}
