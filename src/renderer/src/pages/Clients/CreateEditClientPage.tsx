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
  phone: Yup.string()
    .required('El Teléfono es Obligatorio')
    .matches(
      /^(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      'Por favor, introduce un número de teléfono válido.'
    ),
  address: Yup.string().required('La Dirección es Obligatoria'),
  city: Yup.string().required('La Ciudad es Obligatoria'),
  isForeign: Yup.boolean().required('Este Campo es Obligatorio'),
  type: Yup.number().required('Este campo es obligatorio')
})

export const CreateEditClientPage = (): ReactElement => {
  const [, setLocation] = useLocation()
  const { id, enable } = useParams()
  const [defaultValues, setDefaultValues] = useState<FieldValues | undefined>()
  const [canShowForm, setCanShowForm] = useState<boolean>(false)
  const { getClientById, createClient, getAllFiles, updateClient } = useClients()
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
      as: 'input',
      isVisible: false
    },
    {
      name: 'phone',
      label: 'Teléfono',
      type: 'text',
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
      name: 'city',
      label: 'Ciudad',
      type: 'text',
      placeholder: 'Ingrese la Ciudad...',
      isRequired: true,
      as: 'input'
    },
    {
      className: 'uppercase',
      name: 'rfc',
      label: 'RFC',
      type: 'text',
      placeholder: 'Ingrese el RFC...',
      isRequired: false,
      as: 'input'
    },
    {
      name: 'license',
      label: 'Licencia Automovilista',
      type: 'text',
      placeholder: 'Ingrese licencia...',
      isRequired: false,
      as: 'input'
    },
    {
      name: 'voter_code',
      label: 'Clave Elector',
      type: 'text',
      placeholder: 'Ingrese la Clave Elector...',
      isRequired: false,
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
        { value: false, label: 'NO' },
        { value: true, label: 'SI' }
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
      getClientById(id).then(async (res) => {
        await getAllFiles(id).then((prom) => {
          const files = Array.from(prom)
          if (res) {
            const tempClient = res[0]
            setDefaultValues({
              name: tempClient.name,
              last_name: tempClient.last_name,
              phone: tempClient.phone,
              email: tempClient.email,
              address: tempClient.address,
              city: tempClient.city,
              rfc: tempClient.rfc,
              license: tempClient.license,
              voter_code: tempClient.voter_code,
              isForeign: tempClient.isForeign,
              type: tempClient.type,
              files: files
            })
            setCanShowForm(true)
          }
        })
      })
    } else {
      setCanShowForm(true)
    }
  }, [])

  const onSubmit: SubmitHandler<submitObject> = (data) => {
    const files = data.files
    delete data.files
    setCanShowForm(false)
    if (id) {
      updateClient(id, data, files).then(() => {
        setLocation(enable ? '/rent/create' : '/clients')
      })
    } else {
      createClient(data, files).then(() => setLocation(enable ? '/rent/create' : '/clients'))
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
          <>
            <Form
              className="mx-auto overflow-y-auto w-5/6 auto-rows-max grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              onSubmit={onSubmit}
              defaultValues={defaultValues}
              formDirection="col"
              fields={formFields}
              validationSchema={clientSchema}
            />
          </>
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}
