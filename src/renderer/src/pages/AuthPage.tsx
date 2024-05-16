import { Button, Form, FormField, submitObject } from '@renderer/components'
import { useAlert } from '@renderer/hooks/useAlert'
import { useAuthStore } from '@renderer/stores/useAuth'
import { ReactElement, useEffect } from 'react'
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
    isRequired: true,
    placeholder: 'example@mail.com'
  },
  {
    name: 'password',
    label: 'Contraseña',
    type: 'password',
    as: 'input',
    isRequired: true,
    placeholder: '●●●●●●●●●●'
  }
]

export const AuthPage = (): ReactElement => {
  const { isLoading, error, signIn } = useAuthStore()
  const { Alert, emitAlert } = useAlert()

  useEffect(() => {
    if (typeof error === 'string') {
      emitAlert('Credenciales de autenticación invalidas', 'danger')
    }
  }, [error])

  const onSubmit: SubmitHandler<submitObject> = (data) => {
    const { email, password } = data
    signIn(email, password)
  }
  return (
    <main className="flex flex-col items-center h-full">
      <section className="flex flex-col sm:w-1/2 lg:w-1/3 xl:w-1/4 justify-center flex-1 gap-4">
        <div className="flex justify-center">
          <img className="w-1/2 h-auto" src="/src/assets/Frame.png" />
        </div>
        <Form
          className="flex-none"
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          fields={fields}
          formDirection="col"
          hasRequiereMessage={false}
        >
          <Button
            className="border-0 bg-red-800 hover:bg-orange-600 hover:text-white text-white w-full"
            text="Ingresar"
            isLoading={isLoading}
          />
        </Form>
        {Alert}
      </section>
    </main>
  )
}
