import { AppLayout, Form, FormField } from '@renderer/components'
import { ReactElement } from 'react'
import { SubmitHandler } from 'react-hook-form'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid Email').required('Email is required')
})

const fields: FormField[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' }
]
const onSubmit: SubmitHandler<FormField> = (data) => {
  console.log(data) // Aquí puedes enviar los datos del formulario a tu backend, por ejemplo
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
