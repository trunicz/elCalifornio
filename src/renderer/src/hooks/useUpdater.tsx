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
    ]

    const promises = await Promise.all(updates)

    promises.forEach(({ data, error }) => {
      if (error) {
        throw error
      } else {
        console.log(data)
      }
    })
  }
  return { updateDueRents }
}
