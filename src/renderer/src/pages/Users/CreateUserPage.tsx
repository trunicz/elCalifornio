import { AppLayout, Form, FormField } from '@renderer/components'
import { ReactElement } from 'react'
import { SubmitHandler } from 'react-hook-form'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
  lastname: Yup.string().required('El Apellido es obligatorio'),
  email: Yup.string().email('El correo no es valido').required('El correo es obligatorio')
})

const fields: FormField[] = [
  {
    name: 'name',
    label: 'Nombre(s)',
    type: 'text',
    placeholder: 'Ingrese el nombre... ',
    isRequired: true,
    as: 'input',
    value: ''
  },
  {
    name: 'lastname',
    label: 'Apellido(s)',
    type: 'text',
    placeholder: 'Ingrese el apellido... ',
    isRequired: true,
    as: 'input',
    value: ''
  },
  {
    name: 'email',
    label: 'Correo Electrónico',
    type: 'email',
    placeholder: 'Ingrese el correo... ',
    isRequired: true,
    as: 'input',
    value: ''
  },
  {
    name: 'password',
    label: 'Contraseña',
    type: 'password',
    placeholder: 'Ingrese la Contraseña... ',
    isRequired: true,
    as: 'input',
    value: ''
  },
  {
    name: 'rol',
    label: 'Rol',
    type: '',
    placeholder: 'Ingrese el Rol... ',
    isRequired: true,
    as: 'select',
    value: '',
    options: [
      { value: '1', label: 'Admin' },
      { value: '2', label: 'User' }
    ]
  }
]

const onSubmit: SubmitHandler<FormField> = (data) => {
  console.log(data) // TODO: Implementar logica para enviar info a supa
}

export const CreateUserPage = (): ReactElement => {
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Agregar Usuario" hasAddButton={false} />
        <Form onSubmit={onSubmit} fields={fields} validationSchema={validationSchema} />
      </AppLayout.Content>
    </AppLayout>
  )
}
