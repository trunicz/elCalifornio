/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Button } from '../button'
import { Fragment, ReactElement, ReactNode, isValidElement } from 'react'
import Input from '../input/Input'
import { cn } from '@renderer/utils'
import { LuUploadCloud } from 'react-icons/lu'
import { useModal } from '../modal'
import { useAutoAnimate } from '@formkit/auto-animate/react'

const useCustomForm = (
  schema: Yup.AnyObjectSchema,
  initialValues: FieldValues | undefined
): FieldValues => {
  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema), defaultValues: initialValues })

  return {
    handleSubmit,
    control,
    register,
    errors,
    watch
  }
}
export interface FormField {
  name: string
  label: string
  type?: string
  placeholder?: string
  isRequired?: boolean
  as: string
  options?: SelectOptions
  value?: string | number
  isVisible?: boolean
  className?: string
}
export type SelectOptions = { value: any; label: string }[] | null

interface FormProps {
  onSubmit: SubmitHandler<submitObject>
  fields: Array<FormField | ReactElement>
  validationSchema: Yup.AnyObjectSchema
  className?: string
  children?: ReactNode
  formDirection?: 'col' | 'row'
  defaultValues?: FieldValues
  watchFields?: (formProps: object) => void
  hasFiles?: boolean
  hasRequiereMessage?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type submitObject = { [x: string]: any }

export const Form = ({
  onSubmit,
  fields,
  validationSchema,
  className,
  children = null,
  formDirection = 'row',
  defaultValues,
  watchFields,
  hasFiles = false,
  hasRequiereMessage = true,
  ...props
}: FormProps): ReactElement => {
  const { handleSubmit, register, errors, watch } = useCustomForm(validationSchema, defaultValues)

  const [parent] = useAutoAnimate()
  const { Modal, openModal } = useModal()

  const files = watch('files')

  if (watchFields) {
    const watchedFields = watch()
    watchFields(watchedFields)
  }

  const submitHandler: SubmitHandler<submitObject> = (data: submitObject) => {
    if (Object.keys(errors).length === 0) {
      onSubmit(data)
    }
  }

  return (
    <>
      {hasRequiereMessage && (
        <p className=" p-4 text-slate-400">
          El (<span className="text-red-500">*</span>) indica un campo obligatorio.
        </p>
      )}
      <form
        className={cn('p-4 flex-1', className)}
        onSubmit={handleSubmit(submitHandler)}
        ref={parent}
        {...props}
      >
        {fields.map((field: any, index) => {
          if (isValidElement(field)) {
            return field
          } else {
            return field.isVisible === false ? (
              <Fragment key={field?.name + index}></Fragment>
            ) : (
              <div
                key={field?.name + index}
                className={cn('flex justify-between items-between mb-5', field.className, {
                  'flex-col': formDirection === 'col'
                })}
              >
                <label className="w-full text-start" htmlFor={field?.name}>
                  {field.label}
                  {field.isRequired && <span className="text-red-500 relative bottom-1">*</span>}:
                </label>
                <div
                  className={cn('', {
                    'w-1/3 max-w-[350px] min-w-[200px]': formDirection === 'row',
                    'mt-2 flex flex-col items-center ': formDirection === 'col'
                  })}
                >
                  <Input
                    as={field.as}
                    className={cn(
                      'focus:bg-secondary resize-none w-full h-10 outline-none border-2 rounded-xl p-1 px-3'
                    )}
                    type={field.type}
                    id={field?.name}
                    options={field?.options}
                    placeholder={field?.placeholder}
                    {...register(field?.name)}
                  />
                  {errors[field?.name]?.message ? (
                    <p className="text-red-600 text-start w-full font-medium text-xs mt-1">
                      {errors[field.name].message}
                    </p>
                  ) : (
                    <span className="text-white font-medium text-xs mt-1">...</span>
                  )}
                </div>
              </div>
            )
          }
        })}
        {hasFiles && (
          <div ref={parent} className="flex flex-col">
            <label
              htmlFor="file-upload"
              className="cursor-pointer mt-auto  hover:bg-purple-100 hover:text-purple-500 transition-all text-black outline-gray-200 rounded-xl mb-5 p-4 text-sm py-6 font-normal flex flex-col justify-center items-center outline hover:outline-purple-500 "
            >
              <span className="text-xl mx-2">
                <LuUploadCloud />
              </span>
              Subir Archivos
            </label>
            <input
              multiple
              id="file-upload"
              type="file"
              accept=".pdf, .png, .jpg"
              {...register('files')}
              className="hidden"
            />
          </div>
        )}
        {typeof files !== 'undefined' && (
          <div ref={parent} className="col-span-full border-t pt-6 grid grid-cols-6 gap-4">
            <Modal title="Vista Previa" />
            {Array.from(files).map((file: any, index) => (
              <div
                className="border hover:bg-gray-100 transition-all rounded-xl overflow-hidden p-4"
                key={file.name + index}
              >
                <div
                  className="flex flex-col justify-center items-center"
                  onClick={() => {
                    openModal(
                      <div className="overflow-y-auto w-auto flex justify-center">
                        <img
                          src={file.name ? file.name : URL.createObjectURL(file)}
                          alt="img"
                          className="h-[500px] object-cover"
                          onError={(e: any) => {
                            e.onError = null
                            e.target.src = '/src/assets/noImage.jpeg'
                          }}
                        />
                      </div>
                    )
                  }}
                >
                  <img
                    src={file.name ? file.name : URL.createObjectURL(file)}
                    alt="img"
                    className="min-w-16 h-16 object-cover"
                    onError={(e: any) => {
                      e.onError = null
                      e.target.src = '/src/assets/noImage.jpeg'
                    }}
                  />
                  <p className="text-nowrap w-full overflow-x-clip text-xs text-center">
                    {file.name}
                  </p>
                  {files.size && (
                    <p className="text-nowrap w-full overflow-x-clip text-xs text-center">
                      {file.size > 1024 * 1024
                        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                        : `${Math.round(file.size / 1024)} KB`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {!children && (
          <Button
            type="submit"
            className="fixed z-[5] end-4 bottom-4 bg-emerald-400 hover:bg-emerald-500  text-white w-auto ms-auto px-12 py-6 border-0"
            text="Continuar"
          />
        )}
        {children}
      </form>
    </>
  )
}
