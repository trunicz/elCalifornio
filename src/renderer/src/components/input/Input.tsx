import { cn } from '@renderer/utils'
import { ForwardRefRenderFunction, MutableRefObject, forwardRef } from 'react'

interface InputProps {
  as: 'input' | 'select' | 'textarea'
  type?: string
  options?: { value: string | number; label: string }[]
  value: string | number
  className: string
  placeholder: string
}

const Input: ForwardRefRenderFunction<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  InputProps
> = ({ as, type, options = [], value, className, placeholder, ...props }: InputProps, ref) => {
  switch (as) {
    case 'input':
      return (
        <input
          ref={ref as MutableRefObject<HTMLInputElement>}
          placeholder={placeholder}
          className={cn('', className)}
          value={value as string}
          type={type}
          {...props}
        />
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
