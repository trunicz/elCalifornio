import { AppLayout, SearchBar, Table, useModal } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useInventory } from '@renderer/hooks/useInventory'
import { ReactElement, useEffect, useState } from 'react'
import { LuMoreHorizontal } from 'react-icons/lu'

export const InventoryPage = (): ReactElement => {
  const [inventoryList, setInventoryList] = useState<unknown[] | null>(null)
  const { getAllInventory, inventory, getItem } = useInventory()
  const { Modal, openModal } = useModal()

  useEffect(() => {
    getAllInventory().then((res) => {
      console.log(res)
      setInventoryList(res)
    })
  }, [])

  const moreInfo = (id: string | number): void => {
    getItem(id).then((res) => {
      if (res) {
        const item = res[0]
        openModal(
          <>
            {Object.keys(item)
              .filter((k) => !['id'].includes(k))
              .map((key, index) => (
                <p key={key + index} className="flex gap-2 text-lg">
                  <span className="w-1/3 text-start">{key.toUpperCase()}:</span>
                  {item[key] ? (
                    <span className=" flex-1 bg-gray-100 p-1 px-4 text-start rounded-lg">
                      {item[key]}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <LuMoreHorizontal />
                    </span>
                  )}
                </p>
              ))}
          </>
        )
      }
    })
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Inventario">
          <SearchBar searchFunction={setInventoryList} data={inventory} />
        </AppLayout.PageOptions>
        <Modal title="Inventario" className="w-[500px]" />
        {inventoryList ? (
          <Table data={inventoryList} hiddenKeys={['id']} watchFunction={moreInfo} />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}
