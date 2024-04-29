import { ReactElement, ComponentProps, ReactNode, Key } from 'react'
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

  data.map((row) => {
    Object.keys(row).map((key) => {
      console.log(row[key])
    })
  })

  return (
    <TableContext.Provider value={{ data }}>
      {data.length > 0 ? (
        <section className="flex-1 overflow-x-auto">
          <table className={cn('w-full text-sm text-left', className)} {...props}>
            <thead className="uppercase border-b-2">
              <tr>
                {headers.map((head, index) => (
                  <th className="px-6 py-3 font-medium" key={`${head}${index}`}>
                    {String(head).replaceAll('_', ' ')}
                  </th>
                ))}
                {hasOptions && <th className="px-6 py-3 font-medium">Opciones</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row: { [x: string]: string }, index: Key | null | undefined) => (
                <tr className="border-b" key={index}>
                  {Object.keys(row).map((key, index) => (
                    <td className="px-6 py-4 overflow-ellipsis text-nowrap" key={index}>
                      {typeof row[key] === 'object'
                        ? renderNestedObject(row[key], index)
                        : formatDate(row[key])}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-center">
                    <Button className="rounded-xl" isIconOnly={true} icon={<LuMoreHorizontal />} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <div className="text-center">
          <h3 className="text-3xl text-accent my-10">Sin Información</h3>
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
    const { name, bgColor, color } = nestedObject[_obj.value] as {
      name: string
      bgColor: string
      color: string
    }
    return (
      <span
        key={key}
        style={{ backgroundColor: bgColor, color: color }}
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
    hour12: false
  }

  const formatter = new Intl.DateTimeFormat('default', options)
  return formatter.format(date)
}
