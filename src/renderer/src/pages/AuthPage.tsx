import { Form, FormField } from '@renderer/components'
import { ReactElement } from 'react'
import { SubmitHandler } from 'react-hook-form'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  email: Yup.string().email('El correo no es valido').required('El correo es obligatorio'),
  password: Yup.string().required('La contraseña es obligatorio')
})

const fields: FormField[] = [
  {
    name: 'email',
    label: 'Correo',
    type: 'text',
    as: 'input',
    value: '',
    isRequired: true,
    placeholder: 'example@mail.com'
  },
  {
    name: 'password',
    label: 'Contraseña',
    type: 'password',
    as: 'input',
    value: '',
    isRequired: true,
    placeholder: '●●●●●●●●●●'
  }
]

export const AuthPage = (): ReactElement => {
  const onSubmit: SubmitHandler<FormField> = (data) => {
    console.log(data)
  }
  return (
    <main className="flex flex-col items-center h-full">
      <section className="flex flex-col w-1/4 justify-center flex-1 gap-4">
        <div className="flex justify-center">
          <img className="w-1/2 h-auto" src="/src/assets/Frame.png" />
        </div>
        <Form onSubmit={onSubmit} validationSchema={validationSchema} fields={fields} />
      </section>
    </main>
  )
}
