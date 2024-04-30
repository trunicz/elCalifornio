import { ReactElement } from 'react'
import { useLocation } from 'wouter'

export const ErrorPage = (): ReactElement => {
  const [location, setLocation] = useLocation()
  if (!location) console.log(location)

  return (
    <main
      className="bg-red-600 flex flex-col justify-center items-center h-full"
      onClick={() => setLocation('/app')}
    >
      <h1 className="text-4xl font-sans font-bold">ERROR 0x19923100</h1>
      <span>click para continuar</span>
    </main>
  )
}
