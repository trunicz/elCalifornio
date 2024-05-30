import { ReactElement, ComponentProps, SetStateAction, Dispatch, useEffect, useState } from 'react'
import { TableType } from '@renderer/types'

interface SearchBarType extends ComponentProps<'input'> {
  data: TableType
  searchFunction: Dispatch<SetStateAction<unknown[] | null>>
  initialValue?: string
}

export const SearchBar = ({
  searchFunction,
  data,
  initialValue = '',
  ...props
}: SearchBarType): ReactElement => {
  const [searchText, setSearchText] = useState('')
  const search = (value: string): void => {
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

  useEffect(() => {
    if (initialValue && data) {
      setSearchText(initialValue)
      search(initialValue)
    }
  }, [data])

  const updateSearchBar = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value)
    search(event.target.value)
  }

  return (
    <input
      type="text"
      placeholder="Buscar..."
      className="focus:bg-main h-full outline-none border-2 rounded-xl p-1 px-2"
      onChange={(event) => updateSearchBar(event)}
      value={searchText}
      {...props}
    />
  )
}
