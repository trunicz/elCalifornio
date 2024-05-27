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
import { LuCheckCircle, LuCheckCircle2, LuFileSignature, LuPhoneCall } from 'react-icons/lu'
import { FiWatch } from 'react-icons/fi'
import { Link } from 'wouter'
import { IoWarning } from 'react-icons/io5'
import { useContracts } from '@renderer/hooks/useContracts'
import supabase from '@renderer/utils/supabase'
import * as Yup from 'yup'
import { SubmitHandler } from 'react-hook-form'
import { useAuthStore } from '@renderer/stores/useAuth'
import { useLoadingStore } from '@renderer/stores/useLoading'

export const RentPage = (): ReactElement => {
  const { getAllRentals, rentals, deleteRental } = useRentals()
  const [rentList, setRentList] = useState<unknown[] | null>(null)
  const { Modal, openModal, closeModal } = useModal()
  const { createContract } = useContracts()
  const { user } = useAuthStore()
  const { setLoading } = useLoadingStore()

  useEffect(() => {
    getAllRentals().then((res) => setRentList(res))
  }, [])

  const deleteFunction = (id: string | number): void => {
    deleteRental(id).then(() => {
      getAllRentals().then((res) => {
        setRentList(res)
        openModal(
          <>
            <div>
              <span className="animate-fade-up animate-duration-200 text-6xl mb-4 flex justify-center text-green-500">
                <LuCheckCircle />
              </span>
              <h3>¡Termino la renta Correctamente!</h3>
              <Button
                className="mt-4"
                color="success"
                text="Aceptar"
                onClick={() => closeModal()}
              />
            </div>
          </>
        )
      })
    })
  }

  const endRent = (id: string | number): void => {
    openModal(
      <>
        <div className="flex flex-col gap-4">
          <div className="flex-1 animate-jump flex justify-center items-center text-9xl text-amber-500">
            <IoWarning />
          </div>
          <div className="">
            <p>Al realizar esta acción no se podrá deshacer</p>
            <p>¿Quiere continuar?</p>
          </div>
          <div className="flex gap-2">
            <Button
              className="animate-fade animate-ease-out animate-duration-200"
              color="danger"
              text="cancelar"
              onClick={closeModal}
            />
            <Button
              className="animate-fade animate-ease-out animate-duration-200"
              color="success"
              text="aceptar"
              onClick={() => deleteFunction(id)}
            />
          </div>
        </div>
      </>
    )
  }

  const watchRental = async (id: string | number): Promise<void> => {
    setLoading(true)
    const rent: any = rentList?.filter((rent: any) => rent.id === id)

    if (rent) {
      await createContract(
        rent[0].formdata,
        `Contrato${rent[0].formdata.day}${rent[0].formdata.month}${rent[0].formdata.year}${rent[0].cliente[0]}${rent[0].id}`
      ).then(() => {
        setLoading(false)
      })
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
        />
      </>
    )
  }

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Rentas" hasAddButton={true} addRoute="/rent/create">
          <SearchBar searchFunction={setRentList} data={rentals} />
          <Link
            to="/rentals/history"
            className="ms-4 flex items-center justify-center hover:bg-gray-500 px-4 w-auto rounded-xl h-full bg-gray-400 text-nowrap text-white font-medium active:scale-95 transition-all gap-1"
          >
            Historial de Rentas
          </Link>
        </AppLayout.PageOptions>
        <Modal title="Renta" className="w-[500px]" />
        {rentList ? (
          <Table
            data={rentList}
            hiddenKeys={['id', 'arrendatario', 'cliente_tel', 'formdata', 'dirección', 'anticipo']}
            deleteFunction={endRent}
            watchFunction={watchRental}
            editFunction={callRentalUser}
            customDeleteBtn={{ icon: <FiWatch />, title: 'Terminar Renta' }}
            customMoreBtn={{ icon: <LuFileSignature />, title: 'Descargar Contrato' }}
            customEditBtn={{ icon: <LuPhoneCall />, title: 'Llamar a cliente' }}
          />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
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
