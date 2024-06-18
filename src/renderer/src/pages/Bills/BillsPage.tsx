/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppLayout, Button, Form, useModal } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useContracts } from '@renderer/hooks/useContracts'
import { useAuthStore } from '@renderer/stores/useAuth'
import { useBills } from '@renderer/stores/useBills'
import { cn, convertirNumeroALetras } from '@renderer/utils'
import { Fragment, ReactElement, useEffect, useState } from 'react'
import { LuBadgeDollarSign, LuDownloadCloud } from 'react-icons/lu'
import * as Yup from 'yup'

export const BillsPage = (): ReactElement => {
  const { bills, getAllBills } = useBills()
  const [headers, setHeaders] = useState<any[]>()
  const hiddenKeys = ['id', 'equipo', 'recibos', 'iscompleted']
  const { Modal, openModal, closeModal } = useModal()
  const { createBill } = useBills()
  const { createBillPdf } = useContracts()

  useEffect(() => {
    load()
  }, [])

  function load(): void {
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
    })
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Recibos" hasAddButton={false} />
        <Modal title="Crear Recibo" className="w-1/2 xl:w-1/3" />
        {bills && headers ? (
          <section className="flex flex-col gap-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="uppercase bg-white shadow-md sticky top-0">
                <tr className="text-center text-stroke">
                  {headers.map((head, index) => (
                    <th
                      className="px-6 py-5 font-medium text-nowrap text-center"
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
                      openModal={openModal}
                      closeModal={closeModal}
                      createBill={createBill}
                      loadFunction={load}
                      createBillPdf={createBillPdf}
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
  openModal,
  closeModal,
  createBill,
  loadFunction,
  createBillPdf,
  ...props
}: {
  row: any
  hiddenKeys: string[]
  headers: string[]
  openModal: (i: ReactElement) => void
  closeModal: () => Promise<void>
  createBill: any
  loadFunction: any
  createBillPdf: any
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
            <td className="px-6 py-4 text-nowrap text-center" key={`itm${colIndex}`}>
              {row[key]}
            </td>
          ))}
        <td className="px-6 py-4 flex gap-2 items-center justify-center">
          <Button
            type="button"
            className={cn('border-0 p-4 rounded-xl text-green-500 hover:bg-green-500')}
            disabled={row.estado_actual === 'COMPLETADO'}
            icon={<LuBadgeDollarSign />}
            isIconOnly={true}
            title={'Cobrar/Crear Recibo'}
            onClick={(event) => {
              event.stopPropagation()
              openModal(
                <CreateBillModal
                  createBill={createBill}
                  row={row}
                  closeModal={closeModal}
                  loadFunction={loadFunction}
                />
              )
            }}
          />
        </td>
      </tr>
      {row.recibos && isVisible && (
        <tr className="animate animate-duration-300 animate-fade">
          <td colSpan={headers.length + 1}>
            <div className="p-4 bg-gray-50 flex flex-col gap-4">
              {row.recibos?.map((recibo: any, index: number) => (
                <div key={index} className="mb-2 border p-4 bg-white rounded-xl flex">
                  <div>
                    <div className="flex items-center mb-1">
                      <strong className="text-gray-700 w-24">Cliente:</strong>
                      <span className="text-gray-900">{recibo.cliente}</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <strong className="text-gray-700 w-24">Monto:</strong>
                      <span className="text-gray-900">${recibo.monto}</span>
                    </div>
                    <div className="flex items-center">
                      <strong className="text-gray-700 w-24">Fecha:</strong>
                      <span className="text-gray-900">{getDate(recibo.fecha)}</span>
                    </div>
                  </div>
                  <div className="ms-auto me-4">
                    <button
                      className="h-full px-4 rounded-xl text-center text-xl flex justify-center items-center hover:bg-gray-100 transition-all active:bg-gray-200/75 hover:text-blue-600"
                      onClick={() => {
                        const formData = {
                          ...recibo.formData,
                          numero_contrato: recibo.formData.id,
                          ref_contrato: `Contrato #${recibo.formData.rent_id}`
                        }
                        const folio = formData.id
                        delete formData.id
                        delete formData.rent_id
                        delete formData.created_at
                        createBillPdf(formData, `Recibo_${folio}`)
                      }}
                    >
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

const CreateBillModal = ({
  closeModal,
  row,
  createBill,
  loadFunction
}: {
  closeModal: () => Promise<void>
  row: any
  createBill: any
  loadFunction: any
}): ReactElement => {
  const { user } = useAuthStore()

  const billSchema = Yup.object().shape({
    // cliente: Yup.string().required('Es un valor Obligatorio'),
    concepto: Yup.string(),
    cantidad: Yup.number().positive().integer(),
    forma_pago: Yup.string(),
    factura: Yup.string(),
    razon_social: Yup.string(),
    // recibidor: Yup.string(),
    // cliente_firma: Yup.string(),
    // sub_total: Yup.number(),
    // iva: Yup.number(),
    // ref_contrato: Yup.string(),
    // estatus: Yup.string(),
    // fecha_vencimiento: Yup.string(),
    fecha_extension: Yup.string()
  })

  const submit = (data: any): void => {
    const { cliente, fecha_final, fecha_inicial, id } = row
    console.log(row)

    console.log(fecha_inicial)

    const ref_contrato = `contrato${fecha_inicial.replaceAll('/', '')}${cliente[0]}${id}`

    const recibidor =
      user?.user_metadata.name && user?.user_metadata.lastname
        ? user?.user_metadata.name + ' ' + user?.user_metadata.lastname
        : 'ElCalifornio'

    console.log(recibidor)

    const bill = {
      rent_id: id,
      cliente,
      concepto: data.concepto,
      cantidad: convertirNumeroALetras(data.cantidad),
      forma_pago: data.forma_pago,
      factura: data.factura,
      razon_social: data.razon_social,
      recibidor,
      cliente_firma: cliente,
      sub_total: data.cantidad.toFixed(2),
      iva: (data.cantidad * 0.16).toFixed(2),
      ref_contrato,
      estatus:
        data.concepto === 'RENOVACIÓN/ENTREGA' || data.concepto === 'RENOVACIÓN'
          ? 'VIGENCIA'
          : 'ENTREGADO',
      fecha_vencimiento: fecha_final,
      fecha_extension: data.fecha_extension.replaceAll('-', '/'),
      dia: new Date().getDate(),
      mes: new Date().getMonth() + 1,
      anio: new Date().getFullYear(),
      total: (data.cantidad + data.cantidad * 0.16).toFixed(2)
    }
    createBill(bill).then(() => {
      closeModal().then(() => loadFunction())
    })
  }
  return (
    <Form
      className="mx-auto overflow-y-auto auto-rows-max grid md:grid-cols-2 lg:grid-cols-2 gap-2"
      hasRequiereMessage={false}
      formDirection="col"
      onSubmit={submit}
      validationSchema={billSchema}
      fields={[
        {
          name: 'concepto',
          label: 'Concepto',
          as: 'select',
          options: [
            { value: 'RENOVACIÓN/ENTREGA', label: 'RENOVACIÓN Y ENTREGA PARCIAL' },
            { value: 'RENOVACIÓN', label: 'RENOVACIÓN' },
            { value: 'FINIQUITO', label: 'FINIQUITO' },
            { value: 'ABONO', label: 'ABONO' }
          ],
          className: 'col-span-full'
        },
        {
          name: 'forma_pago',
          label: 'Forma de pago',
          as: 'select',
          options: [
            { value: 'EFECTIVO', label: 'EFECTIVO' },
            { value: 'TRANSFERENCIA', label: 'TRANSFERENCIA' },
            { value: 'TARJETA DE CRÉDITO', label: 'TARJETA DE CRÉDITO' },
            { value: 'TARJETA DE DÉBITO', label: 'TARJETA DE DÉBITO' }
          ]
        },
        {
          name: 'factura',
          label: 'Factura',
          as: 'select',
          options: [
            { value: 'Si', label: 'Si' },
            { value: 'No', label: 'No' }
          ]
        },
        {
          name: 'cantidad',
          label: 'Cantidad',
          as: 'input',
          type: 'number',
          placeholder: '500'
        },
        {
          name: 'fecha_extension',
          label: 'Fecha Extension/Termino',
          as: 'input',
          type: 'date'
        },
        {
          name: 'razon_social',
          label: 'Razon Social',
          as: 'input',
          type: 'text',
          className: 'col-span-full'
        }
      ]}
    >
      <div className="flex gap-4 col-span-full">
        <Button color="danger" type="button" text="Cancelar" onClick={closeModal} />
        <Button color="success" type="submit" text="Enviar" />
      </div>
    </Form>
  )
}
