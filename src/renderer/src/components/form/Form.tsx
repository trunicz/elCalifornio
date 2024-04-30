import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Button } from '../button'

const useCustomForm = (schema: Yup.AnyObjectSchema): FieldValues => {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) })

  return {
    handleSubmit,
    register,
    formState: { errors }
  }
}
export interface FormField {
  name: string
  label: string
  type: string
}

interface FormProps {
  onSubmit: SubmitHandler<FormField>
  fields: FormField[]
  validationSchema: Yup.AnyObjectSchema
}

export const Form = ({ onSubmit, fields, validationSchema }: FormProps): FieldValues => {
  const { handleSubmit, register, errors } = useCustomForm(validationSchema)

  const submitHandler: SubmitHandler<FormField> = (data: FormField) => {
    onSubmit(data)
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <input type={field.type} id={field.name} {...register(field.name)} />
          {errors[field.name] && <p>{errors[field.name]?.message}</p>}
        </div>
      ))}
      <Button text="Enviar" />
    </form>
  )
}
