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
    danger: 'bg-red-50  text-red-400 border border-red-500/30',
    success: 'bg-green-50  text-green-500 border border-green-500/30',
    warning: 'bg-yellow-50  text-amber-400 border border-amber-500/30',
    info: 'bg-blue-50  text-blue-500 border border-blue-500/30',
    origin: 'bg-orange-50  text-orange-500 border border-orange-500/30',
    sadness: 'bg-purple-50  text-fuchsia-500 border border-fuchsia-500/30'
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
      {hasGoTo ? (
        <Link to={href} className="h-full">
          <WidgetContent icon={icon} fontSize={titleFontSize[size]} title={title}>
            {children}
          </WidgetContent>
        </Link>
      ) : (
        <>
          <WidgetContent icon={icon} fontSize={titleFontSize[size]} title={title}>
            {children}
          </WidgetContent>
        </>
      )}
    </div>
  )
}

interface WidgetContentProps {
  icon?: ReactElement
  fontSize: string
  title: string
  children: ReactNode
}

const WidgetContent = ({
  icon,
  fontSize,
  title,
  children,
  ...props
}: WidgetContentProps): ReactElement => (
  <>
    <header className="w-full flex items-center p-2 gap-1 " {...props}>
      <section className="flex">
        <article className="text-2xl p-1 rounded-full">
          {icon ? icon : <LuActivitySquare />}
        </article>
      </section>
      <section className={`${fontSize}`}>{title}</section>
    </header>
    <main className="text-6xl h-full flex items-start justify-center p-6 2xl:pt-6 pt-2">
      {children}
    </main>
  </>
)
