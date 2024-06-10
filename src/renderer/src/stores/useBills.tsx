/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from '@renderer/utils/supabase'
import { create } from 'zustand'

interface Bill {
  bills: any
  getAllBills: () => Promise<any[]>
  createBill: (values: any) => Promise<void>
}

export const useBills = create<Bill>((set) => ({
  bills: null,
  getAllBills: async (): Promise<any[]> => {
    const { data, error } = await supabase.from('all_bills').select()
    if (error) throw error
    set({ bills: data })
    return data
  },
  createBill: async (values: any): Promise<void> => {
    const { error } = await supabase.from('bills').insert(values)
    if (error) throw error
  }
}))
