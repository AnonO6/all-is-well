import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'
import { PAGE_COPY } from '@/lib/rancho-copy'

const VoiceChat = dynamic(
  () => import('@/components/rancho/voice-chat').then((mod) => mod.VoiceChat),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    ),
  },
)

export default function RanchoPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{PAGE_COPY.rancho.title}</h1>
        <p className="text-sm text-brand-text/60">{PAGE_COPY.rancho.subtitle}</p>
      </header>
      <VoiceChat />
    </div>
  )
}
