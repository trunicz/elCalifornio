import { cn } from '@renderer/utils'
import { ReactElement, ReactNode, useState } from 'react'
import { LuActivitySquare, LuArrowUpRight } from 'react-icons/lu'

interface WidgetProps {
  icon?: ReactElement
  title: string
  children?: ReactNode
  className?: string
  color?: 'none' | 'danger' | 'success' | 'warning' | 'info' | 'origin' | 'sadness'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  hasGoTo?: boolean
  clickable?: boolean
}

export const Widget = ({
  icon,
  title,
  children,
  className,
  color = 'none',
  size = 'md',
  hasGoTo = true,
  clickable = true
}: WidgetProps): ReactElement => {
  const [goTo, setGoTo] = useState<boolean>(false)

  const bgColor = {
    none: 'bg-transparent border text-black',
    danger: 'bg-red-100 text-red-400 border border-red-500',
    success: 'bg-green-100 text-green-500 border border-green-500',
    warning: 'bg-amber-100 text-amber-400 border border-amber-500',
    info: 'bg-blue-100 text-blue-500 border border-blue-500',
    origin: 'bg-orange-100 text-orange-500 border border-orange-500',
    sadness: 'bg-fuchsia-100 text-fuchsia-500 border border-fuchsia-500'
  }

  const titleFontSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
  }

  return (
    <div
      className={cn(
        'rounded-xl text-xl relative overflow-hidden transition-all',
        bgColor[color],
        clickable ? 'active:scale-[96%]' : '',
        className
      )}
      onMouseEnter={() => setGoTo(true)}
      onMouseLeave={() => setGoTo(false)}
    >
      {goTo && hasGoTo && (
        <div className="animate animate-fade-up animate-duration-100 absolute p-2 text-2xl top-0 right-0 rounded-b-full">
          <LuArrowUpRight />
        </div>
      )}
      <header className="w-full flex items-center p-2 gap-2 ">
        <section className="flex">
          <article className="text-2xl p-1 rounded-full">
            {icon ? icon : <LuActivitySquare />}
          </article>
        </section>
        <section className={`${titleFontSize[size]}`}>{title}</section>
      </header>
      <main className="text-6xl flex items-center justify-center p-6">{children}</main>
    </div>
  )
}
