/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppLayout, Widget } from '@renderer/components'
import { Loading } from '@renderer/components/Loading'
import { useHomeStore } from '@renderer/stores/useHome'
import { cn } from '@renderer/utils'
import { ReactElement, useEffect, useState } from 'react'
import {
  LuBadgeDollarSign,
  LuCalendarHeart,
  LuCalendarOff,
  LuDollarSign,
  LuPhoneOutgoing,
  LuReply,
  LuUser2,
  LuUserSquare
} from 'react-icons/lu'
import { Link } from 'wouter'

export const MainPage = (): ReactElement => {
  const { home, getHomeInfo } = useHomeStore()

  useEffect(() => {
    getHomeInfo()
  }, [getHomeInfo])

  return (
    <AppLayout>
      <AppLayout.Content>
        {home ? (
          <main className="grid grid-cols-4 flex-1 grid-rows-4 xl:grid-rows-4 gap-4 p-4 overflow-y-auto">
            <Widget
              color="danger"
              icon={<LuCalendarOff />}
              title="Rentas Vencidas"
              className="row-start-1 col-span-1 row-span-1"
              href="/rent/VENCIDO"
            >
              {home.timeout_count}
            </Widget>
            <Widget
              color="info"
              icon={<LuUser2 />}
              title="Usuarios"
              className="row-start-1 col-span-1 row-span-1"
              href="/users"
            >
              {home.user_count}
            </Widget>
            <Widget
              color="success"
              icon={<LuUserSquare />}
              title="Clientes"
              className="row-start-1 col-span-1 row-span-1"
              href="/clients"
            >
              {home.client_count}
            </Widget>
            <Widget
              color="warning"
              icon={<LuPhoneOutgoing />}
              title="Llamadas"
              className="row-start-1 col-span-1 row-span-1"
              href="/audit"
            >
              {home.calls}
            </Widget>
            <Widget
              title="Mejores rentas del mes"
              icon={<LuCalendarHeart />}
              className="row-start-2 row-span-full col-span-2"
              size="xl"
              hasGoTo={false}
              clickable={false}
            >
              <div className="h-full w-full flex flex-col">
                <header className="flex border-b mb-4 pb-2 text-xl items-center justify-between">
                  <div className="p-2 font-bold">Nombre</div>
                  <div className="p-2 font-bold">
                    <LuDollarSign />
                  </div>
                </header>
                <div className="overflow-y-auto pb-8 flex-1 text-sm grid gap-2">
                  {home.rentals_info ? (
                    home.rentals_info
                      .sort((a: any, b: any) => b.total - a.total)
                      .slice(0, 6)
                      .map((rent: any, index: number) => (
                        <RentalRow href={`/client/${rent?.name}`} rent={rent} key={index} />
                      ))
                  ) : (
                    <div className="text-center p-4 text-3xl text-red-500">Sin rentas</div>
                  )}
                </div>
              </div>
            </Widget>
            <Widget
              color="none"
              icon={<LuBadgeDollarSign />}
              title="Pagos Pendientes"
              className="row-start-2 row-span-full col-span-2"
              hasGoTo={false}
              clickable={false}
              size="xl"
            >
              <div className="h-full w-full flex flex-col">
                <header className="flex text-lg pb-2 border-b mb-3">
                  <div className="w-1/3 p-2 font-bold">Nombre</div>
                  <div className="w-1/3 text-center p-2 font-bold text-nowrap">Dias Restantes</div>
                  <div className="w-1/3 flex items-center justify-center p-2 font-bold">
                    <LuDollarSign />
                  </div>
                </header>
                <div className="overflow-y-auto pb-8 flex-1 text-sm grid gap-2">
                  {home.pending_payments ? (
                    home.pending_payments.map((row: any, key: number) => (
                      <PendingRow
                        row={row}
                        key={row.name + key}
                        href={`/rent/${row.name} ${row.last_name}`}
                      />
                    ))
                  ) : (
                    <div className="text-center p-4 text-3xl text-red-500">Sin Adeudos</div>
                  )}
                </div>
              </div>
            </Widget>
          </main>
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}

const PendingRow = ({ row, href }: { row: any; href: string }): ReactElement => {
  const [showIcon, setShowIcon] = useState(false)
  return (
    <div>
      <Link
        to={href}
        onMouseEnter={() => setShowIcon(true)}
        onMouseLeave={() => setShowIcon(false)}
      >
        <div className="bg-gray-50 rounded-lg p-4 flex items-center">
          <div className="relative flex items-center">
            {showIcon && (
              <span className="text-xl animate animate-fade-up animate-duration-150 absolute ">
                <LuReply />
              </span>
            )}
          </div>
          <span
            className={cn(
              'w-1/3  text-xs xl:text-lg text-nowrap overflow-x-hidden text-start transition-all',
              showIcon ? 'ps-8' : ''
            )}
          >{`${row.name} ${row.last_name}`}</span>
          <span
            className={cn('w-1/3 text-center', !Number(row.days_until_due) ? 'text-red-500' : '')}
          >{`${Number(row.days_until_due) ? row.days_until_due : 'Ninguno'}`}</span>
          <span className="p-2 bg-green-100 text-green-600 rounded-xl mx-auto">{`$${row.pending_payment.toFixed(2)}`}</span>
        </div>
      </Link>
    </div>
  )
}

const RentalRow = ({
  rent,
  href
}: {
  rent: { name: string; last_name: string; total: string }
  href: string
}): ReactElement => {
  const [showIcon, setShowIcon] = useState(false)

  return (
    <div className="">
      <Link
        className=""
        onMouseEnter={() => setShowIcon(true)}
        onMouseLeave={() => setShowIcon(false)}
        to={href}
      >
        <div className="flex h-auto w-full text-xl mb-2 items-center justify-between p-2 py-4 text-purple-500 bg-purple-100 rounded-xl active:bg-purple-200 transition-all active:scale-[99%]">
          <div className="relative flex items-center">
            {showIcon && (
              <div className="text-3xl ps-4 animate animate-fade-up animate-duration-150 absolute ">
                <LuReply />
              </div>
            )}
          </div>
          <div
            className={cn(
              'ms-4 w-full text-lg text-start text-wrap transition-all',
              showIcon ? 'ps-12' : ''
            )}
          >
            {`${rent.name} ${rent.last_name}`}
          </div>
          <div className="text-white p-2 bg-purple-300 rounded-xl">
            <span className="pe-1">$</span>
            {parseFloat(rent.total).toFixed(2)}
          </div>
        </div>
      </Link>
    </div>
  )
}
