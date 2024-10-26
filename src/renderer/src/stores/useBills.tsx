/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from '@renderer/utils/supabase'
import { create } from 'zustand'

interface Bill {
  bills: any
  getAllBills: () => Promise<any[]>
  createBill: (values: any) => Promise<void>
  deleteBill: (id: number) => Promise<void>
  restoreBillEquipment: (rentalId: number, ids: number[]) => Promise<void>
}

export const useBills = create<Bill>((set) => ({
  bills: null,
  getAllBills: async (): Promise<any[]> => {
    const { data, error } = await supabase.from('all_bills').select()
    if (error) throw error
    set({ bills: data })
    return data
  },
  createBill: async (values: any): Promise<void> => {
    const { error } = await supabase.from('bills').insert(values)
    if (error) throw error
  },
  deleteBill: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('bills')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },
  restoreBillEquipment: async (rentalId: number, ids: number[]): Promise<void> => {
    // Paso 1: Obtener los ids actuales de los equipos asociados a la renta
    const { data: rental, error: fetchError } = await supabase
      .from('rentals')
      .select('equipments_id')
      .eq('id', rentalId)
      .single() // Nos aseguramos de traer solo un registro

    if (fetchError) throw fetchError

    let currentEquipmentIds = rental?.equipments_id || [] // Lista de ids actuales de equipos

    // Paso 2: Eliminar los ids pasados por la variable ids
    currentEquipmentIds = currentEquipmentIds.filter((id) => !ids.includes(id))

    // Paso 3: Actualizar la lista de equipment_ids en la tabla rentals
    const { error: updateRentalError } = await supabase
      .from('rentals')
      .update({ equipments_id: currentEquipmentIds }) // Actualizamos con el array filtrado
      .eq('id', rentalId)

    if (updateRentalError) throw updateRentalError

    // Paso 4: Si todo va bien, actualizar el estado de los equipos eliminados en la tabla equipment
    const { error: updateEquipmentError } = await supabase
      .from('equipment')
      .upsert(ids.map((id) => ({ id, status: 1 })))

    if (updateEquipmentError) throw updateEquipmentError
  }
}))
