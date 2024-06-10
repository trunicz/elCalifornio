/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppLayout, SearchBar, Table } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useRentals } from '@renderer/hooks/useRentals'
import { ReactElement, useEffect, useState } from 'react'
import { LuReply } from 'react-icons/lu'
import { Link } from 'wouter'

export const RentHistory = (): ReactElement => {
  const { getRentalHistory, rentals } = useRentals()
  const [listRentals, setListRentals] = useState<any[] | null>()

  useEffect(() => {
    getRentalHistory().then((res) => setListRentals(res))
  }, [])

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Historial de Rentas" hasAddButton={false}>
          <SearchBar searchFunction={setListRentals} data={rentals} />
          <Link
            to="/rent"
            className="ms-4 flex items-center justify-center hover:bg-blue-500 px-4 w-auto rounded-xl h-full bg-blue-400 text-nowrap text-white font-medium active:scale-95 transition-all gap-1"
          >
            <span className="text-xl">
              <LuReply />
            </span>
            Rentas
          </Link>
        </AppLayout.PageOptions>
        {listRentals ? (
          <Table
            hiddenKeys={[
              'id',
              'cliente_tel',
              'formdata',
              'dirección',
              'deleted_at',
              'anticipo',
              'iscompleted'
            ]}
            data={listRentals}
            hasOptions={false}
          />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}
