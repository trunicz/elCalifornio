/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppLayout, Table } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useRentals } from '@renderer/hooks/useRentals'
import { ReactElement, useEffect, useState } from 'react'

export const RentHistory = (): ReactElement => {
  const { getRentalHistory } = useRentals()
  const [listRentals, setListRentals] = useState<any[] | null>()

  useEffect(() => {
    getRentalHistory().then((res) => setListRentals(res))
  }, [])

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions
          pageTitle="Historial de Rentas"
          hasAddButton={false}
        ></AppLayout.PageOptions>
        {listRentals ? (
          <Table
            hiddenKeys={['id', 'client_id', 'user_id']}
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
