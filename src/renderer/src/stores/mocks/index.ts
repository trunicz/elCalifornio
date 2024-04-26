import { TableType } from '@renderer/types'

export const _userData: TableType = [
  {
    nombres: 'Administrador',
    apellidos: 'Principal',
    ultimo_inicio: '2024-04-20T18:20:00',
    rol: {
      value: 1,
      roles: {
        1: {
          name: 'admin',
          color: '#F2E0FC',
          textColor: '#AB80C3'
        },
        2: {
          name: 'user',
          color: '#D4EFFC',
          textColor: '#80B4CE'
        }
      }
    }
  },
  {
    nombres: 'Usuario 1',
    apellidos: 'Prueba',
    ultimo_inicio: '2024-04-20T18:20:00',
    rol: {
      value: 2,
      roles: {
        1: {
          name: 'admin',
          color: '#F2E0FC',
          textColor: '#AB80C3'
        },
        2: {
          name: 'user',
          color: '#D4EFFC',
          textColor: '#80B4CE'
        }
      }
    }
  },
  {
    nombres: 'Usuario 2',
    apellidos: 'Ejemplo',
    ultimo_inicio: '2024-04-20T18:20:00',
    rol: {
      value: 2,
      roles: {
        1: {
          name: 'admin',
          color: '#F2E0FC',
          textColor: '#AB80C3'
        },
        2: {
          name: 'user',
          color: '#D4EFFC',
          textColor: '#80B4CE'
        }
      }
    }
  }
]
