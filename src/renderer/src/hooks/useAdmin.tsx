import supabase from '@renderer/utils/supabase'
import { useState } from 'react'

interface AdminApi {
  getUsers: () => Promise<object | void>
  usersList: object
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
            rol: userInfo.rol === '1' ? 'Admin' : 'Usuario'
          }
        })
      setUsersList(usersMap)
      return usersMap
    } catch (error) {
      console.error(error)
    }
  }

  return { getUsers, usersList }
}
