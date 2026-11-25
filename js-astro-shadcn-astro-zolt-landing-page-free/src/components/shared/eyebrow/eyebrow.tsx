import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type EyebrowProps = {
  children: ReactNode
  className?: string
}

const Eyebrow = ({ children, className }: EyebrowProps) => {
  return <p className={cn('text-accent text-[22px] font-medium italic', className)}>{`// ${children}`}</p>
}

export default Eyebrow
