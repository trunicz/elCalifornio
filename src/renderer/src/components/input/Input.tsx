/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@renderer/utils'
import { ForwardRefRenderFunction, MutableRefObject, forwardRef, useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

interface InputProps {
  as: 'input' | 'select' | 'textarea'
  type?: string
  options?: { value: string | number; label: string }[]
  value: string | number
  className?: string
  placeholder?: string
  onChange?: (e: any) => void
}

const Input: ForwardRefRenderFunction<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  InputProps
> = (
  {
    as,
    type,
    options = [],
    value,
    className,
    placeholder,
    onChange = (): void => {},
    ...props
  }: InputProps,
  ref
) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  switch (as) {
    case 'input':
      return (
        <div className="relative overflow-hidden w-full">
          <input
            ref={ref as MutableRefObject<HTMLInputElement>}
            placeholder={placeholder}
            className={cn('p-1 px-4 text-lg outline-none border-2 rounded-lg', className)}
            value={value as string}
            type={type === 'password' && showPassword ? 'text' : type}
            onChange={(e) => onChange(e)}
            {...props}
          />
          {type === 'password' && (
            <button
              type="button"
              className="absolute right-0 hover:bg-gray-200 transition-all active:scale-95 rounded-lg border bg-gray-100 p-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          )}
        </div>
      )
    case 'select':
      return (
        <select
          ref={ref as MutableRefObject<HTMLSelectElement>}
          className={cn('w-full', className)}
          value={value as string}
          {...props}
        >
          {options.map((option, index) => (
            <option className="flex" key={option.value + String(index)} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    case 'textarea':
      return (
        <textarea
          ref={ref as MutableRefObject<HTMLTextAreaElement>}
          placeholder={placeholder}
          className={cn('', className)}
          value={value}
          {...props}
        />
      )
    default:
      throw new Error("Component * need a 'as' prop to render a element")
  }
}

export default forwardRef(Input)
