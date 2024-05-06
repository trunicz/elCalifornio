import supabase from '@renderer/utils/supabase'
import { useState } from 'react'

interface Clients {
  clientList: object[] | null
  getAllClients: () => Promise<object[] | null>
}

export const useClients = (): Clients => {
  const [clientList, setClientList] = useState<object[] | null>(null)

  const getAllClients = async (): Promise<object[] | null> => {
    try {
      const { data: clients, error } = await supabase.from('clients').select()
      if (error) throw console.error()
      setClientList(clients)
      return clients
    } catch (error) {
      console.error(error)
    }
    return null
  }

  return { getAllClients, clientList }
}
