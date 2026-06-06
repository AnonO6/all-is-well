import * as React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-2xl border border-brand-purple/10 bg-white px-4 py-2 text-sm text-brand-text placeholder:text-brand-text/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/30',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export { Input }
