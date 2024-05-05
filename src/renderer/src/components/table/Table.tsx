import { ReactElement, ComponentProps, ReactNode, Key } from 'react'
import TableContext from './TableContext'
import { TableType } from '@renderer/types'
import { cn } from '@renderer/utils'
import { Button } from '../button'
import { LuEye, LuPencil, LuTrash2 } from 'react-icons/lu'

interface TableProps extends ComponentProps<'table'> {
  data: TableType
  hasOptions?: boolean
  watchFunction?: (id: string) => void
  editFunction?: (id: string) => void
  deleteFunction?: (id: string) => void
}

export const Table = ({
  className,
  data,
  hasOptions = true,
  watchFunction,
  editFunction,
  deleteFunction,
  ...props
}: TableProps): ReactElement => {
  const headers = data ? Array.from(new Set(data?.flatMap((n: object) => Object.keys(n)))) : []

  const getOptions = (id: number): Array<{ [x: string]: string }> => {
    return [
      { name: 'Ver', to: `/${id}` },
      { name: 'Editar', to: `/${id}/edit` },
      { name: 'Eliminar', to: `/${id}/delete` }
    ]
  }

  getOptions(1)
  return (
    <TableContext.Provider value={{ data }}>
      {data.length > 0 ? (
        <section className="flex-1 overflow-x-auto">
          <table className={cn('w-full text-sm text-left', className)} {...props}>
            <thead className="uppercase border-b-2">
              <tr className="text-center text-stroke">
                {headers.map((head, index) => (
                  <th className="px-6 py-5 font-medium text-nowrap" key={`${head}${index}`}>
                    {String(head).replaceAll('_', ' ')}
                  </th>
                ))}
                {hasOptions && <th className="px-6 py-5 font-medium">Opciones</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row: { [x: string]: string }, index: Key | null | undefined) =>
                row ? (
                  <tr className="border-b text-stroke text-center hover:bg-secondary" key={index}>
                    {Object.keys(row).map((key, index) => (
                      <td className="px-6 py-4 overflow-ellipsis text-nowrap" key={index}>
                        {typeof row[key] === 'object'
                          ? renderNestedObject(row[key], index)
                          : formatDate(row[key])}
                      </td>
                    ))}
                    <td className="px-6 py-4 flex gap-2 justify-center">
                      <Button
                        className="border-0 p-4 rounded-xl text-blue-500 hover:bg-blue-500"
                        icon={<LuEye />}
                        isIconOnly={true}
                        onClick={() => (watchFunction ? watchFunction(row.id) : '')}
                      />
                      <Button
                        className="border-0 p-4 rounded-xl text-amber-500 hover:bg-amber-500"
                        icon={<LuPencil />}
                        isIconOnly={true}
                        onClick={() => (editFunction ? editFunction(row.id) : '')}
                      />
                      <Button
                        className="border-0 p-4 rounded-xl text-red-500 hover:bg-red-500"
                        icon={<LuTrash2 />}
                        isIconOnly={true}
                        onClick={() => (deleteFunction ? deleteFunction(row.id) : '')}
                      />
                    </td>
                  </tr>
                ) : (
                  <></>
                )
              )}
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
    const { name } = nestedObject[_obj.value] as {
      name: string
      bgColor: string
      color: string
    }
    return (
      <span key={key} className="px-2 py-1 rounded-xl bg-primary text-white">
        {name}
      </span>
    )
  }
  return
}
function formatDate(dateString: string): ReactNode | null {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}\+\d{2}:\d{2}$/

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
