/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from '@renderer/utils/supabase'
import { useState } from 'react'

interface InventoryMethods {
  inventory: object[] | null
  getAllInventory: () => Promise<object[] | null>
  getItem: (id: string | number) => Promise<object | null>
  getEquipmentTypes: () => Promise<object[] | null>
  getEquipmentStatus: () => Promise<object[] | null>
  createEquipment: (values: object) => Promise<void>
}

export const useInventory = (): InventoryMethods => {
  const [inventory, setInventory] = useState<object[] | null>(null)

  const createEquipment = async (values: object): Promise<void> => {
    try {
      const { error } = await supabase.from('equipment').insert(values)
      if (error) throw error
    } catch (error) {
      console.log(error)
    }
  }

  const getEquipmentTypes = async (): Promise<object[] | null> => {
    try {
      const { data, error } = await supabase.from('equipment_type').select()
      if (error) throw error
      return data
    } catch (error) {
      console.log(error)
    }
    return null
  }

  const getEquipmentStatus = async (): Promise<object[] | null> => {
    try {
      const { data, error } = await supabase.from('equipment_status').select()
      if (error) throw error
      return data
    } catch (error) {
      console.log(error)
    }
    return null
  }

  const getItem = async (id: string | number): Promise<object | null> => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('id,type(type_name),reference,status(status_name)')
        .eq('id', id)
      if (error) throw error
      const filteredInventory = data.map((inv: any) => {
        return {
          id: inv.id,
          tipo: inv.type.type_name,
          estado: inv.status.status_name,
          referencia: inv.reference ? inv.reference : 'Sin Referencia'
        }
      })
      return filteredInventory
    } catch (error) {
      console.log(error)
    }
    return null
  }

  const getAllInventory = async (): Promise<object[] | null> => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('id,type(type_name),reference,status(status_name)')
      if (error) throw error
      const filteredInventory = data.map((inv: any) => {
        return {
          id: inv.id,
          tipo: inv.type.type_name,
          referencia: inv.reference ? inv.reference : 'Sin Referencia',
          estado: inv.status.status_name
        }
      })

      setInventory(filteredInventory)
      return filteredInventory
    } catch (error) {
      console.error(error)
    }
    return null
  }

  return {
    getAllInventory,
    inventory,
    getItem,
    getEquipmentTypes,
    getEquipmentStatus,
    createEquipment
  }
}
