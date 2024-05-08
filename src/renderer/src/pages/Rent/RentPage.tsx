import { AppLayout, SearchBar, Table, useModal } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useRentals } from '@renderer/hooks/useRentals'
import { ReactElement, useEffect, useState } from 'react'

export const RentPage = (): ReactElement => {
  const { getAllRentals, rentals, deleteRental } = useRentals()
  const [rentList, setRentList] = useState<unknown[] | null>(null)
  const { Modal, openModal } = useModal()

  useEffect(() => {
    getAllRentals().then((res) => setRentList(res))
  }, [])

  const deleteFunction = (id: string | number): void => {
    deleteRental(id).then(() => {
      openModal(
        <>
          <div></div>
        </>
      )
    })
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Rentas" hasAddButton={true}>
          <SearchBar searchFunction={setRentList} data={rentals} />
        </AppLayout.PageOptions>
        <Modal title="Rentas" />
        {rentList ? (
          <Table
            data={rentList}
            hiddenKeys={['id', 'client_id', 'user_id']}
            deleteFunction={deleteFunction}
          />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}
