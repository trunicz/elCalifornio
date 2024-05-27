import { create } from 'zustand'

interface LoadingState {
  loading: boolean
  setLoading: (b: boolean) => void
}

export const useLoadingStore = create<LoadingState>((set) => ({
  loading: false,
  setLoading: (bool: boolean): void => {
    set({ loading: bool })
  }
}))
