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
          bgColor: '#F2E0FC',
          color: '#AB80C3'
        },
        2: {
          name: 'user',
          bgColor: '#D4EFFC',
          color: '#80B4CE'
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
          bgColor: '#F2E0FC',
          color: '#AB80C3'
        },
        2: {
          name: 'user',
          bgColor: '#D4EFFC',
          color: '#80B4CE'
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
          bgColor: '#F2E0FC',
          color: '#AB80C3'
        },
        2: {
          name: 'user',
          bgColor: '#D4EFFC',
          color: '#80B4CE'
        }
      }
    }
  }
]

export const _clientData: TableType = [
  {
    nombre: 'Cliente 1',
    apellido: 'Apellido 1',
    direccion: 'Dirección 1',
    telefono: '123456789',
    correo_electronico: 'cliente1@example.com',
    ultimo_alquiler: '2024-04-25T14:30:00',
    estado_alquiler: {
      value: 0,
      states: {
        '0': {
          name: 'Normal',
          bgColor: '#E9FCF1',
          color: '#47A970'
        },
        '1': {
          name: '1 Strike',
          bgColor: '#FEFFCE',
          color: '#ABAC73'
        },
        '2': {
          name: '2 Strikes',
          bgColor: '#FCF4E9',
          color: '#C59580'
        },
        '3': {
          name: '3 Strikes',
          bgColor: '#FCE9E9',
          color: '#C58080'
        }
      }
    }
  },
  {
    nombre: 'Cliente 2',
    apellido: 'Apellido 2',
    direccion: 'Dirección 2',
    telefono: '987654321',
    correo_electronico: 'cliente2@example.com',
    ultimo_alquiler: '2024-04-24T12:00:00',
    estado_alquiler: {
      value: 1,
      states: {
        '0': {
          name: 'Normal',
          bgColor: '#E9FCF1',
          color: '#47A970'
        },
        '1': {
          name: '1 Strike',
          bgColor: '#FEFFCE',
          color: '#ABAC73'
        },
        '2': {
          name: '2 Strikes',
          bgColor: '#FCF4E9',
          color: '#C59580'
        },
        '3': {
          name: '3 Strikes',
          bgColor: '#FCE9E9',
          color: '#C58080'
        }
      }
    }
  },
  {
    nombre: 'Cliente 3',
    apellido: 'Apellido 3',
    direccion: 'Dirección 3',
    telefono: '555555555',
    correo_electronico: 'cliente3@example.com',
    ultimo_alquiler: '2024-04-23T10:15:00',
    estado_alquiler: {
      value: 2,
      states: {
        '0': {
          name: 'Normal',
          bgColor: '#E9FCF1',
          color: '#47A970'
        },
        '1': {
          name: '1 Strike',
          bgColor: '#FEFFCE',
          color: '#ABAC73'
        },
        '2': {
          name: '2 Strikes',
          bgColor: '#FCF4E9',
          color: '#C59580'
        },
        '3': {
          name: '3 Strikes',
          bgColor: '#FCE9E9',
          color: '#C58080'
        }
      }
    }
  }
]
