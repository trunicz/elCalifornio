import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Button } from '../button'
import { ReactElement, ReactNode } from 'react'
import Input from '../input/Input'
import { cn } from '@renderer/utils'

const useCustomForm = (
  schema: Yup.AnyObjectSchema,
  initialValues: FieldValues | undefined
): FieldValues => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema), defaultValues: initialValues })

  return {
    handleSubmit,
    control,
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
  options?: { value: string | number | boolean; label: string }[]
  value?: string | number
  isVisible?: boolean
  className?: string
}

interface FormProps {
  onSubmit: SubmitHandler<submitObject>
  fields: FormField[]
  validationSchema: Yup.AnyObjectSchema
  className?: string
  children?: ReactNode
  formDirection?: 'col' | 'row'
  defaultValues?: FieldValues
}

export type submitObject = { [x: string]: string }

export const Form = ({
  onSubmit,
  fields,
  validationSchema,
  className,
  children = null,
  formDirection = 'row',
  defaultValues,
  ...props
}: FormProps): ReactElement => {
  const { handleSubmit, register, errors } = useCustomForm(validationSchema, defaultValues)

  const submitHandler: SubmitHandler<submitObject> = (data: submitObject) => {
    if (Object.keys(errors).length === 0) {
      onSubmit(data)
    }
  }

  return (
    <form className={cn('p-4 flex-1', className)} onSubmit={handleSubmit(submitHandler)} {...props}>
      {fields.map((field) =>
        field.isVisible === false ? (
          <></>
        ) : (
          <div
            key={field.name}
            className={cn('flex justify-between mb-5', {
              'flex-col': formDirection === 'col'
            })}
          >
            <label className="" htmlFor={field.name}>
              {field.label}
              {field.isRequired && <span className="text-red-500 relative bottom-1">*</span>}:
            </label>
            <div
              className={cn('', {
                'w-1/3 max-w-[350px] min-w-[200px]': formDirection === 'row',
                'mt-2': formDirection === 'col'
              })}
            >
              <Input
                as={field.as}
                className="focus:bg-secondary w-full h-10 outline-none border-2 rounded-xl p-1 px-3"
                type={field.type}
                id={field.name}
                options={field?.options}
                placeholder={field?.placeholder}
                {...register(field.name)}
              />
              {errors[field.name]?.message ? (
                <p className="text-red-600 font-medium text-xs mt-1">
                  {errors[field.name].message}
                </p>
              ) : (
                <span className="text-white font-medium text-xs mt-1">...</span>
              )}
            </div>
          </div>
        )
      )}
      {!children && (
        <Button
          className="fixed z-10 end-4 bottom-4 bg-emerald-400 hover:bg-emerald-500  text-white w-auto ms-auto px-12 py-6 border-0"
          text="Continuar"
        />
      )}
      {children}
    </form>
  )
}
