import supabase from '@renderer/utils/supabase'

interface Updater {
  updateDueRents: () => Promise<void>
}

export const useUpdater = (): Updater => {
  const updateDueRents = async (): Promise<void> => {
    const updates = [
      supabase
        .from('rentals')
        .update({ status: 'VENCIDO' })
        .lt('end_date', new Date().toISOString())
        .is('deleted_at', null)
    ]

    const promises = await Promise.all(updates)

    promises.forEach(({ data, error }) => {
      if (error) {
        throw error
      } else {
        if (data) throw data
      }
    })
  }
  return { updateDueRents }
}
