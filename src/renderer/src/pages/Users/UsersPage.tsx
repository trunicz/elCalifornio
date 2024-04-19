import { AppLayout, Button, SearchBar, Table } from '@renderer/components'
import { ReactElement, useState } from 'react'
import { _userData } from '@renderer/stores/mocks'

export const UsersPage = (): ReactElement => {
  const [userData, setUserData] = useState(_userData)
  return (
    <AppLayout>
      <AppLayout.Header title="App Name" leftButton={<Button text="Volver" to="/" />} />
      <AppLayout.Content>
        <SearchBar searchFunction={setUserData} data={_userData} />
        <Table data={userData} />
      </AppLayout.Content>
    </AppLayout>
  )
}
