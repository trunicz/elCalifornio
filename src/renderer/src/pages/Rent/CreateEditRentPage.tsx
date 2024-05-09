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
import { LuAlertCircle } from 'react-icons/lu'
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
  const { user } = useAuthStore()
  const { getAllClients, getClientById, getAllLocalClients } = useClients()
  const { createRental } = useRentals()
  const { getAvailableInventory } = useInventory()
  const [clients, setClients] = useState<{ value: string; label: string }[]>()
  const [localClients, setLocalClients] = useState<{ value: string; label: string }[]>()
  const [, setLocation] = useLocation()
  const [inv, setInv] = useState<{ value: string; label: string }[]>()
  const [showForeign, setShowForeign] = useState<boolean>(false)
  const [parent] = useAutoAnimate()
  const { id } = useParams()

  const client_id = watch('client_id')

  useEffect(() => {
    register('client_id')
    register('client_reference_id')
  }, [register])

  useEffect(() => {
    handleSelectChange(client_id)
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
      setInv(
        res?.map((item: any) => {
          return { value: item.id, label: item.reference }
        })
      )
    })
  }, [])

  const onSubmit = (data: any): void => {
    console.log(data)

    if (!id) {
      if (data.equipments) {
        const equipments = data.equipments.map((equip: any) => {
          return equip.value
        })
        const values = {
          client_id: data.client_id.value,
          user_id: user?.id,
          end_date: data.end_date,
          equipments_id: equipments
        }
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
          reset({ client_reference_id: null })
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
            className="overflow-y-auto overflow-x-hidden w-1/2 px-8 flex-1 grid auto-rows-max  mx-auto"
          >
            <div ref={parent}>
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
                    <LuAlertCircle />
                    Como el usuario es foráneo se necesita una cliente local de referencia:
                  </small>
                  <small className="m-4 flex gap-2 items-center p-2 mb-0 bg-amber-600 w-fu text-white rounded-lg">
                    <LuAlertCircle />
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
                          options={localClients}
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
                </>
              )}
              <div ref={parent} className="w-full p-4">
                <label className="block mb-2">Fecha Termino:</label>
                <input
                  {...register('end_date')}
                  type="date"
                  className="border p-1.5  w-full outline-none rounded-lg"
                />
                {errors.end_date ? (
                  <p className="text-red-500 mt-2">
                    {errors.end_date ? 'Ingresa una fecha valida' : ''}
                  </p>
                ) : null}
              </div>
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
                    />
                    <p className="text-red-500 mt-2">{errors.equipments?.message}</p>
                  </div>
                )}
              />
            </div>
            <Button
              type="submit"
              className="fixed z-10 end-4 bottom-4 bg-emerald-400 hover:bg-emerald-500  text-white w-auto ms-auto px-12 py-6 border-0"
              text="Continuar"
            />
          </form>
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}
