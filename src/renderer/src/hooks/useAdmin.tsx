import supabase from '@renderer/utils/supabase'
import { UserMetadata } from '@supabase/supabase-js'
import { useState } from 'react'

interface AdminApi {
  usersList: object
  getUsers: () => Promise<object | void>
  getUser: (id: string | number) => Promise<UserMetadata | null>
  deleteUser: (id: string | number) => Promise<void>
  updateUser: (id: string | number, attributes: object) => Promise<object | null>
}

export const useAdmin = (): AdminApi => {
  const [usersList, setUsersList] = useState<object>([{}])

  const getUsers = async (): Promise<object | void> => {
    try {
      const {
        data: { users }
      } = await supabase.auth.admin.listUsers()

      const usersMap = users
        .filter((user) => Object.keys(user.user_metadata).length > 0)
        .map((usr) => {
          const userInfo = usr.user_metadata
          return {
            nombre: userInfo.name,
            apellido: userInfo.lastname,
            correo: userInfo.email,
            rol: userInfo.rol === '1' ? 'Admin' : 'User',
            id: usr.id
          }
        })
        .sort((a, b) => a['nombre'].localeCompare(b['nombre']))
      setUsersList(usersMap)
      return usersMap
    } catch (error) {
      console.error(error)
    }
  }

  const deleteUser = async (id: string | number): Promise<void> => {
    try {
      await supabase.auth.admin.deleteUser(String(id))
      await getUsers()
    } catch (error) {
      console.error(error)
    }
  }

  const getUser = async (id: string | number): Promise<UserMetadata | null> => {
    try {
      const { data, error } = await supabase.auth.admin.getUserById(String(id))
      if (error) console.log(error)
      const tempUser = data.user?.user_metadata
      return tempUser
        ? {
            Nombre: tempUser.name,
            Apellido: tempUser.lastname,
            Correo: tempUser.email,
            Rol: tempUser.rol === '1' ? 'Admin' : 'User'
          }
        : {}
    } catch (error) {
      console.error(error)
    }
    return null
  }

  const updateUser = async (id: string | number, attributes: object): Promise<object | null> => {
    try {
      const { data, error } = await supabase.auth.admin.updateUserById(String(id), attributes)
      if (error) throw error
      console.log(data)
      return data
    } catch (error) {
      console.error(error)
    }
    return null
  }

  return { getUsers, getUser, usersList, deleteUser, updateUser }
}
