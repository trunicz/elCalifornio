import { create } from 'zustand'
import supabase from '@renderer/utils/supabase'
import { AuthError, User } from '@supabase/supabase-js'

interface authState {
  user: User | null
  isLoading: boolean
  error: AuthError | unknown | null
  signIn: (email: string, password: string) => Promise<void>
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
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        set({ error, isLoading: false })
      }
      set({ user: data.user, isLoading: false })
    } catch (error) {
      set({ user: null, isLoading: false })
      throw error
    }
  },
  signIn: async (email, password): Promise<void> => {
    try {
      set({ isLoading: true })
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        set({ error: error.message })
        throw error
      }
      set({ user: data.user, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  createUser: async (email, password, user_metadata): Promise<void> => {
    try {
      set({ isLoading: true })
      await supabase.auth.admin
        .createUser({ email, password, email_confirm: true, user_metadata })
        .then((res) => {
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
