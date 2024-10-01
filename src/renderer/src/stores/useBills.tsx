/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from '@renderer/utils/supabase'
import { create } from 'zustand'

interface Bill {
  bills: any
  getAllBills: () => Promise<any[]>
  createBill: (values: any) => Promise<void>
  deleteBill: (id: number) => Promise<void>
  restoreBillEquipment: (ids: number[]) => Promise<void>
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
  },
  deleteBill: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('bills')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },
  restoreBillEquipment: async (ids: number[]): Promise<void> => {
    const { error } = await supabase.from('equipment').upsert(ids.map((id) => ({ id, status: 1 })))
    if (error) throw error
  }
}))
