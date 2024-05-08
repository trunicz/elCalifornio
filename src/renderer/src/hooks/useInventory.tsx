import supabase from '@renderer/utils/supabase'
import { useState } from 'react'

interface InventoryMethods {
  inventory: object[] | null
  getAllInventory: () => Promise<object[] | null>
}

export const useInventory = (): InventoryMethods => {
  const [inventory, setInventory] = useState<object[] | null>(null)

  const getAllInventory = async (): Promise<object[] | null> => {
    try {
      const { data, error } = await supabase.from('equipment').select()
      if (error) throw error

      const filteredInventory = data.map((inv) => {
        return {
          id: inv.id,
          nombre: inv.name,
          cantidad: inv.amount,
          disponible: inv.available
        }
      })

      setInventory(filteredInventory)
      return filteredInventory
    } catch (error) {
      console.error(error)
    }
    return null
  }

  return { getAllInventory, inventory }
}
