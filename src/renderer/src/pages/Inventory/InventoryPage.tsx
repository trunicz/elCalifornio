/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppLayout, Button, SearchBar, Table, useModal } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useInventory } from '@renderer/hooks/useInventory'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { LuCheckCircle2 } from 'react-icons/lu'

export const InventoryPage = (): ReactElement => {
  const [inventoryList, setInventoryList] = useState<unknown[] | null>(null)
  const [inventoryListView, setInventoryListView] = useState<object[] | null>(null)
  const { getAllInventory, inventory, deleteEquipment, getAllInventoryView } = useInventory()
  const { Modal, openModal, closeModal } = useModal()

  useEffect(() => {
    getAllInventory().then((res) => {
      setInventoryListView(res)
    })
    getAllInventoryView().then((res) => {
      setInventoryList(res)
    })
  }, [])

  const moreInfo = (id: any): void => {
    if (inventoryListView) {
      console.log(inventoryListView)

      const filteredInv = inventoryListView.filter((inv: any) => id.includes(inv.id))
      openModal(
        <div className="overflow-y-auto grid gap-2">
          {filteredInv.map((item: any) => (
            <div key={item.id} className="bg-gray-100 rounded-xl text-lg p-4">
              {Object.entries(item)
                .filter(([key]: [string, any]) => !['id'].includes(key))
                .map(([key, value]: [string, any], index) => (
                  <div key={index} className="flex py-1">
                    <div className="w-1/3 text-start">{key[0].toUpperCase() + key.slice(1)}:</div>
                    <div>{renderNestedObject(value)}</div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )
    }
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

  const editFunction = (id: any): void => {
    if (inventoryListView) {
      console.log(inventoryListView)

      const filteredInv = inventoryListView.filter((inv: any) => id.includes(inv.id))
      openModal(
        <div className="overflow-y-auto grid gap-2">
          {filteredInv.map((item: any) => (
            <div key={item.id} className="bg-gray-100 rounded-xl text-lg p-4">
              {Object.entries(item)
                .filter(([key]: [string, any]) => !['id'].includes(key))
                .map(([key, value]: [string, any], index) => (
                  <div key={index} className="flex py-1">
                    <div className="w-1/3 text-start">{key[0].toUpperCase() + key.slice(1)}:</div>
                    <div>{renderNestedObject(value)}</div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )
    }
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Inventario" addRoute="/inventory/add">
          <SearchBar searchFunction={setInventoryList} data={inventory} />
        </AppLayout.PageOptions>
        <Modal title="Inventario" className="max-w-[550px] max-h-[600px] overflow-y-auto" />
        {inventoryList ? (
          <Table
            data={inventoryList}
            deleteFunction={deleteFunction}
            hiddenKeys={['id', 'referencia']}
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
