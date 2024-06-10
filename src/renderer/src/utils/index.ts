import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ReactNode } from 'react'

export const cn = (...args: ClassValue[]): string => {
  return twMerge(clsx(...args))
}

export function formatDate(dateString: string): ReactNode {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/

  if (!iso8601Regex.test(dateString)) {
    return dateString
  }

  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return dateString
  }

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }

  const formatter = new Intl.DateTimeFormat('default', options)
  return formatter.format(date)
}

export function convertirNumeroALetras(num: number): string {
  const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE']
  const decenas = [
    '',
    'DIEZ',
    'VEINTE',
    'TREINTA',
    'CUARENTA',
    'CINCUENTA',
    'SESENTA',
    'SETENTA',
    'OCHENTA',
    'NOVENTA'
  ]
  const centenas = [
    '',
    'CIENTO',
    'DOSCIENTOS',
    'TRESCIENTOS',
    'CUATROCIENTOS',
    'QUINIENTOS',
    'SEISCIENTOS',
    'SETECIENTOS',
    'OCHOCIENTOS',
    'NOVECIENTOS'
  ]
  const especiales = [
    'DIEZ',
    'ONCE',
    'DOCE',
    'TRECE',
    'CATORCE',
    'QUINCE',
    'DIECISEIS',
    'DIECISIETE',
    'DIECIOCHO',
    'DIECINUEVE'
  ]

  function convertirDecenas(num: number): string {
    if (num < 10) {
      return unidades[num]
    } else if (num < 20) {
      return especiales[num - 10]
    } else {
      const decena = Math.floor(num / 10)
      const unidad = num % 10
      return decenas[decena] + (unidad > 0 ? ' Y ' + unidades[unidad] : '')
    }
  }

  function convertirCentenas(num: number): string {
    if (num === 100) {
      return 'CIEN'
    } else {
      const centena = Math.floor(num / 100)
      const resto = num % 100
      return centenas[centena] + (resto > 0 ? ' ' + convertirDecenas(resto) : '')
    }
  }

  function convertirMiles(num: number): string {
    if (num < 1000) {
      return convertirCentenas(num)
    } else {
      const miles = Math.floor(num / 1000)
      const resto = num % 1000
      return (
        (miles === 1 ? 'MIL' : convertirCentenas(miles) + ' MIL') +
        (resto > 0 ? ' ' + convertirCentenas(resto) : '')
      )
    }
  }

  function convertirMillones(num: number): string {
    if (num < 1000000) {
      return convertirMiles(num)
    } else {
      const millones = Math.floor(num / 1000000)
      const resto = num % 1000000
      return (
        (millones === 1 ? 'UN MILLÓN' : convertirCentenas(millones) + ' MILLONES') +
        (resto > 0 ? ' ' + convertirMiles(resto) : '')
      )
    }
  }

  const parteEntera = Math.floor(num)
  const parteDecimal = Math.round((num - parteEntera) * 100)

  const numeroEnLetras = convertirMillones(parteEntera)
  const decimalesEnLetras = parteDecimal < 10 ? '0' + parteDecimal : parteDecimal.toString()

  return `$${num?.toFixed(2)} (${numeroEnLetras} PESOS ${decimalesEnLetras}/100 M.N.)`
}
