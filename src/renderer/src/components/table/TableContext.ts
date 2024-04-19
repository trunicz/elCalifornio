import { TableType } from '@renderer/types'
import { createContext, useContext } from 'react'

const TableContext = createContext<{ data: TableType } | null>(null)

export function useTableContext(): { data: TableType } | null {
  const context = useContext(TableContext)

  if (!context) {
    throw new Error('Table.* component must be rendered as child of table')
  }
  return context
}

export default TableContext
