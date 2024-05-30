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
  LuHeartHandshake,
  LuPhoneOutgoing,
  LuReply,
  LuUser2,
  LuUserSquare
} from 'react-icons/lu'

export const MainPage = (): ReactElement => {
  const { home, getHomeInfo } = useHomeStore()

  useEffect(() => {
    getHomeInfo()
  }, [getHomeInfo])

  return (
    <AppLayout>
      <AppLayout.Content>
        {home ? (
          <main className="grid grid-cols-4 flex-1 grid-rows-3 xl:grid-rows-4 gap-4 p-4">
            <Widget
              title="Mejores rentas del mes"
              icon={<LuCalendarHeart />}
              className="row-span-full col-span-2"
              size="xl"
              hasGoTo={false}
              clickable={false}
            >
              <div className="h-auto w-full">
                <header className="flex border-b mb-4 pb-2 text-xl items-center justify-between">
                  <div className="p-2 font-bold">Nombre</div>
                  <div className="p-2 font-bold">
                    <LuDollarSign />
                  </div>
                </header>
                {home.rentals_info.map((rent: any, index: number) => (
                  <RentalRow rent={rent} key={index} />
                ))}
              </div>
            </Widget>
            <Widget
              color="warning"
              icon={<LuHeartHandshake />}
              title="Rentas"
              className="col-span-1 row-span-1"
            >
              {home.rentalcount}
            </Widget>
            <Widget
              color="danger"
              icon={<LuCalendarOff />}
              title="Rentas Vencidas"
              className="col-span-1 row-span-1"
            >
              {home.timeoutcount}
            </Widget>
            <Widget
              color="info"
              icon={<LuUser2 />}
              title="Usuarios"
              className="col-span-1 row-span-1"
            >
              {home.usercount}
            </Widget>
            <Widget
              color="success"
              icon={<LuUserSquare />}
              title="Clientes"
              className="col-span-1 row-span-1"
            >
              {home.clientcount}
            </Widget>
            <Widget
              color="origin"
              icon={<LuBadgeDollarSign />}
              title="Ganancias"
              className="col-span-1 row-span-1"
            >
              <div className="text-4xl xl:text-5xl overflow-hidden">
                <span className="pe-2">$</span>
                {home.rentals_info
                  .reduce((acc: any, rent: any) => acc + Number(rent.total), 0)
                  .toFixed(2)}
              </div>
            </Widget>
            <Widget
              color="sadness"
              icon={<LuPhoneOutgoing />}
              title="Llamadas"
              className="col-span-1 row-span-1"
            >
              {home.calls}
            </Widget>
          </main>
        ) : (
          <Loading />
        )}
      </AppLayout.Content>
    </AppLayout>
  )
}

const RentalRow = ({ rent }: { rent: { nombre: string; total: string } }): ReactElement => {
  const [showIcon, setShowIcon] = useState(false)

  return (
    <button
      className="flex relative w-full text-xl mb-2 items-center justify-between p-2 py-4 text-purple-500 bg-purple-100 rounded-xl active:bg-purple-200 transition-all active:scale-[99%]"
      onMouseEnter={() => setShowIcon(true)}
      onMouseLeave={() => setShowIcon(false)}
    >
      {showIcon && (
        <div className="text-3xl ps-4 animate animate-fade-up animate-duration-150 absolute ">
          <LuReply />
        </div>
      )}
      <div
        className={cn(
          'ms-4 w-full text-lg text-start text-wrap transition-all',
          showIcon ? 'ps-12' : ''
        )}
      >
        {rent.nombre}
      </div>
      <div className="text-white p-2 bg-purple-300 rounded-xl">
        <span className="pe-1">$</span>
        {parseFloat(rent.total).toFixed(2)}
      </div>
    </button>
  )
}
