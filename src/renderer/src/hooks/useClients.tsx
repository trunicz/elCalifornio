import supabase from '@renderer/utils/supabase'
import { useState } from 'react'

interface Clients {
  clientList: object[] | null
  getAllClients: () => Promise<object[] | null>
  getClientById: (id: string | number) => Promise<object | null>
}

export const useClients = (): Clients => {
  const [clientList, setClientList] = useState<object[] | null>(null)

  const getClientById = async (id: string | number): Promise<object | null> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*,client_type(type_name)')
        .eq('id', id)
      if (error) throw error
      console.log(data)
      return data
    } catch (error) {
      console.error(error)
    }
    return null
  }

  const getAllClients = async (): Promise<object[] | null> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id,name,last_name,email,phone,isForeing,client_type(type_name)')
      if (error) throw error

      const filteredClients = data.map((client) => {
        return {
          id: client.id,
          'nombre(s)': client.name,
          'apellido(s)': client.last_name,
          correo: client.email,
          teléfono: client.phone,
          foráneo: client.isForeing ? 'Si' : 'No',
          tipo_cliente: client.client_type[0].type_name
        }
      })
      setClientList(filteredClients)
      return filteredClients
    } catch (error) {
      console.error(error)
    }
    return null
  }

  return { getAllClients, clientList, getClientById }
}
