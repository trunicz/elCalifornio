/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement, ComponentProps, ReactNode, Key } from 'react'
import TableContext from './TableContext'
import { TableType } from '@renderer/types'
import { cn } from '@renderer/utils'
import { Button } from '../button'
import { LuEye, LuPencil, LuTrash2 } from 'react-icons/lu'

interface TableProps extends ComponentProps<'table'> {
  data: TableType
  hasOptions?: boolean
  hiddenKeys?: string[]
  watchFunction?: (id: string | number) => void
  editFunction?: (id: any) => void
  deleteFunction?: (id: string | number) => void
  customDeleteBtn?: { icon: ReactElement; title: string }
  customMoreBtn?: { icon: ReactElement; title: string }
  customEditBtn?: { icon: ReactElement; title: string }
  canSeeEdit?: boolean
  canSeeDelete?: boolean
  canSeeMore?: boolean
}

export const Table = ({
  className,
  data,
  hasOptions = true,
  watchFunction,
  editFunction,
  deleteFunction,
  customDeleteBtn,
  canSeeEdit = true,
  canSeeMore = true,
  canSeeDelete = true,
  customMoreBtn,
  customEditBtn,
  hiddenKeys = [],
  ...props
}: TableProps): ReactElement => {
  const headers = data
    ? Array.from(
        new Set(
          data
            ?.flatMap((n: object) => Object.keys(n))
            .filter((key: string) => !hiddenKeys?.includes(key))
        )
      )
    : []

  return (
    <TableContext.Provider value={{ data }}>
      {data?.length > 0 ? (
        <section className="flex-1 overflow-x-auto">
          <table className={cn('w-full text-sm text-left', className)} {...props}>
            <thead className="uppercase sticky bg-white shadow-md top-0">
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
                  <tr className="border-b text-stroke text-center " key={index}>
                    {Object.keys(row)
                      .filter((key) => !hiddenKeys.includes(key))
                      .map((key, index) => (
                        <td className="px-6 py-4 text-nowrap" key={index}>
                          {typeof row[key] === 'object'
                            ? renderNestedObject(row[key])
                            : formatDate(row[key])}
                        </td>
                      ))}
                    {hasOptions && (
                      <td className="px-6 py-4 flex gap-2 items-center justify-center">
                        {canSeeMore && (
                          <Button
                            className="border-0 p-4 rounded-xl text-blue-500 hover:bg-blue-500"
                            icon={customMoreBtn ? customMoreBtn.icon : <LuEye />}
                            isIconOnly={true}
                            title={customMoreBtn ? customMoreBtn.title : 'Ver'}
                            onClick={() => (watchFunction ? watchFunction(row.id) : '')}
                          />
                        )}
                        {canSeeEdit && (
                          <Button
                            className="border-0 p-4 rounded-xl text-amber-500 hover:bg-amber-500"
                            icon={customEditBtn ? customEditBtn.icon : <LuPencil />}
                            isIconOnly={true}
                            title={customEditBtn ? customEditBtn.title : 'Editar'}
                            onClick={() => (editFunction ? editFunction(row.id) : '')}
                          />
                        )}
                        {canSeeDelete && (
                          <Button
                            className="border-0 p-4 rounded-xl text-red-500 hover:bg-red-500"
                            icon={customDeleteBtn ? customDeleteBtn.icon : <LuTrash2 />}
                            isIconOnly={true}
                            title={customDeleteBtn ? customDeleteBtn.title : 'Eliminar'}
                            onClick={() => (deleteFunction ? deleteFunction(row.id) : '')}
                          />
                        )}
                      </td>
                    )}
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

interface NestedObject {
  [key: string]: string | NestedObject
}

function renderNestedObject(obj: unknown): ReactNode {
  if (obj === null || typeof obj !== 'object') return

  const _obj = obj as NestedObject

  return (
    <div className="flex flex-col overflow-y-auto mt-1 me-4 h-auto">
      {Object.values(_obj).map((value, index) => {
        if (typeof value === 'object') {
          return <div key={index}>{renderNestedObject(value)}</div>
        } else {
          return (
            <span
              key={index}
              className="px-2 overflow-ellipsis text-base rounded-md bg-blue-500 text-white"
            >
              {value}
            </span>
          )
        }
      })}
    </div>
  )
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
