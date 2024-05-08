import { AppLayout, Button, SearchBar, Table, useModal } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useInventory } from '@renderer/hooks/useInventory'
import { ReactElement, useEffect, useState } from 'react'
import { LuCheckCircle2, LuMoreHorizontal } from 'react-icons/lu'
import { useLocation } from 'wouter'

export const InventoryPage = (): ReactElement => {
  const [, setLocation] = useLocation()
  const [inventoryList, setInventoryList] = useState<unknown[] | null>(null)
  const { getAllInventory, inventory, getItem, deleteEquipment } = useInventory()
  const { Modal, openModal, closeModal } = useModal()

  useEffect(() => {
    getAllInventory().then((res) => {
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
              .filter((k) => !['id', 'tipo_id'].includes(k))
              .map((key, index) => (
                <p key={key + index} className="text-lg flex gap-4">
                  <span className="w-1/3 text-start text-nowrap">
                    {key[0].toUpperCase() + key.slice(1).toLowerCase()}:
                  </span>
                  {item[key] ? (
                    <span className="bg-gray-100 px-2 flex-1 text-start rounded-lg">
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

  const deleteFunction = (id: string | number): void => {
    setInventoryList(null)
    deleteEquipment(id).then(() => {
      getAllInventory().then((res) => {
        setInventoryList(res)
        openModal(
          <>
            <div>
              <span className="animate-fade-up text-6xl mb-4 flex justify-center text-green-500">
                <LuCheckCircle2 />
              </span>
              <h3>¡El Equipo y/o Herramienta se elimino con éxito!</h3>
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

  const editFunction = (id: string | number): void => {
    setLocation('/inventory/' + id)
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Inventario" addRoute="/inventory/add">
          <SearchBar searchFunction={setInventoryList} data={inventory} />
        </AppLayout.PageOptions>
        <Modal title="Inventario" className="max-w-[550px]" />
        {inventoryList ? (
          <Table
            data={inventoryList}
            deleteFunction={deleteFunction}
            hiddenKeys={['id']}
            watchFunction={moreInfo}
            editFunction={editFunction}
          />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}
