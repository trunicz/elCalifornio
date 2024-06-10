/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { AppLayout, Button } from '@renderer/components'
import { useInventory } from '@renderer/hooks/useInventory'
import { useLoadingStore } from '@renderer/stores/useLoading'
import { ReactElement, useEffect, useState } from 'react'
import { LuDollarSign, LuMinus, LuPlus } from 'react-icons/lu'
import Select from 'react-select'
import { useLocation } from 'wouter'

export const CreateEditInventoryPage = (): ReactElement => {
  const { getEquipmentTypes, getItemDimension, getPricesBy, createEquipment, createPrices } =
    useInventory()
  const [dimensions, setDimensions] = useState<{ value: string; label: string }[]>()
  const [options, setOptions] = useState<{ value: string; label: string }[]>()
  const [dimensionValue, setDimension] = useState<any>()
  const [description, setDescription] = useState<any>()
  const [selectedValue, setValue] = useState<any>()
  const [count, setCount] = useState<number | undefined>()
  const [prices, setPrices] = useState<any>()
  const [, setLocation] = useLocation()
  const [parent] = useAutoAnimate()
  const { setLoading } = useLoadingStore()

  useEffect(() => {
    setDimension(null)
    if (selectedValue) {
      getItemDimension(selectedValue.value).then((dimensions: any) => setDimensions(dimensions))
      getPricesBy(selectedValue.value).then((prices: any) => {
        setPrices(prices[0])
      })
    }
  }, [selectedValue])

  useEffect(() => {
    getEquipmentTypes().then((options: any) => {
      if (options) {
        setOptions(options)
      }
    })
  }, [])

  const onSubmit = (e: any): void => {
    e.preventDefault()
    setLoading(true)

    if (selectedValue) {
      const values = {
        type: selectedValue.value,
        dimension: dimensionValue ? dimensionValue.value : null,
        reference: description
      }
      createEquipment(values, count ? count : 0)
        .then((res) => {
          if (res && res.length > 0) {
            const promises = res.map((equipment: any) => {
              const { id } = equipment
              if (id) {
                delete prices.id
                const newValues = { ...prices, equipment_id: id, type_id: selectedValue.value }
                return createPrices(newValues)
              }
              return Promise.resolve(null)
            })

            Promise.all(promises)
              .then(() => {
                setLoading(false)
                setLocation('/inventory')
              })
              .catch((error) => {
                setLoading(false)
                console.error('Error creating prices:', error)
              })
          }
        })
        .catch((error) => {
          setLoading(false)
          console.error('Error creating equipment:', error)
        })
    }
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Agregar Equipo" hasAddButton={false} />
        <form
          ref={parent}
          onSubmit={(e) => onSubmit(e)}
          className="grid w-full mx-auto auto-rows-max mt-4 flex-1 overflow-y-auto gap-4"
        >
          <div className="w-1/2 mx-auto">
            <div ref={parent} className="col-span-full mb-4">
              <label className="text-lg">Tipo de Equipo</label>
              <Select
                placeholder={'Selecciona el equipo a registrar'}
                styles={{
                  control(base) {
                    return {
                      ...base,
                      borderRadius: '8px',
                      borderColor: '#e5e7eb',
                      borderWidth: '2px',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#e5e7eb'
                      }
                    }
                  }
                }}
                onChange={(e) => {
                  setValue(e)
                }}
                value={selectedValue}
                options={options}
              />
            </div>
            {dimensions && dimensions?.length > 0 ? (
              <div ref={parent} className="col-span-full">
                <label className="text-lg">Dimensiones</label>
                <Select
                  placeholder={'Selecciona la dimension del ' + selectedValue?.label}
                  styles={{
                    control(base) {
                      return {
                        ...base,
                        borderRadius: '8px',
                        borderColor: '#e5e7eb',
                        borderWidth: '2px',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#e5e7eb'
                        }
                      }
                    }
                  }}
                  onChange={(e) => {
                    setDimension(e)
                  }}
                  value={dimensionValue}
                  options={dimensions}
                />
              </div>
            ) : (
              selectedValue && (
                <div ref={parent} className="w-full grid">
                  <label className="text-lg">Descripción (Unica para cada equipo)</label>
                  <textarea
                    name="reference"
                    id="reference"
                    placeholder={'Escribe una descripción para ' + selectedValue.label}
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    rows={3}
                    className="outline-0 border-2 px-2 rounded-lg p-1 text-lg focus:bg-gray-100"
                  ></textarea>
                </div>
              )
            )}
            {selectedValue ? (
              <div ref={parent} className="mt-8">
                <p ref={parent} className="text-lg text-center col-span-full border-b">
                  Precios
                </p>
                <div ref={parent} className="flex gap-4 mt-4">
                  <div className="grid flex-1 relative">
                    <label className="text-lg">Por Semana</label>
                    <input
                      type="number"
                      className="ps-5 w-full focus:bg-gray-100 outline-0 border-2 px-2 rounded-lg p-1 text-lg"
                      value={prices?.price_week}
                      onChange={(e) => {
                        setPrices({ ...prices, price_week: e.target.value })
                      }}
                      min={0}
                    />
                    <LuDollarSign className="text-gray-400 absolute bottom-3 start-1" />
                  </div>
                  <div className="grid flex-1 relative">
                    <label className="text-lg">De 1 a 3 Dias</label>
                    <input
                      type="number"
                      className="ps-5 w-full focus:bg-gray-100 outline-0 border-2 px-2 rounded-lg p-1 text-lg"
                      value={prices?.price_days}
                      onChange={(e) => {
                        setPrices({ ...prices, price_days: e.target.value })
                      }}
                      min={0}
                    />
                    <LuDollarSign className="text-gray-400 absolute bottom-3 start-1" />
                  </div>
                </div>
                <p className="text-lg text-center col-span-full border-b mt-8">Cantidad</p>
                <div className="flex">
                  <div className="flex items-center py-6 gap-4 mx-auto">
                    <button
                      type="button"
                      onClick={() => setCount(count ? count - 1 : 0)}
                      className="transition-all bg-gray-200 p-4 rounded-lg  hover:bg-gray-300/70 active:bg-red-200 active:scale-90 "
                    >
                      <LuMinus />
                    </button>
                    <input
                      className="p-2 text-lg outline-none border-2 rounded-lg text-center"
                      type="number"
                      min={0}
                      onChange={(e) => setCount(parseFloat(e.target.value))}
                      value={count}
                      pattern="\d*"
                    />
                    <button
                      type="button"
                      onClick={() => setCount(count ? count + 1 : 1)}
                      className="transition-all bg-gray-200 p-4 rounded-lg  hover:bg-gray-300/70 active:bg-green-200 active:scale-90 "
                    >
                      <LuPlus />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <Button
            type="submit"
            className="fixed z-[5] end-4 bottom-4 bg-emerald-400 hover:bg-emerald-500  text-white w-auto ms-auto px-12 py-6 border-0"
            text="Continuar"
          />
        </form>
      </AppLayout.Content>
    </AppLayout>
  )
}
