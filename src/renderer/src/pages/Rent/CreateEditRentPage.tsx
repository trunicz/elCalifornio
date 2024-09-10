/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup'
import { AppLayout, Button } from '@renderer/components'
import { useClients } from '@renderer/hooks'
import { ReactElement, useEffect, useState } from 'react'
import Select from 'react-select'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { useLocation, useParams } from 'wouter'
import * as Yup from 'yup'
import { useInventory } from '@renderer/hooks/useInventory'
import { useRentals } from '@renderer/hooks/useRentals'
import { useAuthStore } from '@renderer/stores/useAuth'
import { LuAlertCircle, LuDelete, LuDollarSign, LuMinus, LuPlus } from 'react-icons/lu'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Loading } from '@renderer/components/Loading'
import { useLoadingStore } from '@renderer/stores/useLoading'

const useCustomForm = (
  schema: Yup.AnyObjectSchema,
  initialValues?: FieldValues | undefined
): FieldValues => {
  const {
    handleSubmit,
    control,
    register,
    watch,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema), defaultValues: initialValues })

  return {
    handleSubmit,
    control,
    register,
    errors,
    watch,
    reset
  }
}

const rentalSchema = Yup.object().shape({
  end_date: Yup.date()
})

export const CreateEditRentPage = (): ReactElement => {
  const { handleSubmit, register, errors, control, watch, reset } = useCustomForm(rentalSchema)
  const [localClients, setLocalClients] = useState<{ value: string; label: string }[] | null>()
  const [inventory, setInventory] = useState<{ value: string; label: string }[]>()
  const [clients, setClients] = useState<{ value: string; label: string }[]>()
  const [endDate, setEndDate] = useState<{ value: string; label: string }>()
  const [isEquipmentVisible, setEquipmentVisible] = useState<boolean>(false)
  const { getAllClients, getClientById, getAllLocalClients } = useClients()
  const [inv, setInv] = useState<{ value: string; label: string }[]>([])
  const [showForeign, setShowForeign] = useState<boolean>(false)
  const [canShowForm, setCanShowForm] = useState<boolean>(false)
  const [advicePayment, setAdvicePayment] = useState<number | null>(null)
  const [selectClientID, setSelectClientID] = useState<{
    value: string | number
    label: string
  } | null>(null)
  const [equipments, setEquipments] = useState<any[]>([])
  const { getAvailableInventory } = useInventory()
  const [endDateValue, setEndDateValue] = useState<string>()
  const { createRental, getRentalForEdit, updateRental } = useRentals()
  const [currentCost, setCurrentCost] = useState(0)
  const [, setLocation] = useLocation()
  const [parent] = useAutoAnimate()
  const { user } = useAuthStore()
  const { id } = useParams()
  const [buildAddress, setBuildAddress] = useState<any>()
  const [reference, setReference] = useState<any>()
  const [quantities, setQuantities] = useState({})
  const { setLoading } = useLoadingStore()

  const client_id = watch('client_id')

  const updateSelectClientId = (e: any): void => {
    handleSelectChange(e)
    setSelectClientID(e)
  }

  const onChangeEndDate = (e: any): void => {
    setEndDate(e)
    setEquipmentVisible(true)
  }

  const onchangeEquipments = (e: any[]): void => {
    setInventory(e)
  }

  useEffect(() => {
    setLoading(true)
    const setCost = (): void => {
      if (inventory && quantities && endDate) {
        const totalCost = inventory.reduce((acc, data) => {
          const [typeId, dimensionId, reference] = data.value.split('-')
          const matchingPrice: any = equipments.find(
            (d: any) => d.type_id === Number(typeId) && d.dimension_id === Number(dimensionId)
          )

          if (matchingPrice) {
            const currentPrices =
              endDate.label === '1 a 3 Dias' ? matchingPrice.price_days : matchingPrice.price_week
            const priceForItem = currentPrices * quantities[`${typeId}-${dimensionId}-${reference}`]
            return acc + priceForItem
          } else {
            return acc
          }
        }, 0)

        setCurrentCost(totalCost)
      } else {
        setCurrentCost(0)
      }

      setLoading(false)
    }

    setCost()
  }, [inventory, endDate, quantities])

  const onChangeAdvicePayment = (e: any): void => {
    const value = parseFloat(e.target.value)
    setAdvicePayment(!isNaN(value) ? value : null)
  }

  useEffect(() => {
    register('client_id')
    register('client_reference_id')
  }, [register])

  useEffect(() => {
    if (client_id !== undefined) {
      console.log(client_id)

      handleSelectChange(client_id)
    }
  }, [client_id])

  useEffect(() => {
    getAllClients().then((res) => {
      setClients(
        res?.map((item: any) => {
          return { value: item.id, label: `${item['nombre(s)']} ${item['apellido(s)']}` }
        })
      )
    })

    getAllLocalClients().then((res) => {
      setLocalClients(
        res?.map((item: any) => {
          return { value: item.id, label: `${item['nombre(s)']} ${item['apellido(s)']}` }
        })
      )
    })
  }, [])

  useEffect(() => {
    setCanShowForm(false)
    const fetchData = async (): Promise<void> => {
      try {
        const inventoryData: any = await getAvailableInventory()
        if (inventoryData) {
          setEquipments(inventoryData.equipments)
          const equipmentsMapped = inventoryData.equipments.map((e: any) => {
            // CAMBIOS: No mostrar si es null.
            const name = e.type_name
            const dimension = e.dimension_name ? e.dimension_name : e.reference

            return {
              value: `${e.type_id}-${e.dimension_id}-${e.reference}`,
              label: `${name} - ${dimension == null ? '' : dimension + ' '}(${e.count})`
            }
          })
          setInv(equipmentsMapped)
        }
        if (id && clients) {
          const rent: any = await getRentalForEdit(id)
          console.log(rent)
          if (rent) {
            const client = clients.find((c) => c.value === rent.client_id) ?? {}
            setBuildAddress(rent.buildAddress)
            updateSelectClientId(client)
            setEndDateValue(formatDate(new Date(rent.end_date)))
            setBuildAddress(rent.building_address)
            setReference(rent.reference)

            rent.equipments.map((e: any) => {
              handleQuantityChange(
                `${e.type_id}-${e.dimension_id}-${e.reference}`,
                e.count,
                e.count
              )

              const name = e.type_name
              const dimension = e.dimension_name ? e.dimension_name : e.reference

              const option = {
                value: `${e.type_id}-${e.dimension_id}-${e.reference}`,
                label: `Rentado: ${name} - ${dimension == null ? '' : dimension + ' '}(${e.count})`
              }
              if (inventory) {
                setInventory([...inventory, option])
              } else {
                setInventory([option])
              }
            })
          }
        }
        setLoading(false)
        setCanShowForm(true)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, clients])

  useEffect(() => {
    const updatedQuantities = {}
    inventory?.forEach((i) => {
      if (quantities[i.value]) {
        updatedQuantities[i.value] = quantities[i.value]
      }
    })
    setQuantities(updatedQuantities)
  }, [inventory])

  const getEquipmentsIdByInventory = async (): Promise<any[]> => {
    const equipments_id = await Promise.all(
      Object.keys(quantities).map(async (q: string) => {
        const [typeId] = q.split('-')
        const { equipment_id } = equipments.find((e: any) => e.type_id === Number(typeId))

        return equipment_id.slice(0, quantities[q])
      })
    )
    return equipments_id.flat()
  }

  const onSubmit = async (data: any): Promise<void> => {
    const equipment = await getEquipmentsIdByInventory()

    if (!id) {
      const values = {
        client_id: selectClientID?.value,
        advance_payment: advicePayment ? advicePayment : 0,
        paid: advicePayment ? advicePayment : 0,
        building_address: buildAddress,
        reference,
        user_id: user?.id,
        end_date: endDate?.value,
        equipments_id: equipment,
        total_cost: currentCost,
        status: 'ACTIVO'
      }

      const clientReferenceId = !showForeign ? null : data.client_reference_id?.value || null

      createRental({ ...values, client_reference_id: clientReferenceId }).then(() =>
        setLocation('/rent')
      )
    } else {
      const values = {
        client_id: selectClientID?.value,
        advance_payment: advicePayment ? advicePayment : 0,
        paid: advicePayment ? advicePayment : 0,
        building_address: buildAddress,
        user_id: user?.id,
        reference,
        end_date: endDateValue ? new Date(endDateValue).toISOString() : new Date(),
        equipments_id: equipment,
        total_cost: currentCost,
        status: 'ACTIVO'
      }

      console.log(values)

      updateRental(`${id}`, values).then(() => {
        setLocation('/rent')
      })
    }
  }

  const handleSelectChange = (option: { value: string; label: string }): void => {
    if (option) {
      const client_id = option.value
      getClientById(client_id).then((res: any) => {
        setShowForeign(res[0].isForeign)
        if (!res[0].isForeign) {
          reset({ client_reference_id: null }, { keepDirtyValues: true })
        }
      })
    }
  }

  const handleQuantityChange = (id: any, value: any, max: number): void => {
    setQuantities({
      ...quantities,
      [id]: value > max ? max : value
    })
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle={id ? 'Modificar Renta' : 'Rentar'} hasAddButton={false} />
        {canShowForm && clients ? (
          <form
            ref={parent}
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-y-auto overflow-x-hidden w-full px-8 flex-1 grid auto-rows-max  mx-auto"
          >
            <div ref={parent} className="w-1/2 mx-auto">
              <Controller
                name="client_id"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className="w-full p-4">
                    <label className="block mb-2">Seleccionar Cliente:</label>
                    <Select
                      options={clients}
                      isSearchable
                      onChange={(e) => {
                        updateSelectClientId(e)
                        onChange(e)
                      }}
                      value={value || selectClientID}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderColor: '#E5E7EB',
                          borderRadius: '0.375rem',
                          boxShadow: 'none',
                          '&:hover': {
                            borderColor: '#D1D5DB'
                          }
                        })
                      }}
                    />
                    <p className="text-red-500 mt-2">{errors.equipments?.message}</p>
                  </div>
                )}
              />
              {showForeign && (
                <>
                  <small className="m-4 flex gap-2 items-center p-2 mb-0 bg-blue-500 w-fu text-white rounded-lg">
                    <LuAlertCircle className="text-2xl" />
                    Como el usuario es foráneo se necesita una cliente local de referencia:
                  </small>
                  <small className="m-4 flex gap-2 items-center p-2 mb-0 bg-amber-600 w-fu text-white rounded-lg">
                    <LuAlertCircle className="text-2xl" />
                    Si aun no tiene cuenta el cliente de referencia, agrégalo y luego haz este
                    proceso:
                  </small>
                  <Controller
                    name="client_reference_id"
                    control={control}
                    render={({ field }) => (
                      <div className="w-full p-4">
                        <label className="block mb-2">Referencia:</label>
                        <Select
                          {...field}
                          options={localClients ?? []}
                          isSearchable
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              borderColor: '#E5E7EB',
                              borderRadius: '0.375rem',
                              boxShadow: 'none',
                              '&:hover': {
                                borderColor: '#D1D5DB'
                              }
                            })
                          }}
                        />
                        <p className="text-red-500 mt-2">{errors.equipments?.message}</p>
                      </div>
                    )}
                  />
                  <div className="p-4 pt-0">
                    <Button
                      className="w-full bg-gray-200 border-gray-200 hover:bg-gray-300 transition-all hover:text-gray-500"
                      onClick={() => setLocation('/clients/create/' + true)}
                      text="Crear Cliente"
                    />
                  </div>
                </>
              )}
              {!id ? (
                <div className="w-full p-4">
                  <label className="block mb-2">Tiempo de renta:</label>
                  <Select
                    placeholder="Tiempo de renta"
                    options={[
                      { value: getTimestampForThreeDays(), label: '1 a 3 Dias' },
                      { value: getTimestampForOneWeek(), label: '1 Semana' }
                    ]}
                    onChange={(e) => onChangeEndDate(e)}
                    value={endDate ?? null}
                    isSearchable
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        borderColor: '#E5E7EB',
                        borderRadius: '0.375rem',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#D1D5DB'
                        }
                      })
                    }}
                  />
                  <p className="text-red-500 mt-2">{errors.equipments?.message}</p>
                </div>
              ) : (
                <div className="w-full p-4 relative">
                  <div>Agrega mas tiempo a la renta</div>
                  <input
                    className="px-2 w-full focus:bg-gray-100 mt-2 outline-0 border rounded-lg p-1.5"
                    type="date"
                    onChange={(event) => {
                      const dateValue = event.target.value
                      setEndDateValue(dateValue ? dateValue : undefined)
                    }}
                    value={endDateValue}
                    min={formatDate(new Date())}
                  />
                </div>
              )}
              {isEquipmentVisible || id ? (
                <>
                  <div className="w-full p-4">
                    <label className="block mb-2">Equipos y/o Herramientas:</label>
                    <Select
                      options={inv}
                      onChange={(e: any) => onchangeEquipments(e)}
                      value={inventory}
                      isMulti
                      // isClearable={inventory?.some((v) => !v.isFixed)}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderColor: '#E5E7EB',
                          borderRadius: '0.375rem',
                          boxShadow: 'none',
                          '&:hover': {
                            borderColor: '#D1D5DB'
                          }
                        })
                      }}
                      getOptionValue={(option) => option.value}
                    />
                    <p className="text-red-500 mt-2">{errors.equipments?.message}</p>
                  </div>
                  <div ref={parent} className="px-5 pb-10">
                    {inventory
                      ? inventory.map((inv, index) => {
                          quantities[inv.value] = quantities[inv.value] ?? 1
                          return (
                            <div key={`${inv.value}${index}`}>
                              <div className="w-full flex items-center mt-2 gap-4 bg-gray-50 p-2 rounded-lg">
                                <div className="text-nowrap  font-semibold">
                                  {inv.label?.replace(/\(\d\)/g, '')}
                                </div>
                                <div className="hidden 2xl:block text-nowrap p-2 text-xs bg-blue-400 text-white rounded-full">
                                  {inv.label?.match(/\((\d+)\)/)?.[1]} en existencia
                                </div>
                                <div className="flex items-center min-w-28 ms-auto gap-2">
                                  {quantities[inv.value] > 1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleQuantityChange(
                                          inv.value,
                                          1,
                                          Number(inv.label?.match(/\((\d+)\)/)?.[1])
                                        )
                                      }
                                      className="transition-all bg-gray-200 p-3 rounded-lg  hover:bg-gray-300/70 active:bg-red-200 active:scale-90 "
                                    >
                                      <LuDelete />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleQuantityChange(
                                        inv.value,
                                        quantities[inv.value] > 1 ? quantities[inv.value] - 1 : 1,
                                        Number(inv.label?.match(/\((\d+)\)/)?.[1])
                                      )
                                    }
                                    className="transition-all bg-gray-200 p-3 rounded-lg  hover:bg-gray-300/70 active:bg-red-200 active:scale-90 "
                                  >
                                    <LuMinus />
                                  </button>
                                  <input
                                    className="px-2 w-full text-center focus:bg-gray-100 outline-0 border rounded-lg p-1.5"
                                    type="text"
                                    value={quantities[inv.value]}
                                    onChange={(event) => {
                                      handleQuantityChange(
                                        inv.value,
                                        event.target.value ?? 1,
                                        Number(inv.label?.match(/\((\d+)\)/)?.[1])
                                      )
                                    }}
                                    disabled
                                    min={1}
                                    max={Number(inv.label?.match(/\((\d+)\)/)?.[1])}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleQuantityChange(
                                        inv.value,
                                        quantities[inv.value] <
                                          Number(inv.label.match(/\((\d+)\)/)?.[1])
                                          ? quantities[inv.value] + 1
                                          : 1,
                                        Number(inv.label.match(/\((\d+)\)/)?.[1])
                                      )
                                    }
                                    className="transition-all bg-gray-200 p-3 rounded-lg  hover:bg-gray-300/70 active:bg-green-200 active:scale-90 "
                                  >
                                    <LuPlus />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      : null}
                  </div>
                  {!id && (
                    <>
                      <div className="w-full p-4 relative hidden">
                        <label className="">Anticipo</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-full rounded-lg border-2 border-gray-200 py-2 px-4"
                          value={advicePayment || ''}
                          onChange={onChangeAdvicePayment}
                        />
                        <LuDollarSign className="text-gray-400 absolute bottom-7 start-6 text-lg hidden" />
                      </div>
                      {/* <div className="w-full px-4 relative flex  gap-2">
                        <label htmlFor="adelantado" className="w-full text-gray-400">
                          Pago Adelantado
                        </label>
                        <input
                          type="checkbox"
                          id="adelantado"
                          className="h-5 w-5 ring-offset-2"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAdvicePayment(currentCost ? currentCost : 0)
                            } else {
                              setAdvicePayment(0)
                            }
                          }}
                        />
                      </div> */}
                    </>
                  )}
                  {typeof advicePayment === 'number' && currentCost < advicePayment && (
                    <p className="px-4 text-red-400 text-sm -mt-2 pt-3">
                      El anticipo es mayor al costo, verifica que no sea un error.
                    </p>
                  )}
                  <div className="w-full p-4">
                    <label className="block mb-2">Dirección de la obra:</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border-2 border-gray-200 py-2 px-4"
                      value={buildAddress}
                      onChange={(e) => setBuildAddress(e.target.value)}
                    />
                    {errors.end_date ? (
                      <p className="text-red-500 mt-2">
                        {errors.building_address ? 'Ingresa una fecha valida' : ''}
                      </p>
                    ) : null}
                  </div>
                  <div className="w-full p-4">
                    <label className="block mb-2">Referencia:</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border-2 border-gray-200 py-2 px-4"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
            <div className="fixed z-10 end-4 bottom-4">
              <div ref={parent} className="text-3xl flex flex-col pb-2">
                <p className="text-lg">Total:</p>
                {/* {advicePayment ? (
                  <>
                    <p className="text-xl">{`+$${currentCost.toFixed(2)}`}</p>
                    <p className="text-xl">{`-$${Number(advicePayment).toFixed(2)}`}</p>
                  </>
                ) : null} */}
                <p>${printPrices(currentCost, advicePayment)}</p>
              </div>
              <Button
                type="submit"
                className=" bg-emerald-400 hover:bg-emerald-500  text-white w-auto ms-auto px-12 py-6 border-0"
                text="Continuar"
              />
            </div>
          </form>
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}

function getTimestampForThreeDays(): string {
  const currentDate = new Date()
  const endDate = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000)
  return endDate.toISOString()
}

function getTimestampForOneWeek(): string {
  const currentDate = new Date()
  const endDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
  return endDate.toISOString()
}

function printPrices(currentCost: any, advicePayment: any): string {
  if (advicePayment && currentCost > advicePayment) {
    return `${(currentCost - Math.abs(advicePayment)).toFixed(2)}`
  } else if (!advicePayment && currentCost) {
    return `${currentCost.toFixed(2)}`
  } else {
    return `0`
  }
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
