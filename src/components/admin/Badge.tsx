import { cn } from '@/lib/utils'

const variants = {
  green:  'bg-emerald-500/15 text-emerald-400',
  amber:  'bg-amber-500/15  text-amber-400',
  violet: 'bg-violet-500/15 text-violet-400',
  cyan:   'bg-cyan-500/15   text-cyan-400',
  blue:   'bg-blue-500/15   text-blue-400',
}

type Variant = keyof typeof variants

export default function Badge({
  children,
  variant = 'violet',
}: {
  children: React.ReactNode
  variant?: Variant
}) {
  return (
    <span className={cn('inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize', variants[variant])}>
      {children}
    </span>
  )
}
