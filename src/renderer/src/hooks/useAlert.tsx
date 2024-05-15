import { cn } from '@renderer/utils'
import { ReactElement, useState } from 'react'
import { LuCopy, LuX } from 'react-icons/lu'

type AlertType = 'danger' | 'success' | 'info' | 'warning' | 'expression'

interface Alert {
  Alert: ReactElement
  emitAlert: (message: string, type: AlertType, copyText?: string) => void
}
export const useAlert = (): Alert => {
  const [alert, setAlert] = useState<{
    message: string
    copyText?: string
    type: AlertType
    visible: boolean
    copied: boolean
    className: string
  }>({ message: '', type: 'info', visible: false, copied: false, className: '' })

  const emitAlert = (message: string, type: AlertType, copyText?: string): void => {
    setAlert({ message, copyText, type, visible: true, copied: false, className: '' })
    setTimeout(() => setAlert((prevState) => ({ ...prevState, visible: false })), 15000)
  }

  const closeAlert = (): void => {
    setAlert((prevState) => ({ ...prevState, visible: false }))
  }

  const copyText = (): void => {
    const textToCopy = alert.copyText || alert.message
    navigator.clipboard.writeText(textToCopy)
    setAlert((prevState) => ({ ...prevState, copied: true }))

    setTimeout(() => setAlert((prevState) => ({ ...prevState, copied: false })), 5000)
  }

  const Alert = (
    <>
      {alert.visible && (
        <div
          className={cn(
            `animate-jump duration-100 absolute bottom-4 px-4 right-4 z-10 p-2 rounded-md flex items-center justify-between`,
            getAlertClasses(alert.type),
            alert.className
          )}
          onClick={copyText}
        >
          <span>{alert.message}</span>
          {alert.copied ? (
            <span className="focus:outline-none gap-2 text-xs text-white mx-4 bg-black/20 p-2 rounded-lg">
              Copiado!
            </span>
          ) : (
            <button
              type="button"
              className="focus:outline-none mx-4 bg-black/20 p-2 rounded-lg"
              title="Copiar"
            >
              <LuCopy />
            </button>
          )}
          <button
            type="button"
            onClick={closeAlert}
            className="focus:outline-none p-2 bg-black/20 rounded-lg"
            title="Cerrar"
          >
            <LuX />
          </button>
        </div>
      )}
    </>
  )

  return { Alert, emitAlert }
}

const getAlertClasses = (type: AlertType): string => {
  switch (type) {
    case 'danger':
      return 'bg-red-500 text-white'
    case 'success':
      return 'bg-emerald-500 text-white'
    case 'info':
      return 'bg-blue-500 text-white'
    case 'warning':
      return 'bg-amber-500 text-black'
    case 'expression':
      return 'bg-purple-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}
