import { Menu } from '@headlessui/react'
import { ReactElement } from 'react'

export const DropDownButton = (): ReactElement => {
  return (
    <Menu>
      <Menu.Button className="border-2 border-stroke active:scale-95 transition-all duration-150 bg-secondary hover:text-white hover:bg-primary">
        Opciones
      </Menu.Button>
      <Menu.Items className="absolute mt-14 drop-shadow-2xl bg-secondary border-2 border-stroke flex flex-col">
        <Menu.Item>
          {({ active }) => (
            <a className={`${active && 'bg-primary text-white'} p-4`} href="">
              Account settings
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a className={`${active && 'bg-primary text-white'} p-4`} href="">
              Documentation
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a className={`${active && 'bg-primary text-white'} p-4`} href="">
              Documentation
            </a>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}
