import supabase from '@renderer/utils/supabase'
import { AuthError, UserIdentity } from '@supabase/supabase-js'
import { useState } from 'react'

interface UsersResponse {
  data: null | { identities: UserIdentity[] }
  error: null | AuthError
}

interface AdminFunctions {
  users: () => Promise<unknown | UserIdentity[]>
  usersList: UserIdentity[] | null | undefined
}

export const useAdmin = (): AdminFunctions => {
  const [usersList, setUsersList] = useState<null | undefined | UserIdentity[]>(null)

  const getUsers = async (): Promise<UsersResponse | null> => {
    try {
      return await supabase.auth.getUserIdentities()
    } catch (error) {
      console.log(error)
    }
    return null
  }

  const users = async (): Promise<UserIdentity[]> => {
    if (!usersList) {
      const response = await getUsers()
      const list = response ? response.data?.identities : []
      setUsersList(list)
      return list || []
    }
    return usersList
  }

  return { users, usersList }
}
