/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppLayout, Button } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useBills } from '@renderer/stores/useBills'
import { Fragment, ReactElement, useEffect, useState } from 'react'
import { LuBadgeDollarSign, LuDownloadCloud } from 'react-icons/lu'

export const BillsPage = (): ReactElement => {
  const { bills, getAllBills } = useBills()
  const [headers, setHeaders] = useState<any[]>()
  const hiddenKeys = ['id', 'equipo', 'recibos']

  useEffect(() => {
    getAllBills().then((res: any) => {
      setHeaders(
        res
          ? Array.from(
              new Set(
                res
                  .flatMap((n: object) => Object.keys(n))
                  .filter((key: string) => !hiddenKeys?.includes(key))
              )
            )
          : []
      )
      console.log(res)
    })
  }, [])

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Recibos" hasAddButton={false} />
        {bills && headers ? (
          <section className="flex flex-col gap-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="uppercase bg-white shadow-md sticky top-0">
                <tr className="text-center text-stroke">
                  {headers.map((head, index) => (
                    <th
                      className="px-6 py-5 font-medium text-nowrap text-start"
                      key={`head${index}`}
                    >
                      {String(head).replaceAll('_', ' ')}
                    </th>
                  ))}
                  <th className="px-6 py-5 font-medium text-nowrap">Crear Recibo</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((row: any, rowIndex: number) =>
                  row ? (
                    <RenderBillRow
                      row={row}
                      key={`row${rowIndex}`}
                      hiddenKeys={hiddenKeys}
                      headers={headers}
                    />
                  ) : (
                    <tr key={rowIndex}>
                      <td colSpan={headers.length + 1}>
                        <Loading />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </section>
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}

const RenderBillRow = ({
  row,
  hiddenKeys,
  headers,
  ...props
}: {
  row: any
  hiddenKeys: string[]
  headers: string[]
}): ReactElement => {
  const [isVisible, setVisible] = useState<boolean>(false)

  const getDate = (d: string): string => {
    const date = new Date(d)
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour12: false
    }
    const formatter = new Intl.DateTimeFormat('default', options)
    return formatter.format(date)
  }

  return (
    <Fragment {...props}>
      <tr
        onClick={() => setVisible(!isVisible)}
        className="border-b text-stroke text-center hover:bg-gray-50  transition-all"
      >
        {Object.keys(row)
          .filter((key) => !hiddenKeys.includes(key))
          .map((key, colIndex) => (
            <td className="px-6 py-4 text-nowrap text-start" key={`itm${colIndex}`}>
              {row[key]}
            </td>
          ))}
        <td className="px-6 py-4 flex gap-2 items-center justify-center">
          <Button
            type="button"
            className="border-0 p-4 rounded-xl text-green-500 hover:bg-green-500"
            icon={<LuBadgeDollarSign />}
            isIconOnly={true}
            title={'Cobrar/Crear Recibo'}
            onClick={(event) => {
              event.stopPropagation()
            }}
          />
        </td>
      </tr>
      {row.recibos && isVisible && (
        <tr className="animate animate-duration-300 animate-fade">
          <td colSpan={headers.length + 1}>
            <div className="p-4 bg-gray-50 flex flex-col gap-4">
              {row.recibos.map((recibo: any, index: number) => (
                <div key={index} className="mb-2 border p-4 bg-white rounded-xl flex">
                  <div>
                    <div className="flex items-center mb-1">
                      <strong className="text-gray-700 w-24">Cliente:</strong>
                      <span className="text-gray-900">{recibo.cliente}</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <strong className="text-gray-700 w-24">Monto:</strong>
                      <span className="text-gray-900">${recibo.monto.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center">
                      <strong className="text-gray-700 w-24">Fecha:</strong>
                      <span className="text-gray-900">{getDate(recibo.fecha)}</span>
                    </div>
                  </div>
                  <div className="ms-auto me-4">
                    <button className="h-full px-4 rounded-xl text-center text-xl flex justify-center items-center hover:bg-gray-100 transition-all active:bg-gray-200/75 hover:text-blue-600">
                      <LuDownloadCloud />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
      {!row.recibos && isVisible && (
        <tr className="animate animate-duration-300 animate-fade">
          <td colSpan={headers.length + 1}>
            <div className="p-4 bg-gray-50">
              <div className="mb-2 p-4 border border-gray-200 bg-white rounded-xl flex">
                <div className="text-red-500 flex items-center justify-start w-full text-2xl">
                  Sin Recibos
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  )
}
