import { cn } from '@renderer/utils'
import { ReactElement, ReactNode, useState } from 'react'
import { LuActivitySquare, LuArrowUpRight } from 'react-icons/lu'
import { Link } from 'wouter'

interface WidgetProps {
  icon?: ReactElement
  title: string
  children?: ReactNode
  className?: string
  color?: 'none' | 'danger' | 'success' | 'warning' | 'info' | 'origin' | 'sadness'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  hasGoTo?: boolean
  clickable?: boolean
  href?: string
}

export const Widget = ({
  icon,
  title,
  children,
  className,
  color = 'none',
  size = 'md',
  hasGoTo = true,
  clickable = true,
  href = ''
}: WidgetProps): ReactElement => {
  const [goTo, setGoTo] = useState<boolean>(false)

  const bgColor = {
    none: 'border text-black',
    danger:
      'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-100 from-0% to-transparent to-70% text-red-400 border border-red-500/30',
    success:
      'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-100 from-0% to-transparent to-70% text-green-500 border border-green-500/30',
    warning:
      'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-100 from-0% to-transparent to-70% text-amber-400 border border-amber-500/30',
    info: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100 from-0% to-transparent to-70% text-blue-500 border border-blue-500/30',
    origin:
      'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-100 from-0% to-transparent to-70% text-orange-500 border border-orange-500/30',
    sadness:
      'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-100 from-0% to-transparent to-70% text-fuchsia-500 border border-fuchsia-500/30'
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
      <Link to={href}>
        <header className="w-full flex items-center p-2 gap-1 ">
          <section className="flex">
            <article className="text-2xl p-1 rounded-full">
              {icon ? icon : <LuActivitySquare />}
            </article>
          </section>
          <section className={`${titleFontSize[size]}`}>{title}</section>
        </header>
        <main className="text-6xl flex items-center justify-center p-6 2xl:pt-6 pt-4">
          {children}
        </main>
      </Link>
    </div>
  )
}
