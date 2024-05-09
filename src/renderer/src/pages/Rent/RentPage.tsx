/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppLayout, Button, SearchBar, Table, useModal } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useRentals } from '@renderer/hooks/useRentals'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { LuCheckCircle } from 'react-icons/lu'
import { FiWatch } from 'react-icons/fi'
import { Link } from 'wouter'

export const RentPage = (): ReactElement => {
  const { getAllRentals, rentals, deleteRental, getRental } = useRentals()
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
              <h3>¡Termino la renta Correctamente!</h3>
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

  const watchRental = (id: string | number): void => {
    getRental(id).then((response: any) => {
      if (response) {
        const rental = response[0]
        openModal(
          <>
            {Object.keys(rental)
              .filter((k) => !['id', 'client_id', 'user_id'].includes(k))
              .map((key: string, index: number) => (
                <div key={index + key} className="text-lg flex gap-2 overflow-y-auto">
                  <div className="w-1/3 text-start text-nowrap">
                    {key[0].toUpperCase() + key.slice(1).replaceAll('_', ' ')}:
                  </div>
                  <div className="bg-gray-100 flex-1 p-2 rounded-lg">
                    {renderNestedObject(rental[key])}
                  </div>
                </div>
              ))}
          </>
        )
      }
    })
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Rentas" hasAddButton={true} addRoute="/rent/create">
          <SearchBar searchFunction={setRentList} data={rentals} />
          <Link
            to="/rentals/history"
            className="ms-4 flex items-center justify-center hover:bg-gray-500 px-4 w-auto rounded-xl h-full bg-gray-400 text-nowrap text-white font-medium active:scale-95 transition-all gap-1"
          >
            Rentas Pasadas
          </Link>
        </AppLayout.PageOptions>
        <Modal title="Renta" className="w-[500px]" />
        {rentList ? (
          <Table
            data={rentList}
            hiddenKeys={['id', 'client_id', 'user_id']}
            deleteFunction={deleteFunction}
            watchFunction={watchRental}
            customDeleteBtn={{ icon: <FiWatch />, title: 'Terminar Renta' }}
          />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}

interface NestedObject {
  [key: string]: string | NestedObject
}

function renderNestedObject(obj: any): ReactNode {
  if (obj === null || typeof obj !== 'object') return obj

  const _obj = obj as NestedObject

  return (
    <div className="grid auto-cols-fr overflow-hidden auto-rows-min gap-1">
      {Object.values(_obj).map((value, index) => {
        if (typeof value === 'object') {
          return <div key={index}>{renderNestedObject(value)}</div>
        } else {
          return (
            <span key={index} className="bg-gray-200 p-2 rounded-lg">
              {value}
            </span>
          )
        }
      })}
    </div>
  )
}
