import { AppLayout, SearchBar, Table } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useInventory } from '@renderer/hooks/useInventory'
import { ReactElement, useEffect, useState } from 'react'

export const InventoryPage = (): ReactElement => {
  const [inventoryList, setInventoryList] = useState<unknown[] | null>(null)
  const { getAllInventory, inventory } = useInventory()

  useEffect(() => {
    getAllInventory().then((res) => {
      console.log(res)
      setInventoryList(res)
    })
  }, [])
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Inventario">
          <SearchBar searchFunction={setInventoryList} data={inventory} />
        </AppLayout.PageOptions>
        {inventoryList ? <Table data={inventoryList} /> : <Loading />}
      </AppLayout.Content>
    </AppLayout>
  )
}
