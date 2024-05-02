import { create } from 'zustand'
import supabase from '@renderer/utils/supabase'

interface authState {
  user: object | null
  isLoading: boolean
  error: unknown | null
  signIn: (email: string, password: string) => void
  signUp: (email: string, password: string, options: object) => void
  signOut: () => void
}

export const useAuthStore = create<authState>((set) => ({
  user: supabase.auth.getUser(),
  isLoading: true,
  error: null,
  signIn: async (email, password): Promise<void> => {
    try {
      set({ isLoading: true })
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      set({ user: data, isLoading: false })
    } catch (error) {
      set({ error, isLoading: false })
    }
  },
  signUp: async (email, password, options): Promise<void> => {
    try {
      set({ isLoading: true })
      const { data, error } = await supabase.auth.signUp({ email, password, options })
      if (error) throw error
      set({ user: data, isLoading: false })
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
