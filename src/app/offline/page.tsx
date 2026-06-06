import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Wind } from 'lucide-react'
import { PAGE_COPY } from '@/lib/rancho-copy'

const copy = PAGE_COPY.offline

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <Wind className="h-16 w-16 text-brand-purple" />
      <h1 className="text-2xl font-bold">{copy.title}</h1>
      <p className="max-w-sm text-brand-text/60">{copy.subtitle}</p>
      <Link href="/breathe">
        <Button>{copy.cta}</Button>
      </Link>
    </div>
  )
}
