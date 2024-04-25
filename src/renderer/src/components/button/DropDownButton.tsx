import { Menu } from '@headlessui/react'
import { ReactElement } from 'react'
import { Link } from 'wouter'

export const DropDownButton = (): ReactElement => {
  return (
    <Menu>
      <Menu.Button className="border-2 border-stroke active:scale-95 transition-all duration-150 bg-secondary hover:text-white hover:bg-primary">
        nombre usr
      </Menu.Button>
      <Menu.Items className="absolute mt-14 drop-shadow-2xl bg-primary border-2 border-stroke flex flex-col">
        <Menu.Item>
          <Link
            className="active:bg-primary active:scale-95 bg-main active:text-white hover:text-white hover:bg-primary text-black p-3 transition-all duration-150"
            to="/"
          >
            Configuración de perfil
          </Link>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}
