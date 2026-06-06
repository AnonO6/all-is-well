import { VoiceChat } from '@/components/rancho/voice-chat'
import { PAGE_COPY } from '@/lib/rancho-copy'

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
