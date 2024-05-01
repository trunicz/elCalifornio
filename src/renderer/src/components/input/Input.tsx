import { cn } from '@renderer/utils'
import { ReactElement } from 'react'
import Select, { GroupBase, OptionsOrGroups } from 'react-select'

interface InputProps {
  as: 'input' | 'select' | 'textarea'
  type?: string
  options?: OptionsOrGroups<string | number, GroupBase<string | number>>
  value: string | number
  className: string
  placeholder: string
}

export const Input = ({
  as,
  type,
  options,
  value,
  className,
  placeholder,
  ...props
}: InputProps): ReactElement | undefined => {
  switch (as) {
    case 'input':
      return (
        <input
          placeholder={placeholder}
          className={cn('', className)}
          value={value as string}
          type={type}
          {...props}
        />
      )
    case 'select':
      return (
        <Select
          placeholder={placeholder}
          className={cn('', className)}
          options={options}
          value={value}
          {...props}
        />
      )
    case 'textarea':
      return (
        <textarea
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
