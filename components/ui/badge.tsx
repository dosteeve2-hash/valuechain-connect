import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#D4AF37]/20 text-[#D4AF37]',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive/20 text-red-400',
        outline: 'text-foreground border-border',
        gold: 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]',
        cyan: 'border-[#00BCD4]/30 bg-[#00BCD4]/10 text-[#00BCD4]',
        green: 'border-green-500/30 bg-green-500/10 text-green-400',
        orange: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
        red: 'border-red-500/30 bg-red-500/10 text-red-400',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
