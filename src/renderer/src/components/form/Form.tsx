import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Button } from '../button'
import { ReactElement } from 'react'
import Input from '../input/Input'

const useCustomForm = (schema: Yup.AnyObjectSchema): FieldValues => {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) })

  return {
    handleSubmit,
    register,
    errors
  }
}
export interface FormField {
  name: string
  label: string
  type: string
  placeholder?: string
  isRequired?: boolean
  as: string
  options?: { value: string | number; label: string }[]
  value: string | number
  className?: string
}

interface FormProps {
  onSubmit: SubmitHandler<FormField>
  fields: FormField[]
  validationSchema: Yup.AnyObjectSchema
}

export const Form = ({ onSubmit, fields, validationSchema }: FormProps): ReactElement => {
  const { handleSubmit, register, errors } = useCustomForm(validationSchema)

  const submitHandler: SubmitHandler<FormField> = (data: FormField) => {
    if (Object.keys(errors).length === 0) {
      onSubmit(data)
    }
  }

  return (
    <form className="p-4 flex-1" onSubmit={handleSubmit(submitHandler)}>
      {fields.map((field) => (
        <div key={field.name} className="flex justify-between mb-5">
          <label className="" htmlFor={field.name}>
            {field.label}
            {field.isRequired && <span className="text-red-500 relative bottom-1">*</span>}:
          </label>
          <div className="w-1/3 max-w-[350px] min-w-[200px] ">
            <Input
              as={field.as}
              className="focus:bg-secondary w-full h-10 outline-none border-2 rounded-xl p-1 px-3"
              type={field.type}
              id={field.name}
              options={field?.options}
              placeholder={field?.placeholder}
              {...register(field.name)}
            />
            {errors[field.name]?.message && (
              <p className="text-red-600 font-medium text-xs mt-1">{errors[field.name].message}</p>
            )}
          </div>
        </div>
      ))}
      <Button
        className="fixed z-10 end-4 bottom-4 border-emerald-400 hover:bg-emerald-500  text-emerald-500 w-auto ms-auto px-12"
        text="Continuar"
      />
    </form>
  )
}
