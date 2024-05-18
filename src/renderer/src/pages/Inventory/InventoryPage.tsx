/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppLayout, Button, SearchBar, Table, useModal } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useInventory } from '@renderer/hooks/useInventory'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { IoWarning } from 'react-icons/io5'
import { LuCheckCircle2, LuSettings2 } from 'react-icons/lu'
import { useLocation } from 'wouter'

export const InventoryPage = (): ReactElement => {
  const [, setLocation] = useLocation()
  const [inventoryList, setInventoryList] = useState<unknown[] | null>(null)
  const [inventoryListView, setInventoryListView] = useState<object[] | null>(null)
  const { getAllInventory, inventory, deleteEquipment, getAllInventoryView, getItem } =
    useInventory()
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
    if (typeof id === 'number') {
      getItem(id).then((response: any) => {
        const item = response[0]
        console.log(item)
        openModal(
          <>
            <div key={item.id} className="bg-gray-100 rounded-xl text-lg p-4">
              {Object.entries(item)
                .filter(([key]: [string, any]) => !['id'].includes(key))
                .map(([key, value]: [string, any], index) => (
                  <div key={index} className="flex py-1">
                    <div className="w-1/3 text-start">{key[0].toUpperCase() + key.slice(1)}:</div>
                    <div>{renderNestedObject(value)}</div>
                  </div>
                ))}
              <div className="flex gap-2 mt-4">
                {/* <Button
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  color="warning"
                  text="Editar"
                  onClick={() => editFunction(item.id)}
                /> */}
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  color="danger"
                  text="Eliminar"
                  onClick={() => deleteFunction(item.id)}
                />
              </div>
            </div>
          </>
        )
      })
    }
    if (inventoryListView && typeof id === 'object') {
      const filteredInv = inventoryListView.filter((inv: any) => id.includes(inv.id))

      openModal(
        <div className="overflow-y-auto overflow-x-hidden flex flex-col gap-2">
          {filteredInv.map((item: any) => (
            <div key={item.id} className="bg-gray-100 rounded-xl text-lg p-4 overflow-ellipsis">
              {Object.entries(item)
                .filter(([key]: [string, any]) => !['id'].includes(key))
                .map(([key, value]: [string, any], index) => (
                  <div key={index} className="flex gap-2 py-1">
                    <div className="w-1/3 text-start text-wrap">
                      {key[0].toUpperCase() + key.slice(1)}:
                    </div>
                    <div className="flex justify-start flex-1">
                      {renderNestedObject(value.slice(0, 30))}
                    </div>
                  </div>
                ))}
              <div className="flex gap-2 mt-4">
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  color="danger"
                  text="Eliminar"
                  onClick={() => {
                    deleteFunction(item.id)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )
    }
  }

  const remove = (id: any): void => {
    setInventoryList(null)
    deleteEquipment(id).then(() => {
      getAllInventoryView().then((res) => {
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

  const deleteFunction = (id: string | number): void => {
    openModal(
      <>
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 animate-jump flex justify-center items-center text-9xl text-amber-500">
            <IoWarning />
          </div>
          <div className="">
            <p>Al realizar esta acción no se podrá deshacer</p>
            <p>¿Quiere continuar?</p>
          </div>
          <div className="flex gap-2">
            <Button
              className="animate-fade animate-ease-out animate-duration-200"
              color="danger"
              text="cancelar"
              onClick={() => closeModal()}
            />
            <Button
              className="animate-fade animate-ease-out animate-duration-200"
              color="success"
              text="aceptar"
              onClick={() => closeModal().then(() => remove(id))}
            />
          </div>
        </div>
      </>
    )
  }

  const editFunction = (id: any): void => {
    setLocation(`/inventory/${id}`)
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
            hiddenKeys={['id', 'referencias']}
            watchFunction={moreInfo}
            editFunction={editFunction}
            customMoreBtn={{ icon: <LuSettings2 />, title: 'Ver' }}
            canSeeEdit={false}
            canSeeDelete={false}
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
    <div className="">
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
