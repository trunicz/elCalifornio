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
      {data.length > 0 ? (
        <table className={cn(`w-full`, className)} {...props}>
          <thead className="w-full">
            <tr>
              {headers.map((header, index) => (
                <th
                  id={`h-${index}`}
                  className="p-4 font-normal border-b-2"
                  key={`header+${index}`}
                >
                  {header + ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row: TableType) => (
              <tr
                className="hover:bg-secondary transition-colors duration-150 active:bg-accent"
                key={row.id}
              >
                {Object.keys(row).map((key) => (
                  <td className="text-center p-2" key={key}>
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center">
          <h3 className="text-3xl text-accent">Sin Información</h3>
        </div>
      )}
    </TableContext.Provider>
  )
}
