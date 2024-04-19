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
      <table className={cn(``, className)} {...props}>
        <thead>
          <tr className="flex justify-between">
            {headers.map((header, index) => (
              <th className="border-2" key={`header+${index}`}>
                {header + ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: TableType) => (
            <tr className="border-2" key={row.id}>
              {Object.keys(row).map((key) => (
                <td className="border-2" key={key}>
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
