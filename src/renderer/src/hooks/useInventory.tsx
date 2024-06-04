/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from '@renderer/utils/supabase'
import { useState } from 'react'

interface InventoryMethods {
  inventory: object[] | null
  getAllInventoryView: () => Promise<object[] | null>
  getAllInventory: () => Promise<object[] | null>
  getItem: (id: string | number) => Promise<object | null>
  getEquipmentTypes: () => Promise<object[] | null>
  getEquipmentStatus: () => Promise<object[] | null>
  createEquipment: (values: object, count: number) => Promise<object[] | null>
  deleteEquipment: (id: string | number) => Promise<void>
  updateEquipment: (id: string | number, values: object) => Promise<void>
  getAvailableInventory: () => Promise<object[] | null>
  getItemDimension: (id: string | number) => Promise<object[] | null>
  getPricesBy: (id: string | number) => Promise<object[] | null>
  createPrices: (values: object) => Promise<void>
  getPricesByItemId: (id: string | number) => Promise<object[]>
}

export const useInventory = (): InventoryMethods => {
  const [inventory, setInventory] = useState<object[] | null>(null)

  const createPrices = async (values: any): Promise<void> => {
    const { error } = await supabase.from('prices').insert(values)
    if (error) throw error
  }

  const getPricesByItemId = async (id: string | number): Promise<object[]> => {
    const { data, error } = await supabase.from('prices').select().eq('equipment_id', id)
    if (error) throw error
    return data
  }

  const getPricesBy = async (id: string | number): Promise<object[] | null> => {
    const { data, error } = await supabase.from('prices').select().eq('type_id', id)
    if (error) throw error
    return data
  }

  const getItemDimension = async (id: string | number): Promise<object[] | null> => {
    const { data, error } = await supabase.from('equipment_dimension').select().eq('id_type', id)
    if (error) throw error
    const formatData = data.map((data) => {
      return {
        value: data.id,
        label: data.dimension_name
      }
    })
    return formatData
  }

  const updateEquipment = async (id: string | number, values: object): Promise<void> => {
    try {
      const { error } = await supabase.from('equipment').update(values).eq('id', id)
      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  }

  const deleteEquipment = async (id: string | number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('equipment')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  }

  const createEquipment = async (values: object, count: number): Promise<any[] | null> => {
    try {
      const results: any[] = []
      for (let i = 0; i < count; i++) {
        const { data, error } = await supabase.from('equipment').insert(values).select()
        if (error) throw error
        if (data) {
          results.push(...data)
        }
      }
      return results
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const getEquipmentTypes = async (): Promise<object[] | null> => {
    try {
      const { data, error } = await supabase.from('inventory_types').select()
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
        .select('id,type(id,type_name),reference,status(status_name)')
        .eq('id', id)
      if (error) throw error
      const filteredInventory = data.map((inv: any) => {
        return {
          id: inv.id,
          tipo: inv.type.type_name,
          tipo_id: inv.type.id,
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

  const getAvailableInventory = async (): Promise<object[] | null> => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select(
          'id,type(type_name),reference,status,dimension(dimension_name),prices(price_week,price_days)'
        )
        .eq('status', 1)
        .is('deleted_at', null)
      if (error) throw error
      return data
    } catch (error) {
      console.error(error)
    }
    return null
  }

  const getAllInventoryView = async (): Promise<object[] | null> => {
    try {
      const { data, error } = await supabase.from('all_inventory').select()
      if (error) throw error
      setInventory(data)
      return data
    } catch (error) {
      console.error(error)
    }
    return null
  }

  const getAllInventory = async (): Promise<object[] | null> => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('id,type(type_name),reference,status(status_name)')
        .is('deleted_at', null)
      if (error) throw error
      const filteredInventory = data.map((inv: any) => {
        return {
          id: inv.id,
          tipo: inv.type.type_name,
          referencia: inv.reference ? inv.reference : 'Sin Referencia',
          estado: inv.status.status_name
        }
      })
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
    createEquipment,
    deleteEquipment,
    updateEquipment,
    getAvailableInventory,
    getAllInventoryView,
    getItemDimension,
    getPricesBy,
    createPrices,
    getPricesByItemId
  }
}
