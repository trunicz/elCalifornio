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
