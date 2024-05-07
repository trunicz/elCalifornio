import { AppLayout, FormField, submitObject } from '@renderer/components'
import { ReactElement, useEffect, useState } from 'react'
import { Form } from '@renderer/components'
import { FieldValues, SubmitHandler } from 'react-hook-form'
import * as Yup from 'yup'
import { useLocation, useParams } from 'wouter'
import { useClients } from '@renderer/hooks'
import { Loading } from '@renderer/components/Loading'

const clientSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es Obligatorio'),
  last_name: Yup.string().required('El Apellido es Obligatorio'),
  email: Yup.string().required('El correo es Obligatorio'),
  phone: Yup.number()
    .required('El Teléfono es Obligatorio')
    .min(999999999, 'Ingrese un teléfono Valido'),
  address: Yup.string().required('La Dirección es Obligatoria'),
  isForeign: Yup.boolean().required('Este Campo es Obligatorio'),
  type: Yup.number().required('Este campo es obligatorio')
})

export const CreateEditClientPage = (): ReactElement => {
  const [, setLocation] = useLocation()
  const { id } = useParams()
  const [defaultValues, setDefaultValues] = useState<FieldValues | undefined>()
  const [canShowForm, setCanShowForm] = useState<boolean>(false)
  const { getClientById, createClient, updateClient } = useClients()
  const formFields: FormField[] = [
    {
      name: 'name',
      label: 'Nombre(s)',
      type: 'text',
      placeholder: 'Ingrese el nombre...',
      isRequired: true,
      as: 'input'
    },
    {
      name: 'last_name',
      label: 'Apellido(s)',
      type: 'text',
      placeholder: 'Ingrese el apellido... ',
      isRequired: true,
      as: 'input'
    },
    {
      name: 'email',
      label: 'Correo Electrónico',
      type: 'email',
      placeholder: 'Ingrese el correo... ',
      isRequired: true,
      as: 'input'
    },
    {
      name: 'phone',
      label: 'Teléfono',
      type: 'number',
      placeholder: 'Ingrese el Numero Telefónico... ',
      isRequired: true,
      as: 'input'
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'text',
      placeholder: 'Ingrese la dirección... ',
      isRequired: true,
      as: 'input'
    },
    {
      name: 'isForeign',
      label: 'Foráneo',
      type: '',
      placeholder: 'Ingrese el Rol... ',
      isRequired: true,
      as: 'select',
      options: [
        { value: true, label: 'SI' },
        { value: false, label: 'NO' }
      ]
    },
    {
      name: 'type',
      label: 'Tipo Cliente',
      type: '',
      placeholder: 'Ingrese el Rol... ',
      isRequired: true,
      as: 'select',
      options: [
        { value: 1, label: 'Normal' },
        { value: 2, label: 'Especial' }
      ]
    }
  ]

  useEffect(() => {
    if (id) {
      getClientById(id).then((res) => {
        setDefaultValues(
          res
            ? {
                name: res[0]?.name,
                last_name: res[0]?.last_name,
                phone: res[0]?.phone,
                email: res[0]?.email,
                address: res[0]?.address,
                isForeign: res[0]?.isForeign,
                type: res[0]?.type
              }
            : {}
        )
        setCanShowForm(true)
      })
    } else {
      setCanShowForm(true)
    }
  }, [])

  const onSubmit: SubmitHandler<submitObject> = (data) => {
    if (id) {
      updateClient(id, data).then(() => {
        setCanShowForm(false)
        setLocation('/clients')
      })
    } else {
      createClient(data).then(() => setLocation('/clients'))
    }
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions
          pageTitle={id ? 'Editar Cliente' : 'Agregar Cliente'}
          hasAddButton={false}
        />
        {canShowForm ? (
          <Form
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            fields={formFields}
            validationSchema={clientSchema}
          />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}
