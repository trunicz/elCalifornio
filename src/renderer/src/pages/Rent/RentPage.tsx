import { AppLayout, Button, SearchBar, Table, useModal } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useRentals } from '@renderer/hooks/useRentals'
import { ReactElement, useEffect, useState } from 'react'
import { LuCheckCircle } from 'react-icons/lu'

export const RentPage = (): ReactElement => {
  const { getAllRentals, rentals, deleteRental } = useRentals()
  const [rentList, setRentList] = useState<unknown[] | null>(null)
  const { Modal, openModal, closeModal } = useModal()

  useEffect(() => {
    getAllRentals().then((res) => setRentList(res))
  }, [])

  const deleteFunction = (id: string | number): void => {
    deleteRental(id).then(() => {
      getAllRentals().then((res) => {
        setRentList(res)
        openModal(
          <>
            <div>
              <span className="animate-fade-up animate-duration-200 text-6xl mb-4 flex justify-center text-green-500">
                <LuCheckCircle />
              </span>
              <h3>¡Se Elimino Correctamente!</h3>
              <Button
                className="mt-4"
                color="success"
                text="Aceptar"
                onClick={() => closeModal()}
              />
            </div>
          </>
        )
      })
    })
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Rentas" hasAddButton={true} addRoute="/rent/create">
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
