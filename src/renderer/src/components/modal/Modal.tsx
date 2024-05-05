import { ComponentProps, useState } from 'react'
import { LuX } from 'react-icons/lu'

interface ModalProps extends ComponentProps<'div'> {
  title?: string
}

interface Modal {
  openModal: () => void
  closeModal: () => void
  Modal: (props: ModalProps) => JSX.Element
}

export const useModal = (): Modal => {
  const [showModal, setShowModal] = useState(false)

  const openModal = (): void => {
    setShowModal(true)
  }

  const closeModal = (): void => {
    setShowModal(false)
  }

  const Modal = ({ title, children }: ModalProps): JSX.Element => (
    <>
      {showModal && (
        <div className="z-10 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="z-20 animate-fade-up animate-duration-300 animate-ease-in-out flex flex-col w-[400px] h-auto p-4 bg-main rounded-xl text-center gap-4">
            <div className="border-b-2 flex justify-end pb-2">
              <span className="me-auto">{title}</span>
              <button
                onClick={closeModal}
                className="px-2 active:scale-95 text-2xl text-gray-300 hover:text-red-300 transition-colors"
              >
                <LuX />
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  )
  return {
    openModal,
    closeModal,
    Modal
  }
}
