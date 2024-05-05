import { ComponentProps, ReactElement, useState } from 'react'
import { Button } from '../button'
import { cn } from '@renderer/utils'
import { LuX } from 'react-icons/lu'

interface ModalProps extends ComponentProps<'div'> {
  buttonText: string
  title?: string
}

export const Modal = ({ className, title, buttonText, children }: ModalProps): ReactElement => {
  const [showModal, setShowModal] = useState(false)

  const openModal = (): void => {
    setShowModal(true)
  }

  const closeModal = (): void => {
    setShowModal(false)
  }

  return (
    <div className={cn('', className)}>
      <Button onClick={openModal} className="px-4 py-2">
        {buttonText}
      </Button>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="animate-fade-up animate-duration-300 animate-ease-in-out flex flex-col w-80 h-auto p-4 bg-main rounded-xl text-center gap-4">
            <div className="border-b-2 flex justify-end">
              <span className="me-auto">{title}</span>
              <button
                onClick={closeModal}
                className="px-2 active:scale-95 text-2xl text-gray-300 hover:text-red-300 transition-colors"
              >
                <LuX />
              </button>
            </div>
            {children}
            <Button
              onClick={closeModal}
              className="bg-accent text-white border-0"
              text="Continuar"
            />
          </div>
        </div>
      )}
    </div>
  )
}
