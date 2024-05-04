import { create } from 'zustand'
import supabase from '@renderer/utils/supabase'
import { AuthError } from '@supabase/supabase-js'

interface authState {
  user: object | null
  isLoading: boolean
  error: AuthError | unknown | null
  signIn: (email: string, password: string) => void
  signUp: (
    email: string,
    password: string,
    options: object,
    add: { [x: string]: string }
  ) => Promise<void>
  // Change the return type of signUp to Promise<void>
  signOut: () => void
  initializeUser: () => void
}

export const useAuthStore = create<authState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  initializeUser: async (): Promise<void> => {
    try {
      set({ isLoading: true })
      const auth = await supabase.auth.getUser()
      set({ user: auth.data.user, isLoading: false })
    } catch (error) {
      console.log(error)
      set({ user: null, error, isLoading: false })
    }
  },
  signIn: async (email, password): Promise<void> => {
    try {
      set({ isLoading: true })
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      set({ user: data.user, isLoading: false })
    } catch (error) {
      set({ error, isLoading: false })
    }
  },
  signUp: async (email, password, options, add): Promise<void> => {
    try {
      set({ isLoading: true })
      const {
        data: { user },
        error
      } = await supabase.auth.signUp({
        email,
        password,
        options
      })
      if (error) throw error
      // If user creation is successful, insert additional user details
      await supabase.from('users').insert({
        name: add.name,
        lastname: add.lastname,
        email: add.email,
        rol: add.rol
      })
      set({ isLoading: false, user })
    } catch (error) {
      set({ error, isLoading: false })
    }
  },
  signOut: async (): Promise<void> => {
    try {
      set({ isLoading: true })
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, isLoading: false })
    } catch (error) {
      set({ error, isLoading: false })
    }
  }
}))
