/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { AppLayout, Button } from '@renderer/components'
import { useInventory } from '@renderer/hooks/useInventory'
import { useLoadingStore } from '@renderer/stores/useLoading'
import { ReactElement, useEffect, useState } from 'react'
import { LuDollarSign, LuMinus, LuPlus } from 'react-icons/lu'
import Select from 'react-select'
import { useLocation } from 'wouter'
import * as yup from 'yup'
import { useFormik } from 'formik'

const inventorySchema = yup.object().shape({
  type: yup.string().required('El tipo de equipo es requerido'),
  dimension: yup.string().nullable(),
  reference: yup.string().nullable(),
  price_week: yup
    .number()
    .required('El precio por semana es requerido')
    .min(0, 'El precio no puede ser negativo'),
  price_days: yup
    .number()
    .required('El precio por 1 a 3 días es requerido')
    .min(0, 'El precio no puede ser negativo')
})

export const CreateEditInventoryPage = (): ReactElement => {
  const { getEquipmentTypes, getItemDimension, getPricesBy, createEquipment, createPrices } =
    useInventory()
  const [dimensions, setDimensions] = useState<{ value: string; label: string }[]>()
  const [options, setOptions] = useState<{ value: string; label: string }[]>()
  const [dimensionValue, setDimension] = useState<any>()
  const [description, setDescription] = useState<any>()
  const [selectedValue, setValue] = useState<any>()
  const [count, setCount] = useState<number | undefined>(1)
  const [prices, setPrices] = useState<any>({})
  const [, setLocation] = useLocation()
  const [parent] = useAutoAnimate()
  const { setLoading } = useLoadingStore()
  const [errorDimension, setErrorDimension] = useState<string | null>(null)

  useEffect(() => {
    setDimension(null)
    if (selectedValue) {
      getItemDimension(selectedValue.value).then((dimensions: any) => setDimensions(dimensions))
      getPricesBy(selectedValue.value).then((prices: any) => {
        setPrices(prices[0])
      })
    }
  }, [selectedValue])

  useEffect(() => {
    getEquipmentTypes().then((options: any) => {
      if (options) {
        setOptions(options)
      }
    })
  }, [])

  const formik = useFormik({
    initialValues: {
      type: '',
      dimension: '',
      reference: '',
      price_week: '',
      price_days: ''
    },
    validationSchema: inventorySchema,
    onSubmit: (values) => {
      setLoading(true)
      if (selectedValue) {
        if (dimensions && !dimensionValue) {
          setErrorDimension('La dimension es obligatoria')
        }

        const formValues = {
          type: selectedValue.value,
          dimension: dimensionValue ? dimensionValue.value : null,
          reference: description
        }

        createEquipment(formValues, count ? count : 0)
          .then(async (res) => {
            if (res && res.length > 0) {
              const promises = res.map(async (equipment: any) => {
                const { id } = equipment
                if (id) {
                  const newValues = {
                    ...prices,
                    equipment_id: id,
                    type_id: selectedValue.value,
                    price_days: values.price_days,
                    price_week: values.price_week
                  }
                  try {
                    await createPrices(newValues)
                  } catch (error) {
                    console.error('Error creating prices:', error)
                  }
                }
              })
              await Promise.all(promises)
              setLoading(false)
              setLocation('/inventory')
            }
          })
          .catch((error) => {
            setLoading(false)
            console.error('Error creating equipment:', error)
          })
      }
    },
    validateOnBlur: true,
    validateOnChange: true
  })

  useEffect(() => {
    if (!formik.isValid && formik.submitCount > 0) {
      setLoading(false)
    }
  }, [formik.isValid, formik.submitCount])

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Agregar Equipo" hasAddButton={false} />
        <form
          ref={parent}
          onSubmit={formik.handleSubmit}
          className="grid w-full mx-auto auto-rows-max mt-4 flex-1 overflow-y-auto gap-4"
        >
          <div className="w-1/2 mx-auto">
            <div ref={parent} className="col-span-full mb-4">
              <label className="text-lg">Tipo de Equipo</label>
              <Select
                placeholder={'Selecciona el equipo a registrar'}
                styles={{
                  control(base) {
                    return {
                      ...base,
                      borderRadius: '8px',
                      borderColor: '#e5e7eb',
                      borderWidth: '2px',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#e5e7eb'
                      }
                    }
                  }
                }}
                onChange={(e) => {
                  setValue(e)
                  formik.setFieldValue('type', e?.value || '')
                }}
                value={selectedValue}
                options={options}
              />
              {formik.touched.type && formik.errors.type ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.type}</div>
              ) : null}
            </div>
            {dimensions && dimensions?.length > 0 ? (
              <div ref={parent} className="col-span-full">
                <label className="text-lg">Dimensiones</label>
                <Select
                  placeholder={'Selecciona la dimension del ' + selectedValue?.label}
                  styles={{
                    control(base) {
                      return {
                        ...base,
                        borderRadius: '8px',
                        borderColor: '#e5e7eb',
                        borderWidth: '2px',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#e5e7eb'
                        }
                      }
                    }
                  }}
                  onChange={(e) => {
                    setDimension(e)
                    formik.setFieldValue('dimension', e?.value || '')
                  }}
                  value={dimensionValue}
                  options={dimensions}
                />
                <div className="text-red-500 text-sm mt-1">
                  {errorDimension && !dimensionValue ? errorDimension : null}
                </div>
              </div>
            ) : (
              selectedValue && (
                <div ref={parent} className="w-full grid">
                  <label className="text-lg">Descripción (Unica para cada equipo)</label>
                  <textarea
                    name="reference"
                    id="reference"
                    placeholder={'Escribe una descripción para ' + selectedValue.label}
                    onChange={(e) => {
                      setDescription(e.target.value)
                      formik.handleChange(e)
                    }}
                    onBlur={formik.handleBlur}
                    value={description}
                    rows={3}
                    className="outline-0 border-2 px-2 rounded-lg p-1 text-lg focus:bg-gray-100"
                  ></textarea>
                  {formik.touched.reference && formik.errors.reference ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.reference}</div>
                  ) : null}
                </div>
              )
            )}
            {selectedValue ? (
              <div ref={parent} className="mt-8">
                <p ref={parent} className="text-lg text-center col-span-full border-b">
                  Precios
                </p>
                <div ref={parent} className="flex gap-4 mt-4">
                  <div className="grid flex-1 relative">
                    <label className="text-lg">Por Semana</label>
                    <input
                      type="number"
                      className="ps-6 w-full focus:bg-gray-100 outline-0 border-2 px-2 rounded-lg p-1 text-lg"
                      name="price_week"
                      value={formik.values.price_week}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      min={0}
                    />
                    <LuDollarSign className="text-gray-400 absolute top-10 left-2" />
                    {formik.touched.price_week && formik.errors.price_week ? (
                      <div className="text-red-500 text-xs mt-1 absolute -bottom-6 left-0">
                        {formik.errors.price_week}
                      </div>
                    ) : null}
                  </div>
                  <div className="grid flex-1 relative">
                    <label className="text-lg">De 1 a 3 Dias</label>
                    <input
                      type="number"
                      className="ps-6 w-full focus:bg-gray-100 outline-0 border-2 px-2 rounded-lg p-1 text-lg"
                      name="price_days"
                      value={formik.values.price_days}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      min={0}
                    />
                    <LuDollarSign className="text-gray-400 absolute top-10 left-2" />
                    {formik.touched.price_days && formik.errors.price_days ? (
                      <div className="text-red-500 text-xs mt-1 absolute -bottom-6 left-0">
                        {formik.errors.price_days}
                      </div>
                    ) : null}
                  </div>
                </div>
                <p className="text-lg text-center col-span-full border-b mt-8">Cantidad</p>
                <div className="flex">
                  <div className="flex items-center py-6 gap-4 mx-auto">
                    <button
                      type="button"
                      onClick={() => setCount(count ? count - 1 : 0)}
                      className="transition-all bg-gray-200 p-4 rounded-lg  hover:bg-gray-300/70 active:bg-red-200 active:scale-90 "
                    >
                      <LuMinus />
                    </button>
                    <input
                      className="p-2 text-lg outline-none border-2 rounded-lg text-center"
                      type="text"
                      onChange={(e) => setCount(parseFloat(e.target.value) ?? 0)}
                      value={count}
                      disabled
                      pattern="\d*"
                    />
                    <button
                      type="button"
                      onClick={() => setCount(count ? count + 1 : 1)}
                      className="transition-all bg-gray-200 p-4 rounded-lg  hover:bg-gray-300/70 active:bg-green-200 active:scale-90 "
                    >
                      <LuPlus />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <Button
            type="submit"
            className="fixed z-[5] end-4 bottom-4 bg-emerald-400 hover:bg-emerald-500  text-white w-auto ms-auto px-12 py-6 border-0"
            text="Continuar"
          />
        </form>
      </AppLayout.Content>
    </AppLayout>
  )
}
