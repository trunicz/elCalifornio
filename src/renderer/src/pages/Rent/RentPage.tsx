/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppLayout,
  Button,
  Form,
  SearchBar,
  Table,
  submitObject,
  useModal
} from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useRentals } from '@renderer/hooks/useRentals'
import { ReactElement, useEffect, useState } from 'react'
import {
  LuBadgeDollarSign,
  LuCheckCircle2,
  LuMegaphone,
  LuMonitorDown,
  LuPencilLine,
  LuSettings2
} from 'react-icons/lu'
import { Link, useLocation, useParams } from 'wouter'
import { useContracts } from '@renderer/hooks/useContracts'
import supabase from '@renderer/utils/supabase'
import * as Yup from 'yup'
import { SubmitHandler } from 'react-hook-form'
import { useAuthStore } from '@renderer/stores/useAuth'
import { useLoadingStore } from '@renderer/stores/useLoading'
import { useUpdater } from '@renderer/hooks/useUpdater'
import { convertirNumeroALetras } from '@renderer/utils'
import { useBills } from '@renderer/stores/useBills'

export const RentPage = (): ReactElement => {
  const { getAllRentals, rentals, getRow } = useRentals()
  const [rentList, setRentList] = useState<unknown[] | null>(null)
  const { Modal, openModal, closeModal } = useModal()
  const { createContract } = useContracts()
  const { user } = useAuthStore()
  const { setLoading } = useLoadingStore()
  const { search } = useParams()
  const [, setLocation] = useLocation()
  const { updateDueRents } = useUpdater()
  const [isLoaded, setLoaded] = useState<boolean>(false)
  const { createBill } = useBills()

  const loadFunction = (): void => {
    getAllRentals().then((res) => {
      setRentList(res)
    })
    updateDueRents().then(() => setLoaded(true))
  }

  useEffect(() => {
    loadFunction()
  }, [])

  const endRent = async (id: string | number): Promise<any> => {
    setLoading(true)
    try {
      const row = await getRow(id)
      if (row) {
        setLoading(false)
        openModal(
          <CreateBillModal
            row={row}
            closeModal={closeModal}
            createBill={createBill}
            loadFunction={loadFunction}
          />
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  const downloadRentalContract = async (id: string | number): Promise<void> => {
    setLoading(true)
    try {
      const rent: any = rentList?.filter((rent: any) => rent.id === id)

      if (rent) {
        const formData1 = {
          ...rent[0].formdata,
          folio: rent[0].id,
          total_cost_number: Number(rent[0].formdata.total_cost) ?? 0,
          total_cost: convertirNumeroALetras(Number(rent[0].formdata.total_cost) ?? 0)
        }

        console.log(formData1)

        await createContract(formData1, `Contrato_${rent[0].id}`).then(() => {
          setLoading(false)
        })
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const callRentalUser = async (id: string | number): Promise<void> => {
    const rent: any = rentList?.filter((rent: any) => rent.id === id)

    if (rent) {
      const data = rent[0]
      const a = document.createElement('a')
      a.href = 'tel:' + data.cliente_tel
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      submitLog()
    }
  }

  const submitLog = (): void => {
    const logSchema = Yup.object().shape({
      status: Yup.string(),
      notes: Yup.string()
    })
    const submit: SubmitHandler<submitObject> = async (data: any): Promise<void> => {
      const values: any = [
        {
          action: 'Contactar Cliente',
          note: data.notes ? data.notes : 'Sin Descripción',
          status: data.status,
          user_id: user?.id
        }
      ]

      await supabase
        .from('logs')
        .insert(values)
        .then(({ error }) => {
          if (error) {
            throw error
          }
          openModal(
            <div>
              <span className="animate-fade-up text-6xl mb-4 flex justify-center text-green-500">
                <LuCheckCircle2 />
              </span>
              <h3>¡La acción se realizo con éxito!</h3>
              <Button
                className="mt-4"
                color="success"
                text="Aceptar"
                onClick={() => closeModal()}
              />
            </div>
          )
        })
    }
    openModal(
      <>
        <p className="flex flex-start text-lg -mb-2">Intento de Contacto</p>
        <Form
          className=""
          hasRequiereMessage={false}
          formDirection="col"
          onSubmit={submit}
          validationSchema={logSchema}
          fields={[
            {
              name: 'status',
              label: 'Estado',
              as: 'select',
              options: [
                { value: 'COMPLETADO', label: 'Completado' },
                { value: 'INCOMPLETO', label: 'Incompleto' }
              ]
            },
            {
              name: 'notes',
              label: 'Nota',
              as: 'textarea'
            }
          ]}
        >
          <div className="flex gap-4">
            <Button type="button" color="danger" text="cancelar" onClick={() => closeModal()} />
            <Button color="success" text="continuar" />
          </div>
        </Form>
      </>
    )
  }

  const openMore = (id: string | number): void => {
    openModal(
      <div className="grid  gap-4">
        <Button
          color="warning"
          icon={<LuPencilLine className="text-3xl" />}
          className="animate-fade animate-duration-100  p-8 flex items-center justify-start text-2xl"
          onClick={() => setLocation('/rent/edit/' + id)}
          iconLeft
          text="Editar"
        />
        <Button
          color="info"
          icon={<LuMonitorDown className="text-3xl" />}
          className="animate-fade animate-duration-100 text-nowrap p-8 flex items-center justify-start text-2xl  "
          onClick={() => downloadRentalContract(id)}
          iconLeft
          text="Descargar Contrato"
        />
        <Button
          color="success"
          icon={<LuMegaphone className="text-3xl" />}
          className="animate-fade animate-duration-100  p-8 flex items-center justify-start text-2xl  "
          onClick={() => callRentalUser(id)}
          iconLeft
          text="Contactar"
        />
      </div>
    )
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Rentas" hasAddButton={true} addRoute="/rents/create">
          <SearchBar
            searchFunction={setRentList}
            data={rentals}
            initialValue={search ? search : ''}
          />
          <Link
            to="/rentals/history"
            className="ms-4 flex items-center justify-center hover:bg-gray-500 px-4 w-auto rounded-xl h-full bg-gray-400 text-nowrap text-white font-medium active:scale-95 transition-all gap-1"
          >
            Historial de Rentas
          </Link>
        </AppLayout.PageOptions>
        <Modal title="Renta" className="w-auto min-w-[500px]" />
        {isLoaded && rentList ? (
          <Table
            data={rentList}
            hiddenKeys={[
              'id',
              'arrendatario',
              'cliente_tel',
              'formdata',
              'dirección',
              'deleted_at',
              'anticipo',
              'iscompleted'
            ]}
            deleteFunction={endRent}
            watchFunction={openMore}
            canSeeEdit={false}
            customDeleteBtn={{
              icon: <LuBadgeDollarSign className="text-green-500" />,
              title: 'Cobrar',
              className: 'hover:bg-green-100 border-none p-4'
            }}
            customMoreBtn={{
              icon: <LuSettings2 className="text-blue-500 " />,
              title: 'Opciones',
              className: 'hover:bg-blue-100 border-none p-4'
            }}
          />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
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
    const ref_contrato = `contrato${fecha_inicial.replaceAll('/', '')}${cliente[0]}${id}`

    console.log(data)

    const formatDate = (date: string): string => {
      if (date === '') {
        return ''
      }
      const [year, month, day] = date.split('-')
      // TODO: Convertir - a /, pero el año como pasaría con formato de dos cifras o de 4 cifras.
      return Number(year) > 1000 ? `${day}/${month}/${year}` : date.replaceAll('-', '/')
    }

    const subtotal = data.iva_incluido ? data.cantidad / 1.16 : data.cantidad
    const total = data.iva_incluido ? data.cantidad : data.cantidad * 1.16

    const bill = {
      rent_id: id,
      cliente,
      concepto: data.concepto,
      cantidad: convertirNumeroALetras(data.cantidad), // TODO: Pendiente decirle si con iva incluído o no.
      forma_pago: data.forma_pago,
      factura: data.factura,
      razon_social: data.razon_social,
      recibidor: user?.user_metadata.name
        ? user?.user_metadata.name + ' ' + user?.user_metadata.last_name
        : 'ElCalifornio',
      cliente_firma: cliente,
      sub_total: subtotal.toFixed(2),
      iva: (data.cantidad * 0.16).toFixed(2),
      ref_contrato,
      estatus:
        data.concepto === 'RENOVACIÓN/ENTREGA' || data.concepto === 'RENOVACIÓN'
          ? 'VIGENCIA'
          : 'ENTREGADO',
      fecha_vencimiento: fecha_final,
      fecha_extension: formatDate(data.fecha_extension), // TODO: Si no has puesto la fecha, que.
      dia: new Date().getDate(),
      mes: new Date().getMonth() + 1,
      anio: new Date().getFullYear(),
      total: total.toFixed(2)
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
          placeholder: '500',
          isVisible: true
        },
        {
          name: 'fecha_extension',
          label: 'Fecha Extension/Termino',
          as: 'input',
          type: 'date'
        },
        {
          name: 'iva_incluido',
          label: 'IVA incluído',
          as: 'input',
          type: 'checkbox',
          className: 'col-span-full'
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

// interface NestedObject {
//   [key: string]: string | NestedObject
// }

// function renderNestedObject(obj: any): ReactNode {
//   if (obj === null || typeof obj !== 'object') return obj

//   const _obj = obj as NestedObject

//   return (
//     <div className="grid auto-cols-fr overflow-hidden auto-rows-min gap-1">
//       {Object.values(_obj).map((value, index) => {
//         if (typeof value === 'object') {
//           return <div key={index}>{renderNestedObject(value)}</div>
//         } else {
//           return (
//             <span key={index} className="bg-gray-200 p-2 rounded-lg">
//               {value}
//             </span>
//           )
//         }
//       })}
//     </div>
//   )
// }
