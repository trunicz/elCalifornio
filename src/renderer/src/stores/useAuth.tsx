import { create } from 'zustand'
import supabase from '@renderer/utils/supabase'
import { AuthError } from '@supabase/supabase-js'

interface authState {
  user: object | null
  isLoading: boolean
  error: AuthError | unknown | null
  signIn: (email: string, password: string) => void
  createUser: (email: string, password: string, options: object) => Promise<void>
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
  createUser: async (email, password, user_metadata): Promise<void> => {
    try {
      set({ isLoading: true })
      await supabase.auth.admin.createUser({ email, password, user_metadata }).then((res) => {
        if (res.error) throw res.error
      })
      set({ isLoading: false })
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
