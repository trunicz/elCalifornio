import { ReactElement, ComponentProps, ReactNode } from 'react'
import TableContext from './TableContext'
import { TableType } from '@renderer/types'
import { cn } from '@renderer/utils'
import { Button } from '../button'
import { LuMoreHorizontal } from 'react-icons/lu'

interface TableProps extends ComponentProps<'table'> {
  data: TableType
  hasOptions?: boolean
}

export const Table = ({
  className,
  data,
  hasOptions = true,
  ...props
}: TableProps): ReactElement => {
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
                  className="p-4 font-medium capitalize border-b-2"
                  key={`header+${index}`}
                >
                  {`${typeof header === 'string' ? header.replaceAll('_', ' ') : ''}`}
                </th>
              ))}
              {hasOptions && <th className="p-4 font-medium capitalize border-b-2">Opciones</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row: TableType, index: number) => (
              <tr className="hover:bg-secondary transition-colors duration-150" key={index}>
                {Object.keys(row).map((key, index) => (
                  <td className="text-center p-2 overflow-x-clip max-w-16" key={index}>
                    {typeof row[key] === 'object'
                      ? renderNestedObject(row[key], index)
                      : formatDate(row[key])}
                  </td>
                ))}
                {hasOptions && (
                  <td className="flex justify-center p-2">
                    <Button className="rounded-xl" isIconOnly={true} icon={<LuMoreHorizontal />} />
                  </td>
                )}
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

function renderNestedObject(obj: unknown, key: number): ReactNode {
  if (obj === null || typeof obj !== 'object') return

  const _obj = obj as { value: string }

  const nestedObject = Object.values(_obj).find((value) => typeof value === 'object')
  if (nestedObject) {
    const { name, color, textColor } = nestedObject[_obj.value] as {
      name: string
      color: string
      textColor: string
    }
    return (
      <span
        key={key}
        style={{ backgroundColor: color, color: textColor }}
        className="px-2 py-1 rounded-xl"
      >
        {name}
      </span>
    )
  }
  return
}

function formatDate(dateString: string): string | null {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/

  if (!iso8601Regex.test(dateString)) {
    return dateString
  }
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return dateString
  }

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }

  const formatter = new Intl.DateTimeFormat('default', options)
  return formatter.format(date)
}
