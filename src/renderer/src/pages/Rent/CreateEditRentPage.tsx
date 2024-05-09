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

const useCustomForm = (
  schema: Yup.AnyObjectSchema,
  initialValues?: FieldValues | undefined
): FieldValues => {
  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema), defaultValues: initialValues })

  return {
    handleSubmit,
    control,
    register,
    errors,
    watch
  }
}

const rentalSchema = Yup.object().shape({
  client_id: Yup.number().required(''),
  end_date: Yup.date().required()
})

export const CreateEditRentPage = (): ReactElement => {
  const { handleSubmit, register, errors, control } = useCustomForm(rentalSchema)
  const { user } = useAuthStore()
  const { getAllClients } = useClients()
  const { createRental } = useRentals()
  const { getAvailableInventory } = useInventory()
  const [clients, setClients] = useState<object[]>()
  const [, setLocation] = useLocation()
  const [inv, setInv] = useState<{ value: string; label: string }[]>()
  const { id } = useParams()

  useEffect(() => {
    getAllClients().then((res) => setClients(res ? res : []))

    getAvailableInventory().then((res) => {
      setInv(
        res?.map((item: any) => {
          return { value: item.id, label: item.reference }
        })
      )
    })
  }, [])

  const onSubmit = (data: any): void => {
    if (!id) {
      if (data.equipments) {
        const equipments = data.equipments.map((equip: any) => {
          return equip.value
        })
        const values = {
          client_id: data.client_id,
          user_id: user?.id,
          end_date: data.end_date,
          equipments_id: equipments
        }
        createRental(values).then(() => setLocation('/rent'))
      }
    }
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle={id ? 'Modificar Renta' : 'Rentar'} hasAddButton={false} />
        {clients && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-y-auto overflow-x-hidden w-1/2 px-8 flex-1 grid auto-rows-max  mx-auto"
          >
            <div className="w-full p-4">
              <label className="block mb-2">Cliente:</label>
              <select
                name="client_id"
                className="border-2 p-2 w-full text-lg outline-none rounded-lg"
                {...register('client_id')}
              >
                {clients.map((client: any, index) => {
                  return (
                    <option
                      value={client.id}
                      key={client.id + index}
                    >{`${client['nombre(s)']} ${client['apellido(s)']}`}</option>
                  )
                })}
              </select>
              <p className="text-red-500 mt-2">{errors.client_id?.message}</p>
            </div>
            <div className="w-full p-4">
              <label className="block mb-2">Fecha Termino:</label>
              <input
                {...register('end_date')}
                type="date"
                className="border-2 p-1 text-lg w-full outline-none rounded-lg"
              />
              <p className="text-red-500 mt-2">{errors.end_date?.message}</p>
            </div>
            <Controller
              name="equipments"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    options={inv}
                    className="w-full p-4"
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
                </>
              )}
            />
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
