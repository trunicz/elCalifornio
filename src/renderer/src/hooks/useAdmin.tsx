import supabase from '@renderer/utils/supabase'
import { useState } from 'react'

interface AdminApi {
  usersList: object
  getUsers: () => Promise<object | void>
  getUser: (id: string) => Promise<object | null>
  deleteUser: (id: string) => Promise<void>
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
            rol: userInfo.rol === '1' ? 'Admin' : 'Usuario',
            id: usr.id
          }
        })
      setUsersList(usersMap)
      return usersMap
    } catch (error) {
      console.error(error)
    }
  }

  const deleteUser = async (id: string): Promise<void> => {
    try {
      await supabase.auth.admin.deleteUser(id)
      await getUsers()
    } catch (error) {
      console.error(error)
    }
  }

  const getUser = async (id: string): Promise<object | null> => {
    try {
      const { data, error } = await supabase.auth.admin.getUserById(id)
      if (error) console.log(error)
      const tempUser = data.user?.user_metadata
      return tempUser
        ? {
            Nombre: tempUser.name,
            Apellido: tempUser.lastname,
            Correo: tempUser.email,
            Rol: tempUser.rol === '1' ? 'Admin' : 'User',
            UltimoInicio: data.user?.updated_at
          }
        : {}
    } catch (error) {
      console.error(error)
    }
    return null
  }

  return { getUsers, getUser, usersList, deleteUser }
}
