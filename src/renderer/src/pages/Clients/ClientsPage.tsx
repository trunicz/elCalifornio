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
import { useClients } from '@renderer/hooks'
import { useAuthStore } from '@renderer/stores/useAuth'
import { useLoadingStore } from '@renderer/stores/useLoading'
import supabase from '@renderer/utils/supabase'
import { ReactElement, useEffect, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { IoMegaphone, IoWarning } from 'react-icons/io5'
import {
  LuCheckCircle2,
  LuDownload,
  LuFolder,
  LuSkull,
  LuUpload,
  LuUserX,
  LuX
} from 'react-icons/lu'
import { Link, useLocation, useParams } from 'wouter'
import * as Yup from 'yup'

export const ClientsPage = (): ReactElement => {
  const [, setLocation] = useLocation()
  const [clients, setClients] = useState<unknown[] | null>([])
  const {
    clientList,
    getAllClients,
    deleteClient,
    getClientById,
    getAllFiles,
    download,
    removeFile,
    uploadFiles,
    banClientById,
    addStrikes
  } = useClients()
  const { Modal, openModal, closeModal } = useModal()
  const { user } = useAuthStore()
  const { setLoading } = useLoadingStore()
  const [reloadPage, setReloadPage] = useState<boolean>()
  const { search } = useParams()

  useEffect(() => {
    getAllClients().then((response) => setClients(response))
  }, [reloadPage])

  const preview = (id: string | number, src: string): void => {
    openModal(
      <div className="overflow-y-auto w-auto flex flex-col justify-center">
        <img
          src={src}
          alt="img"
          className="h-[500px] object-cover rounded-xl"
          onError={(e: any) => {
            e.onError = null
            e.target.src = '/src/assets/noImage.jpeg'
          }}
        />
        <Button
          className="bg-gray-500 text-white hover:bg-gray-600 transition-all mt-2"
          text="volver"
          onClick={() => seeFiles(id)}
        />
      </div>
    )
  }
  const openFiles = (id: string | number): void => {
    openModal(
      <>
        <div className="flex items-center justify-center text-red-400 p-6 text-xl">
          No hay Archivos
        </div>
        <div className="flex gap-4">
          <Button color="danger" text="Cerrar" onClick={() => watchFunction(id)} />
          {user?.user_metadata.rol === '2' ? null : (
            <Button
              color="success"
              text="Subir Archivo"
              icon={<LuUpload />}
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.click()
                input.addEventListener('change', async (e) => {
                  const target = e.target as HTMLInputElement
                  const file = target.files

                  if (file && file.length > 0) {
                    try {
                      setLoading(true)
                      await uploadFiles(file, String(id)).then(() => {
                        setLoading(false)
                        openModal(
                          <div>
                            <span className="animate-fade-up text-6xl mb-4 flex justify-center text-green-500">
                              <LuCheckCircle2 />
                            </span>
                            <h3>¡El cliente se elimino con éxito!</h3>
                            <Button
                              className="mt-4"
                              color="success"
                              text="Aceptar"
                              onClick={() => {
                                seeFiles(id)
                              }}
                            />
                          </div>
                        )
                      })
                    } catch (error) {
                      console.error(error)
                    }
                  }
                })
              }}
            />
          )}
        </div>
      </>
    )
  }

  const seeFiles = (id: string | number): void => {
    getAllFiles(id).then((prom: object[]) => {
      const files = Array.from(prom)
      if (files.length > 0) {
        openModal(
          <div className="flex flex-col gap-4 h-auto">
            <div className="overflow-y-auto flex flex-col gap-4">
              {files.map((file: any, index) => {
                const imageURL =
                  import.meta.env.VITE_SUPABASE_URL +
                  '/storage/v1/object/public/clients_storage/clients/' +
                  id +
                  '/' +
                  file.name

                return (
                  <section
                    key={file.name + index}
                    className="transition-all flex border overflow-hidden rounded-xl hover:bg-gray-100"
                  >
                    <div
                      className="flex flex-1 items-center h-[70px]"
                      onClick={() => preview(id, imageURL)}
                    >
                      <div className="w-24 flex justify-center items-center border-r">
                        <img
                          className="object-cover h-full"
                          draggable={false}
                          src={imageURL}
                          onError={(e: any) => {
                            e.onError = null
                            e.target.src = '/src/assets/noImage.jpeg'
                          }}
                          alt={file.name}
                        />
                      </div>
                      <h3 className="text-xl w-full p-2">{file.name}</h3>
                    </div>
                    <button
                      className="w-24 text-center text-xl flex justify-center items-center hover:bg-gray-200 transition-all active:bg-gray-300/75 hover:text-blue-600"
                      onClick={() =>
                        download(id, file.name).then((blob) => {
                          setLoading(true)
                          try {
                            const url = window.URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.style.display = 'none'
                            a.href = url
                            a.download = file.name
                            document.body.appendChild(a)
                            a.click()
                            setLoading(false)
                            window.URL.revokeObjectURL(url)
                          } catch (error) {
                            console.log(error)
                          }
                        })
                      }
                    >
                      <LuDownload />
                    </button>
                    <button
                      className="w-24 text-center text-xl flex justify-center items-center hover:bg-gray-200 transition-all active:bg-red-300/75 hover:text-red-600"
                      onClick={() => {
                        openModal(
                          <>
                            <div className="flex flex-col gap-4">
                              <div className="flex-1 animate-jump flex justify-center items-center text-9xl text-amber-500">
                                <IoWarning />
                              </div>
                              <div>
                                <p>Al realizar esta acción no se podrá deshacer</p>
                                <p>¿Quiere continuar?</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  className="animate-fade animate-ease-out animate-duration-200"
                                  color="danger"
                                  text="cancelar"
                                  onClick={() => seeFiles(id)}
                                />
                                <Button
                                  className="animate-fade animate-ease-out animate-duration-200"
                                  color="success"
                                  text="aceptar"
                                  onClick={() => {
                                    removeFile(id, file.name).then(() => {
                                      openModal(
                                        <div>
                                          <span className="animate-fade-up text-6xl mb-4 flex justify-center text-green-500">
                                            <LuCheckCircle2 />
                                          </span>
                                          <h3>¡El cliente se elimino con éxito!</h3>
                                          <Button
                                            className="mt-4"
                                            color="success"
                                            text="Aceptar"
                                            onClick={() => seeFiles(id)}
                                          />
                                        </div>
                                      )
                                    })
                                  }}
                                />
                              </div>
                            </div>
                          </>
                        )
                      }}
                    >
                      <LuX />
                    </button>
                  </section>
                )
              })}
            </div>
            <Button
              color="success"
              text="Subir Archivo"
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.click()
                input.addEventListener('change', async (e) => {
                  const target = e.target as HTMLInputElement
                  const file = target.files

                  if (file && file.length > 0) {
                    try {
                      setLoading(true)
                      await uploadFiles(file, String(id)).then(() => {
                        setLoading(false)
                        openModal(
                          <div>
                            <span className="animate-fade-up text-6xl mb-4 flex justify-center text-green-500">
                              <LuCheckCircle2 />
                            </span>
                            <h3>¡El cliente se elimino con éxito!</h3>
                            <Button
                              className="mt-4"
                              color="success"
                              text="Aceptar"
                              onClick={() => {
                                seeFiles(id)
                              }}
                            />
                          </div>
                        )
                      })
                    } catch (error) {
                      console.error(error)
                    }
                  }
                })
              }}
            />
          </div>
        )
      } else {
        openFiles(id)
      }
    })
  }

  const watchFunction = (id: string | number): void => {
    getClientById(id).then((res) => {
      if (res) {
        const client = res[0]
        openModal(
          <>
            {/* {JSON.stringify(client)} */}
            <p className="text-lg flex gap-4">
              <span className="font-medium text-nowrap w-1/3 text-start">Nombre:</span>
              <span className="bg-gray-100 px-2  rounded-md">
                {client.name + ' ' + client.last_name}
              </span>
            </p>
            <p className="text-lg flex gap-4">
              <span className="font-medium text-nowrap w-1/3 text-start">Teléfono:</span>
              <span className="bg-gray-100 px-2  rounded-md">{client.phone}</span>
            </p>
            <p className="text-lg flex gap-4">
              <span className="font-medium text-nowrap w-1/3 text-start">Foráneo:</span>
              <span className="bg-gray-100 px-2  rounded-md">{client.isForeign ? 'Si' : 'No'}</span>
            </p>
            <p className="text-lg flex gap-4">
              <span className="font-medium text-nowrap w-1/3 text-start">Tipo de Cliente:</span>
              <span className="bg-gray-100 px-2  rounded-md">
                {client.client_type[0].type_name}
              </span>
            </p>
            <p className="text-lg flex gap-4">
              <span className="font-medium text-nowrap w-1/3 text-start">Dirección:</span>
              <span className="bg-gray-100 px-2  rounded-md">{client.address}</span>
            </p>
            <div className="grid grid-cols-3 gap-2 border-t-2  pt-4 text-xl ">
              <button
                className="bg-blue-500 border-0 text-xl w-full rounded-lg flex items-center gap-2  px-4 p-2 transition-all active:scale-95 text-white  hover:bg-blue-600 col-span-1"
                color="warning"
                onClick={() => seeFiles(id)}
              >
                <LuFolder />
                Archivos
              </button>
              <a
                className="bg-green-500 border-0 text-xl w-full rounded-lg flex items-center gap-2  px-4 p-2 transition-all active:scale-95 text-white  hover:bg-green-600 col-span-2"
                href={'tel:' + client.phone}
                onClick={() => submitLog(id)}
              >
                <IoMegaphone />
                Contactar con el cliente
              </a>
              {user?.user_metadata.rol === '2' ? null : (
                <>
                  <button
                    className="bg-red-500 border-0 text-xl w-full rounded-lg flex items-center gap-2  px-4 p-2 transition-all active:scale-95 text-white  hover:bg-red-600 col-span-1"
                    onClick={() => {
                      openModal(
                        <>
                          <div className="flex flex-col gap-4">
                            <div className="flex-1 animate-jump flex justify-center items-center text-9xl text-amber-500">
                              <IoWarning />
                            </div>
                            <div>
                              <p>¿Esta seguro de realizar esta acción?</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                className="animate-fade animate-ease-out animate-duration-200"
                                color="danger"
                                text="cancelar"
                                onClick={() => watchFunction(id)}
                              />
                              <Button
                                className="animate-fade animate-ease-out animate-duration-200"
                                color="success"
                                text="aceptar"
                                onClick={() =>
                                  addStrikes(id).then(() =>
                                    closeModal().then(() => setReloadPage(!reloadPage))
                                  )
                                }
                              />
                            </div>
                          </div>
                        </>
                      )
                    }}
                  >
                    <LuUserX />
                    Dar Strike
                  </button>
                  <button
                    className="bg-black border-0 text-xl w-full rounded-lg flex items-center gap-2  px-4 p-2 transition-all active:scale-95 text-white  hover:bg-gray-800 col-span-2"
                    onClick={() => {
                      openModal(
                        <>
                          <div className="flex flex-col gap-4">
                            <div className="flex-1 animate-jump flex justify-center items-center text-9xl text-amber-500">
                              <IoWarning />
                            </div>
                            <div>
                              <p>¿Esta seguro de realizar esta acción?</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                className="animate-fade animate-ease-out animate-duration-200"
                                color="danger"
                                text="cancelar"
                                onClick={() => watchFunction(id)}
                              />
                              <Button
                                className="animate-fade animate-ease-out animate-duration-200"
                                color="success"
                                text="aceptar"
                                onClick={() =>
                                  banClientById(id).then(() =>
                                    closeModal().then(() => setReloadPage(!reloadPage))
                                  )
                                }
                              />
                            </div>
                          </div>
                        </>
                      )
                    }}
                  >
                    <LuSkull />
                    Enviar a lista negra
                  </button>
                </>
              )}
            </div>
          </>
        )
      }
    })
  }
  const submitLog = (id: string | number): void => {
    const logSchema = Yup.object().shape({
      status: Yup.string(),
      notes: Yup.string(),
      client_id: Yup.number()
    })

    const submit: SubmitHandler<submitObject> = async (data: any): Promise<void> => {
      const values: any = [
        {
          action: 'Contactar Cliente',
          note: data.notes ? data.notes : 'Sin Descripción',
          status: data.status,
          user_id: user?.id,
          client_id: Number(id)
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
            <button
              type="button"
              className="bg-red-500 flex justify-center border-0 text-xl w-full rounded-lg items-center gap-2  px-4 p-2 transition-all active:scale-[98%] text-white  hover:bg-red-600 col-span-1"
              onClick={() => watchFunction(id)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-500 flex justify-center border-0 text-xl w-full rounded-lg items-center gap-2  px-4 p-2 transition-all active:scale-[98%] text-white  hover:bg-green-600 col-span-1"
            >
              Continuar
            </button>
          </div>
        </Form>
      </>
    )
  }

  const editFunction = (id: string | number): void => {
    setLocation('/clients/' + id)
  }

  const remove = async (id: string | number): Promise<void> => {
    setClients(null)
    closeModal().then(async () => {
      await deleteClient(id).then(async () => {
        await getAllClients().then((res) => setClients(res))
        openModal(
          <div>
            <span className="animate-fade-up text-6xl mb-4 flex justify-center text-green-500">
              <LuCheckCircle2 />
            </span>
            <h3>¡El cliente se elimino con éxito!</h3>
            <Button className="mt-4" color="success" text="Aceptar" onClick={() => closeModal()} />
          </div>
        )
      })
    })
  }

  const deleteFunction = async (id: string | number): Promise<void> => {
    openModal(
      <>
        <div className="flex flex-col gap-4">
          <div className="flex-1 animate-jump flex justify-center items-center text-9xl text-amber-500">
            <IoWarning />
          </div>
          <div>
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
              onClick={() => remove(id)}
            />
          </div>
        </div>
      </>
    )
  }
  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions
          pageTitle="Clientes"
          addRoute="/clients/create"
          hasAddButton={user?.user_metadata.rol !== '2'}
        >
          <SearchBar
            searchFunction={setClients}
            data={clientList}
            initialValue={search ? search : ''}
          />
          {user?.user_metadata.rol === '2' ? null : (
            <Link
              to="/client/bl/blacklist"
              className="ms-4 flex items-center justify-center hover:bg-gray-500 px-4 w-auto rounded-xl h-full bg-gray-400 text-nowrap text-white font-medium active:scale-95 transition-all gap-1"
            >
              <span className="text-xl">
                <LuSkull />
              </span>
              Lista Negra
            </Link>
          )}
        </AppLayout.PageOptions>
        <Modal title="Cliente" className="w-auto min-w-[450px]" />
        {clientList ? (
          <Table
            data={clients}
            watchFunction={watchFunction}
            deleteFunction={deleteFunction}
            editFunction={editFunction}
            canSeeEdit={user?.user_metadata.rol === '2' ? false : true}
            canSeeDelete={user?.user_metadata.rol === '2' ? false : true}
            hiddenKeys={['tipo_cliente', 'foráneo', 'id']}
          />
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}
