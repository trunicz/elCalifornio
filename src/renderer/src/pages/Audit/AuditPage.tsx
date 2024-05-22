/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppLayout, Table } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import supabase from '@renderer/utils/supabase'
import { ReactElement, useEffect, useState } from 'react'

export const AuditPage = (): ReactElement => {
  const [data, setData] = useState<any>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getAudit = async (): Promise<void> => {
      const { data, error } = await supabase.from('all_logs').select()
      if (error) throw error
      setData(data)
      setLoading(true)
    }
    getAudit()
  }, [])

  return (
    <AppLayout>
      <AppLayout.Content>
        <AppLayout.PageOptions pageTitle="Auditoria" hasAddButton={false} />
        {loading ? <Table data={data} hasOptions={false} /> : <Loading />}
      </AppLayout.Content>
    </AppLayout>
  )
}
