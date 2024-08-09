/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from '@renderer/utils/supabase'
import { useState } from 'react'

interface Clients {
  clientList: object[] | null
  localsClients: any[] | null
  getAllClients: () => Promise<object[] | null>
  getClientById: (id: string | number) => Promise<object | null>
  createClient: (values: any, fileList?: FileList) => Promise<void>
  deleteClient: (id: string | number) => Promise<void>
  updateClient: (id: string | number, values: any, fileList: FileList) => Promise<void>
  getAllLocalClients: () => Promise<object[] | null>
  getAllFiles: (id: any) => Promise<FileList[]>
  download: (id: any, name: string) => Promise<Blob | MediaSource>
  removeFile: (id: any, name: string) => Promise<void>
  getBannedClients: () => Promise<any[]>
  unBanClientById: (id: string | number) => Promise<void>
  uploadFiles: (files: FileList, id: string) => Promise<string[]>
  addStrikes: (id: string | number) => Promise<void>
  banClientById: (id: string | number) => Promise<void>
  getAllClientsForRent: () => Promise<{ value: any; label: string }[]>
}

export const useClients = (): Clients => {
  const [clientList, setClientList] = useState<object[] | null>(null)
  const [localsClients, setLocalsClients] = useState<object[] | null>(null)

  const banClientById = async (id: string | number): Promise<void> => {
    const { error } = await supabase.from('clients').update({ strikes: 3 }).eq('id', id)
    if (error) throw error
  }

  const addStrikes = async (id: string | number): Promise<void> => {
    try {
      const { data: client, error: fetchError } = await supabase
        .from('clients')
        .select('strikes')
        .eq('id', id)
        .single()

      if (fetchError) throw new Error(`Error fetching strikes: ${fetchError.message}`)
      if (!client || typeof client.strikes !== 'number')
        throw new Error('Invalid data received for strikes')

      const newStrikes = client.strikes + 1

      const { error: updateError } = await supabase
        .from('clients')
        .update({ strikes: newStrikes })
        .eq('id', id)

      if (updateError) throw new Error(`Error updating strikes: ${updateError.message}`)
    } catch (error) {
      console.error('Failed to add strikes:', error)
      throw error
    }
  }

  const unBanClientById = async (id: string | number): Promise<void> => {
    const { error } = await supabase.from('clients').update({ strikes: 0 }).eq('id', id)
    if (error) throw error
  }

  const getBannedClients = async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('clients')
      .select('id,name,last_name,phone,strikes,isBanned')
      .gt('strikes', 2)
    if (error) throw error
    const filteredData = data.map((r) => {
      return {
        id: r.id,
        nombre: r.name,
        apellido: r.last_name,
        teléfono: r.phone,
        strikes: r.strikes,
        isBanned: r.isBanned
      }
    })
    setClientList(filteredData)
    return filteredData
  }

  const removeFile = async (id: any, name: string): Promise<void> => {
    const { data, error } = await supabase.storage
      .from('clients_storage')
      .remove([`clients/${id}/${name}`])
    if (error) throw error
    console.log(data)
  }

  const download = async (id: any, name: string): Promise<Blob | MediaSource> => {
    const BLOB = await supabase.storage
      .from('clients_storage')
      .download(`clients/${id}/${name}`)
      .then(async (res) => {
        if (res.error) throw res.error
        const blob: any = res.data
        return blob
      })
    return BLOB
  }

  const getAllFiles = async (id: any): Promise<any[]> => {
    try {
      const response = await supabase.storage
        .from('clients_storage')
        .list(`clients/${id}`, { limit: 100 })
      if (response.error) throw response.error
      console.log(response)

      return response.data
    } catch (error) {
      console.error(error)
    }
    return []
  }

  const uploadFiles = (files: FileList, id: string): Promise<string[]> => {
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const { data, error } = await supabase.storage
          .from('clients_storage')
          .upload(`clients/${id}/${file.name}`, file)

        if (error) {
          console.error('Error uploading file:', error)
          throw error
        }

        console.log('File uploaded:', data)
        return data.path
      })

      return Promise.all(uploadPromises)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateClient = async (
    id: string | number,
    values: any,
    filesList: FileList
  ): Promise<void> => {
    try {
      // CAMBIO: Corregido que no se podría cambiar datos del cliente.
      const files = filesList === undefined ? [] : Array.from(filesList)

      const urls = await Promise.all(
        files.map(async (file: any) => {
          const { data, error } = await supabase.storage
            .from('clients_storage')
            .upload(`clients/${id}/${file.name}`, file)
          if (error) throw error
          console.log(data)
          return data.path
        })
      )

      const { error } = await supabase
        .from('clients')
        .update({ ...values, urls })
        .eq('id', id)
      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  }

  const deleteClient = async (id: string | number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    } catch (error) {
      console.log(error)
    }
  }

  const createClient = async (values: any, filesList?: FileList): Promise<void> => {
    try {
      const files = Array.from(filesList ? filesList : [])

      const { data: clientData, error: insertError } = await supabase
        .from('clients')
        .insert(values)
        .select('id')
        .single()
      if (insertError) throw insertError

      const clientId = clientData.id

      const urls = await Promise.all(
        files.map(async (file: any) => {
          const filePath = `clients/${clientId}/${file.name}`
          const { data, error } = await supabase.storage
            .from('clients_storage')
            .upload(filePath, file)
          if (error) throw error
          return data.path
        })
      )

      const { error: updateError } = await supabase
        .from('clients')
        .update({ urls })
        .eq('id', clientId)
      if (updateError) throw updateError
    } catch (error) {
      console.error(error)
    }
  }

  const getClientById = async (id: string | number): Promise<object | null> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*,client_type(type_name)')
        .eq('id', id)
      if (error) throw error
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
        .select('id,name,last_name,phone,isForeign,client_type(type_name),strikes')
        .is('deleted_at', null)
        .lt('strikes', 3)
      if (error) throw error

      const filteredClients = data
        .map((client) => {
          return {
            id: client.id,
            'nombre(s)': client.name,
            'apellido(s)': client.last_name,
            teléfono: client.phone,
            strikes: client.strikes,
            foráneo: client.isForeign ? 'Si' : 'No',
            tipo_cliente: client.client_type[0].type_name
          }
        })
        .sort((a, b) => a['nombre(s)'].localeCompare(b['nombre(s)']))

      setClientList(filteredClients)
      return filteredClients
    } catch (error) {
      console.error(error)
    }
    return null
  }

  const getAllLocalClients = async (): Promise<object[] | null> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id,name,last_name,email,phone,isForeign,client_type(type_name)')
        .is('isForeign', false)
        .is('deleted_at', null)
        .lt('strikes', 3)
      if (error) throw error
      const filteredClients = data.map((client) => {
        return {
          id: client.id,
          'nombre(s)': client.name,
          'apellido(s)': client.last_name,
          correo: client.email,
          teléfono: client.phone,
          foráneo: client.isForeign ? 'Si' : 'No',
          tipo_cliente: client.client_type[0].type_name
        }
      })
      setLocalsClients(filteredClients)
      return filteredClients
    } catch (error) {
      console.error(error)
    }
    return null
  }

  const getAllClientsForRent = async (): Promise<{ value: any; label: string }[]> => {
    const { data } = await supabase
      .from('clients')
      .select('id,name,last_name')
      .is('deleted_at', null)
      .lt('strikes', 3)

    if (data) {
      return data.map((c) => {
        return { value: c.id, label: `${c.name} ${c.last_name}` }
      })
    } else {
      return [{ value: 0, label: '' }]
    }
  }

  return {
    getAllClients,
    clientList,
    getClientById,
    createClient,
    deleteClient,
    updateClient,
    getAllLocalClients,
    localsClients,
    getAllFiles,
    download,
    removeFile,
    getBannedClients,
    unBanClientById,
    uploadFiles,
    addStrikes,
    banClientById,
    getAllClientsForRent
  }
}
