import * as React from 'react'
import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-[120px] w-full rounded-2xl border border-brand-purple/10 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/30',
      className,
    )}
    ref={ref}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export { Textarea }
