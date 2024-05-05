import { AppLayout, Form, FormField, submitObject } from '@renderer/components'
import { useAuthStore } from '@renderer/stores/useAuth'
import { ReactElement } from 'react'
import { SubmitHandler } from 'react-hook-form'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
  lastname: Yup.string().required('El Apellido es obligatorio'),
  email: Yup.string().email('El correo no es valido').required('El correo es obligatorio'),
  password: Yup.string()
    .required('La Contraseña es obligatoria')
    .min(8, 'La contraseña tiene que tener un mínimo de 8 caracteres'),
  rol: Yup.string().required('El rol es obligatorio')
})

const fields: FormField[] = [
  {
    name: 'name',
    label: 'Nombre(s)',
    type: 'text',
    placeholder: 'Ingrese el nombre... ',
    isRequired: true,
    as: 'input'
  },
  {
    name: 'lastname',
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
    name: 'password',
    label: 'Contraseña',
    type: 'password',
    placeholder: 'Ingrese la Contraseña... ',
    isRequired: true,
    as: 'input'
  },
  {
    name: 'rol',
    label: 'Rol',
    type: '',
    placeholder: 'Ingrese el Rol... ',
    isRequired: true,
    as: 'select',
    options: [
      { value: 1, label: 'Admin' },
      { value: 2, label: 'User' }
    ]
  }
]

export const CreateUserPage = (): ReactElement => {
  const { signUp } = useAuthStore()
  const onSubmit: SubmitHandler<submitObject> = (data) => {
    signUp(data.email, data.password, { data: data })
  }
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Agregar Usuario" hasAddButton={false} />
        <Form onSubmit={onSubmit} fields={fields} validationSchema={validationSchema} />
      </AppLayout.Content>
    </AppLayout>
  )
}
