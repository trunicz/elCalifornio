import { AppLayout, Form, submitObject } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useAdmin } from '@renderer/hooks/useAdmin'
import { useAuthStore } from '@renderer/stores/useAuth'
import { ReactElement, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler } from 'react-hook-form'
import { useLocation, useParams } from 'wouter'
import * as Yup from 'yup'

const createUserSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
  lastname: Yup.string().required('El Apellido es obligatorio'),
  email: Yup.string().email('El correo no es válido').required('El correo es obligatorio'),
  password: Yup.string()
    .required('La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  rol: Yup.string().required('El rol es obligatorio')
})

const updateUserSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
  lastname: Yup.string().required('El Apellido es obligatorio'),
  email: Yup.string().email('El correo no es válido').required('El correo es obligatorio'),
  rol: Yup.string().required('El rol es obligatorio')
})

export const CreateEditUserPage = (): ReactElement => {
  const [, setLocation] = useLocation()
  const { createUser } = useAuthStore()
  const { getUser, updateUser } = useAdmin()
  const { id } = useParams()
  const [showForm, setShowForm] = useState<boolean>(false)
  const [defaultValues, setDefaultValues] = useState<FieldValues | undefined>()

  const formFields = [
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
      placeholder: 'Ingrese la contraseña... ',
      isRequired: true,
      isVisible: id ? false : true,
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
        { value: 2, label: 'Usuario' }
      ]
    }
  ]

  useEffect(() => {
    if (id) {
      getUser(id).then((res) => {
        setDefaultValues({
          name: res?.Nombre,
          lastname: res?.Apellido,
          email: res?.Correo,
          password: '',
          rol: res?.Rol === 'Admin' ? 1 : 2
        })
        setShowForm(true)
      })
    } else {
      setShowForm(true)
    }
  }, [id])

  const onSubmit: SubmitHandler<submitObject> = (data) => {
    const user_metadata = {
      name: data.name,
      lastname: data.lastname,
      email: data.email,
      rol: data.rol
    }

    const userData = { email: user_metadata.email, user_metadata }

    if (id) {
      updateUser(id, userData).then(() => setLocation('/users'))
    } else {
      createUser(data.email, data.password, user_metadata).then(() => setLocation('/users'))
    }
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions
          pageTitle={id ? 'Editar Usuario' : 'Agregar Usuario'}
          hasAddButton={false}
        />
        {showForm ? (
          <Form
            className="mx-auto overflow-y-auto lg:w-1/2 grid grid-cols-2 auto-rows-max gap-4"
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            fields={formFields}
            formDirection="col"
            validationSchema={id ? updateUserSchema : createUserSchema}
          />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}
