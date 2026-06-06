import { VoiceChat } from '@/components/guru/voice-chat'

export default function GuruPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Talk to Guru</h1>
        <p className="text-sm text-brand-text/60">
          A calm voice mentor for exam stress — tap Start to begin
        </p>
      </header>
      <VoiceChat />
    </div>
  )
}
