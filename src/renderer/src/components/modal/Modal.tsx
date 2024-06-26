/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@renderer/utils'
import { ComponentProps, ReactElement, useState } from 'react'
import { LuX } from 'react-icons/lu'

interface ModalProps extends ComponentProps<'div'> {
  title?: string
}

interface Modal {
  openModal: (jsx: ReactElement | null, title?: string | null) => Promise<void>
  closeModal: () => Promise<void>
  Modal: (props: ModalProps) => ReactElement
}

export const useModal = (): Modal => {
  const [showModal, setShowModal] = useState(false)
  const [element, setElement] = useState<ReactElement | null>(null)
  const [modalTitle, setTitle] = useState<string | undefined | null>(null)

  const openModal = (jsx: ReactElement | null, title?: string | null): Promise<void> => {
    return new Promise((resolve) => {
      setTitle(title)
      setElement(jsx)
      setShowModal(true)
      resolve()
    })
  }

  const closeModal = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        setTitle(null)
        setShowModal(false)
        resolve()
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }

  const Modal = ({ title, className, children }: ModalProps): JSX.Element => {
    return (
      <>
        {showModal && (
          <div className="z-10 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div
              className={cn(
                'z-20 animate-once animate-duration-150 transform-gpu animate-ease-in-out flex flex-col w-[400px] h-auto p-4 bg-main rounded-xl text-center gap-4',
                className
              )}
            >
              <div className="border-b-2 flex justify-end pb-2">
                <span className="me-auto text-xl">{modalTitle ? modalTitle : title}</span>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-2 active:scale-95 text-2xl text-gray-300 hover:text-red-300 transition-colors"
                >
                  <LuX />
                </button>
              </div>
              {element ? element : ''}
              {children}
            </div>
          </div>
        )}
      </>
    )
  }
  return {
    openModal,
    closeModal,
    Modal
  }
}
