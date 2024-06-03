/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from '@renderer/utils/supabase'
import { create } from 'zustand'

interface HomeStore {
  home: {
    calls: number | null
    client_count: number | null
    clients: string[] | null
    pending_payments: any
    rental_count: number | null
    rentals_info: any
    timeout_count: number | null
    user_count: number | null
  } | null
  getHomeInfo: () => Promise<void>
}

export const useHomeStore = create<HomeStore>((set) => ({
  home: null,
  getHomeInfo: async (): Promise<void> => {
    const { data, error } = await supabase.from('home_view').select()
    if (error) throw error
    set({ home: data[0] })
  }
}))
