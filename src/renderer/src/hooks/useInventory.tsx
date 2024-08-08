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
  deleteEquipmentByQuantity: (
    type: string | number,
    dimension: string | number,
    quantity: number
  ) => Promise<void>
  updateEquipment: (id: string | number, values: object) => Promise<void>
  getAvailableInventory: () => Promise<object | null>
  getItemDimension: (id: string | number) => Promise<object[] | null>
  getPricesBy: (id: string | number) => Promise<object[] | null>
  createPrices: (values: object) => Promise<void>
  getPricesByItemId: (id: string | number) => Promise<object[]>
  getItemIdByTypeAndRef: (
    type: string,
    dimension: string | null,
    ref: string,
    limit: number
  ) => Promise<any[]>
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

  const deleteEquipmentByQuantity = async (
    type: string | number,
    dimension: string | number,
    quantity: number
  ): Promise<any | null> => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('id')
        .eq('type', type)
        .eq('dimension', dimension)
        .eq('status', 1)
        .is('deleted_at', null)
        .order('id', { ascending: true })
        .limit(quantity)
      if (error) {
        throw error
      }
      const ids = data?.map((obj: { id: any }) => obj.id)

      if (!ids || ids.length === 0) {
        return null
      }

      for (const id of ids) {
        await deleteEquipment(id)
      }
      return data
    } catch (error) {
      console.error(error)
    }
  }

  const createEquipment = async (values: object, count: number): Promise<any[] | null> => {
    try {
      const results: any[] = []
      const items = Array(count).fill(values)

      const { data, error } = await supabase.from('equipment').insert(items).select()
      if (error) {
        throw error
      }

      if (data) {
        results.push(...data)
      }

      return results
    } catch (error) {
      console.error('Error creating equipment:', error)
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
  const getItemIdByTypeAndRef = async (
    type: string,
    dimension: string | null,
    ref: string,
    limit: number
  ): Promise<number[]> => {
    try {
      // Verificar si la referencia es la cadena 'null' y tratarla como null
      const actualRef = ref === 'null' ? null : ref

      // Obtener el ID del tipo
      const typeIdResponse = await supabase
        .from('equipment_type')
        .select('id')
        .eq('type_name', type)

      if (!typeIdResponse.data || typeIdResponse.data.length === 0) {
        throw new Error('Tipo no encontrado')
      }

      const typeId = typeIdResponse.data[0].id

      let dimensionId: string | null = null

      // Si la dimensión no es null, obtener su ID
      if (dimension) {
        const dimensionIdResponse = await supabase
          .from('equipment_dimension')
          .select('id')
          .eq('dimension_name', dimension)

        if (dimensionIdResponse.data && dimensionIdResponse.data.length > 0) {
          dimensionId = `${dimensionIdResponse.data[0].id}`
        }
      }

      // Construir la consulta a equipment
      let query = supabase.from('equipment').select('id').eq('type', typeId).limit(limit)

      if (dimensionId) {
        query = query.eq('dimension', dimensionId)
      }

      if (actualRef !== null) {
        query = query.eq('reference', actualRef)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      if (!data) {
        return []
      }

      return data.map((item) => Number(item.id))
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getAvailableInventory = async (): Promise<object | null> => {
    try {
      const { data, error } = await supabase.from('grouped_inventory').select('*')
      const req = await supabase.from('equipment_type').select()

      const objectToSend = {
        equipment_types: req.data as object[],
        equipments: data
      }

      if (error) throw error
      if (req.error) throw error

      return objectToSend
    } catch (error) {
      console.error(error)
      return null
    }
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

  /*const getAllInventoryView = async (): Promise<object[] | null> => {
      try {
        const { data, error } = await supabase.from('all_inventory1').select()
        if (error) throw error
        setInventory(data)
        return data
      } catch (error) {
        console.error(error)
      }
      return null
    }*/

  const getAllInventory = async (): Promise<object[] | null> => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('id,type(id,type_name),reference,status(id,status_name),dimension')
        .is('deleted_at', null)
      if (error) throw error
      const filteredInventory = data.map((inv: any) => {
        return {
          id: inv.id,
          tipo: inv.type.type_name,
          referencia: inv.reference ? inv.reference : 'Sin Referencia',
          estado: inv.status.status_name,
          tipo_id: inv.type.id,
          dimension_id: inv.dimension,
          estado_id: inv.status.id
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
    deleteEquipmentByQuantity,
    updateEquipment,
    getAvailableInventory,
    getAllInventoryView,
    getItemDimension,
    getPricesBy,
    createPrices,
    getPricesByItemId,
    getItemIdByTypeAndRef
  }
}
