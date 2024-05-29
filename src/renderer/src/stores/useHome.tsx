/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from '@renderer/utils/supabase'
import { create } from 'zustand'

interface HomeStore {
  home: {
    clientcount: number | null
    rentalcount: number | null
    timeoutcount: number | null
    usercount: number | null
    rentals_info: any
    calls: number | null
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
