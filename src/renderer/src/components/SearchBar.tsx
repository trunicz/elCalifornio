import { ReactElement, ComponentProps } from 'react'
import { TableType } from '@renderer/types'

interface SearchBarType extends ComponentProps<'input'> {
  data: TableType
  searchFunction: React.Dispatch<React.SetStateAction<object>>
}

export const SearchBar = ({ searchFunction, data }: SearchBarType): ReactElement => {
  const Search = (value: string): void => {
    if (value.length) {
      const val = value.toLowerCase()
      const returnedData: TableType = data.filter((e: TableType) => {
        return Object.values(e).some(
          (prop) => typeof prop === 'string' && prop.toLowerCase().includes(val)
        )
      })
      searchFunction(returnedData)
    } else {
      searchFunction(data)
    }
  }

  return (
    <input
      type="text"
      placeholder="Buscar..."
      className="focus:bg-main outline-none border-2 rounded-xl p-1 px-2 "
      onChange={(event) => Search(event.target.value)}
    />
  )
}
