import { ReactElement, ComponentProps } from 'react'
import TableContext from './TableContext'
import { TableType } from '@renderer/types'
import { cn } from '@renderer/utils'

interface TableProps extends ComponentProps<'table'> {
  data: TableType
}

export const Table = ({ className, data, ...props }: TableProps): ReactElement => {
  const headers = Array.from(new Set(data.flatMap((n: object) => Object.keys(n))))

  return (
    <TableContext.Provider value={{ data }}>
      <table className={cn(`w-full`, className)} {...props}>
        <thead className="w-full bg-primary text-white">
          {headers.map((header, index) => (
            <th className="border-2 border-stroke p-1" key={`header+${index}`}>
              {header + ''}
            </th>
          ))}
        </thead>
        <tbody>
          {data.map((row: TableType) => (
            <tr
              className="hover:bg-secondary transition-colors duration-150 active:bg-accent"
              key={row.id}
            >
              {Object.keys(row).map((key) => (
                <td className="border-2 border-stroke text-center" key={key}>
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TableContext.Provider>
  )
}
