/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from '@renderer/stores/useAuth'
import { convertirNumeroALetras } from '@renderer/utils'
import supabase from '@renderer/utils/supabase'
import { useState } from 'react'

interface RentalsMethods {
  rentals: any[] | null
  getAllRentals: () => Promise<any[] | null>
  deleteRental: (id: string | number) => Promise<void>
  createRental: (values: any) => Promise<void>
  getRental: (id: string | number) => Promise<object | null>
  getRow: (id: string | number) => Promise<object | null>
  getRentalHistory: () => Promise<any[] | null>
  getRentalForEdit: (id: string | number) => Promise<object>
  updateRental: (id: string | number, values: any) => Promise<void>
}

export const useRentals = (): RentalsMethods => {
  const [rentals, setRentals] = useState<any[] | null>(null)
  const { user } = useAuthStore()

  const updateRental = async (id: string | number, values: any): Promise<void> => {
    const updates = [
      await supabase.from('rentals').update(values).eq('id', id),
      await supabase
        .from('rentals')
        .update({ status: 'ACTIVO' })
        .gt('end_date', new Date().toISOString())
        .is('deleted_at', null)
    ]

    const results = await Promise.all(updates)

    results.forEach(({ data, error }) => {
      if (error) {
        throw error
      } else if (data) {
        console.log('fetched Successful')
      }
    })
  }

  const getRentalForEdit = async (id: string | number): Promise<object> => {
    const { data, error } = await supabase.from('rental_to_edit').select().eq('id', Number(id))
    if (error) throw error
    return data[0]
  }

  const deleteRental = async (id: string | number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('rentals')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  }

  const createRental = async (rentalValues: any): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('rentals')
        .insert(rentalValues)
        .select(
          'id,clients!rentals_client_id_fkey(name,last_name,id),total_cost,created_at,end_date,advance_payment'
        )

      if (data) {
        const rent = data[0]
        const fechaOriginal = new Date(rent.end_date)
        const fechaFormateada = fechaOriginal.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })

        const billValues = {
          rent_id: rent.id,
          cliente: rent.clients?.name + ' ' + rent.clients?.last_name,
          concepto: 'ABONO',
          cantidad: convertirNumeroALetras(parseFloat(rent.advance_payment)),
          forma_pago: 'NO ESPECIFICADO',
          factura: 'NO',
          razon_social: 'NO APLICA',
          recibidor: user?.user_metadata.name
            ? user?.user_metadata.name + ' ' + user?.user_metadata.last_name
            : 'ElCalifornio',
          cliente_firma: rent.clients?.name + ' ' + rent.clients?.last_name,
          sub_total: Number(rent.advance_payment).toFixed(2),
          iva: (Number(rent.advance_payment) * 0.16).toFixed(2),
          ref_contrato: `contrato${rent.created_at.replaceAll('/', '')}${rent.clients?.name[0]}${rent.id}`,
          estatus: 'VIGENCIA',
          fecha_vencimiento: fechaFormateada,
          fecha_extension: fechaFormateada.replaceAll('-', '/'),
          dia: `${new Date().getDate()}`,
          mes: `${new Date().getMonth() + 1}`,
          anio: `${new Date().getFullYear()}`,
          total: (Number(rent.advance_payment) + Number(rent.advance_payment) * 0.16).toFixed(2)
        }
        const { error } = await supabase.from('bills').insert(billValues)
        if (error) throw error
      }
      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  }

  const getRental = async (id: string | number): Promise<object | null> => {
    try {
      const response = await supabase
        .from('rentals')
        .select(
          'id,clients!rentals_client_id_fkey(name,last_name,id),user_id,end_date,equipment(type(type_name),reference)'
        )
        .is('deleted_at', null)
        .eq('id', id)

      const rentals = response.data

      if (response.error) {
        throw response.error
      }

      if (rentals) {
        const filteredRentalsPromises = rentals.map(async (rental) => {
          const response = await supabase.auth.admin.getUserById(rental.user_id)
          const user = response.data.user?.user_metadata
          if (user) {
            return {
              id: rental.id,
              client_id: rental.clients?.id,
              cliente: `${rental.clients?.name} ${rental.clients?.last_name}`,
              user_id: rental.user_id,
              fecha_final: new Date(rental.end_date).toLocaleDateString(),
              arrendatario: `${user.name} ${user.lastname}`,
              alquilado: rental.equipment.map(
                (item: any) => `${item.type.type_name}: ${item.reference}`
              )
            }
          } else {
            return null
          }
        })
        const filteredRentals = await Promise.all(filteredRentalsPromises)
        setRentals(filteredRentals)
        return filteredRentals
      }
    } catch (error) {
      console.error(error)
    }
    return null
  }

  const getRow = async (id: string | number): Promise<object | null> => {
    try {
      const { data, error } = await supabase.from('all_rentals').select().eq('id', id)
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getAllRentals = async (): Promise<any[] | null> => {
    try {
      const response = await supabase.from('all_rentals').select().is('deleted_at', null)
      setRentals(response.data)
      return response.data
    } catch (error) {
      console.error(error)
    }
    return null
  }

  const getRentalHistory = async (): Promise<any[] | null> => {
    try {
      const response = await supabase.from('all_rentals').select().not('deleted_at', 'is', null)
      setRentals(response.data)
      return response.data
    } catch (error) {
      console.error(error)
    }
    return null
  }

  return {
    getAllRentals,
    rentals,
    deleteRental,
    createRental,
    getRental,
    getRentalHistory,
    getRentalForEdit,
    updateRental,
    getRow
  }
}
