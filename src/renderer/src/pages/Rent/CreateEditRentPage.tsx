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
import { LuAlertCircle, LuDollarSign } from 'react-icons/lu'
import { useAutoAnimate } from '@formkit/auto-animate/react'

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
  const [inv, setInv] = useState<{ value: string; label: string }[]>()
  const [showForeign, setShowForeign] = useState<boolean>(false)
  const [advicePayment, setAdvicePayment] = useState<number | null>(null)
  const { getAvailableInventory, getPricesByItemId } = useInventory()
  const { createRental } = useRentals()
  const [, setLocation] = useLocation()
  const [parent] = useAutoAnimate()
  const { user } = useAuthStore()
  const { id } = useParams()

  const [currentCost, setCurrentCost] = useState(0)

  const client_id = watch('client_id')

  const onChangeEndDate = (e: any): void => {
    setEndDate(e)
    setEquipmentVisible(true)
  }

  const onchangeEquipments = (e: any[]): void => {
    setInventory(e)
  }

  useEffect(() => {
    const fetchPrices = async (): Promise<void> => {
      try {
        const tempPricesPromises =
          inventory?.map(async (val: any) => {
            try {
              const res: any = await getPricesByItemId(val.value)
              if (res[0]) {
                return endDate?.label === '1 a 3 Dias' ? res[0].price_days : res[0].price_week
              }
              return 0
            } catch (err) {
              console.log(err)
              return 0
            }
          }) || []

        const tempPrices = await Promise.all(tempPricesPromises)

        if (tempPrices?.length) {
          const totalCost = tempPrices.reduce((acc, cv) => {
            return acc + cv
          }, 0) // Asegúrate de tener un valor inicial para el reduce
          console.log(totalCost)

          setCurrentCost(totalCost)
        } else {
          setCurrentCost(0)
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchPrices()
  }, [inventory, endDate])

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

    getAvailableInventory().then((res) => {
      const filteredInventory = (res || []).map((item: any) => {
        const label = `${item.type.type_name}: ${item.reference ? item.reference : item.dimension.dimension_name}`
        return {
          value: item.id, // Usa un ID único aquí
          label
        }
      })
      setInv(filteredInventory)
    })
  }, [])

  const onSubmit = (data: any): void => {
    console.log(data)
    if (!id) {
      if (inventory) {
        const equipments = inventory.map((equip: any) => {
          return equip.value
        })
        const values = {
          client_id: data.client_id.value,
          advance_payment: advicePayment,
          building_address: data.building_address,
          user_id: user?.id,
          end_date: endDate?.value,
          equipments_id: equipments,
          total_cost: currentCost,
          status: 'ACTIVO'
        }
        console.log(values)

        const clientReferenceId = !showForeign ? null : data.client_reference_id?.value || null

        createRental({ ...values, client_reference_id: clientReferenceId }).then(() =>
          setLocation('/rent')
        )
      }
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

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle={id ? 'Modificar Renta' : 'Rentar'} hasAddButton={false} />
        {clients && (
          <form
            ref={parent}
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-y-auto overflow-x-hidden w-full px-8 flex-1 grid auto-rows-max  mx-auto"
          >
            <div ref={parent} className="w-1/2 mx-auto">
              <Controller
                name="client_id"
                control={control}
                render={({ field }) => (
                  <div className="w-full p-4">
                    <label className="block mb-2">Seleccionar Cliente:</label>
                    <Select
                      {...field}
                      options={clients}
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
                      onClick={() => setLocation('/clients/create')}
                      text="Crear Cliente"
                    />
                  </div>
                </>
              )}
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <div className="w-full p-4">
                    <label className="block mb-2">Tiempo de renta:</label>
                    <Select
                      {...field}
                      placeholder="Tiempo de renta"
                      options={[
                        { value: getTimestampForThreeDays(), label: '1 a 3 Dias' },
                        { value: getTimestampForOneWeek(), label: '1 Semana' }
                      ]}
                      onChange={(e) => onChangeEndDate(e)}
                      value={endDate}
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
              {isEquipmentVisible && (
                <>
                  <Controller
                    name="equipments"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <div className="w-full p-4">
                        <label className="block mb-2">Equipos y/o Herramientas:</label>
                        <Select
                          {...field}
                          options={inv}
                          onChange={(e: any) => onchangeEquipments(e)}
                          value={inventory}
                          isMulti
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
                          getOptionValue={(option) => option.value} // Esta línea asegura que cada key sea única
                        />
                        <p className="text-red-500 mt-2">{errors.equipments?.message}</p>
                      </div>
                    )}
                  />
                  <div className="w-full p-4 relative">
                    <label className="">Anticipo</label>
                    <input
                      {...register('advance_payment')}
                      type="number"
                      onChange={(e) => onChangeAdvicePayment(e)}
                      value={advicePayment ?? ''}
                      className="ps-7 w-full focus:bg-gray-100 outline-0 border-2 rounded-lg p-1.5"
                      min={0}
                    />
                    <LuDollarSign className="text-gray-400 absolute bottom-7 start-6 text-lg" />
                  </div>
                  {typeof advicePayment === 'number' && currentCost < advicePayment && (
                    <p className="px-4 text-red-400 text-sm -mt-2">
                      El anticipo es mayor al costo, verifica que no sea un error.
                    </p>
                  )}
                  <div className="w-full p-4">
                    <label className="block mb-2">Dirección de la obra:</label>
                    <input
                      {...register('building_address')}
                      type="text"
                      placeholder="Calle Ficticia #123, Colonia Falsa, 12345 Ciudad, Estado."
                      className="border p-1.5  w-full outline-none rounded-lg"
                    />
                    {errors.end_date ? (
                      <p className="text-red-500 mt-2">
                        {errors.building_address ? 'Ingresa una fecha valida' : ''}
                      </p>
                    ) : null}
                  </div>
                </>
              )}
            </div>
            <div className="fixed z-10 end-4 bottom-4">
              <p ref={parent} className="text-3xl flex flex-col pb-2">
                <span className="text-lg">Total:</span>${printPrices(currentCost, advicePayment)}
              </p>
              <Button
                type="submit"
                className=" bg-emerald-400 hover:bg-emerald-500  text-white w-auto ms-auto px-12 py-6 border-0"
                text="Continuar"
              />
            </div>
          </form>
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
