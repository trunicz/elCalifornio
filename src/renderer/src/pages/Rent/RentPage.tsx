import { AppLayout, SearchBar, Table } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useRentals } from '@renderer/hooks/useRentals'
import { ReactElement, useEffect, useState } from 'react'

export const RentPage = (): ReactElement => {
  const { getAllRentals, rentals } = useRentals()
  const [rentList, setRentList] = useState<unknown[] | null>(null)

  useEffect(() => {
    getAllRentals().then((res) => setRentList(res))
  }, [])
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Rentas" hasAddButton={true}>
          <SearchBar searchFunction={setRentList} data={rentals} />
        </AppLayout.PageOptions>
        {rentList ? (
          <Table data={rentList} hiddenKeys={['id', 'client_id', 'user_id']} />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}
