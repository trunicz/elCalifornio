import { ReactElement, ComponentProps, useState, ComponentType, ComponentElement } from 'react'
import { Button } from './button'
import { TableType } from '@renderer/types'

interface SearchBarType extends ComponentProps<'search'> {
  data: TableType
  searchFunction: React.Dispatch<React.SetStateAction<object>>
}

export const SearchBar = ({ searchFunction, data }: SearchBarType): ReactElement => {
  const [SearchInput, setSearchInput] = useState('')

  const handleInput = (event: { target: HTMLInputElement }): void => {
    setSearchInput(event.target.value)
  }
  return (
    <search className="flex mb-2 ">
      <input
        type="text"
        placeholder="Buscar..."
        className="ms-auto  active/focus:bg-secondary outline-none border-2 border-stroke p-1 px-2 "
        onChange={() => handleInput}
      />
      <Button text="s" className="border-l-0" />
      <span>{SearchInput}</span>
    </search>
  )
}
