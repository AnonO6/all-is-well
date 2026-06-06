'use client'

import { useEffect, useRef, useState } from 'react'
import { VoiceProvider, useVoice } from '@humeai/voice-react'
import { Mic, MicOff, PhoneOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { extractProsodyScores } from '@/lib/hume-emotions'

function VoiceControls() {
  const { connect, disconnect, status, messages } = useVoice()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const postedSnapshots = useRef(new Set<string>())
  const configId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID

  const isConnected = status.value === 'connected'
  const isConnecting = status.value === 'connecting'

  useEffect(() => {
    for (const message of messages) {
      if (message.type !== 'user_message') continue

      const snapshotKey = `${message.receivedAt.getTime()}`
      if (postedSnapshots.current.has(snapshotKey)) continue

      const emotions = extractProsodyScores(message)
      if (!emotions) continue

      postedSnapshots.current.add(snapshotKey)
      void fetch('/api/emotion-snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'rancho', emotions }),
      })
    }
  }, [messages])

  const handleStart = async () => {
    setError(null)
    try {
      const response = await fetch('/api/hume-token')
      const result = await response.json()
      if (!result.success) {
        setError(result.message ?? 'Could not start voice session')
        return
      }
      setAccessToken(result.data.accessToken)
      if (!configId) {
        setError('Add NEXT_PUBLIC_HUME_CONFIG_ID to your .env file')
        return
      }
      await connect({
        auth: { type: 'accessToken', value: result.data.accessToken },
        configId,
      })
    } catch {
      setError('Failed to connect to Rancho. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-brand-purple/20 to-brand-teal/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`h-24 w-24 rounded-full bg-brand-orange/20 ${
                isConnected ? 'animate-pulse' : ''
              }`}
            />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-lg font-semibold text-brand-text">Talk to Rancho</p>
            <p className="text-sm text-brand-text/60">
              {isConnected
                ? 'Sun raha hoon... dil bhi, awaaz bhi'
                : 'All is well, buddy? Bol — Rancho sun raha hai'}
            </p>
          </div>
        </div>
        <CardContent className="flex flex-col items-center gap-4 py-6">
          {!isConnected ? (
            <Button
              size="lg"
              onClick={handleStart}
              disabled={isConnecting}
              className="gap-2"
            >
              <Mic className="h-5 w-5" />
              {isConnecting ? 'Connecting...' : 'Start talking'}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="secondary"
              onClick={() => disconnect()}
              className="gap-2"
            >
              <PhoneOff className="h-5 w-5" />
              End session
            </Button>
          )}
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          {!configId && !error && (
            <p className="text-center text-sm text-brand-text/50">
              Talk to Rancho needs a Hume EVI config. Add keys to .env to enable.
            </p>
          )}
          <p className="max-w-xs text-center text-xs text-brand-text/50">
            Hume reads voice emotions in the background for care — you only see
            positive vibes here, never stress scores.
          </p>
        </CardContent>
      </Card>

      {messages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent className="max-h-64 space-y-3 overflow-y-auto">
            {messages
              .filter(
                (m) => m.type === 'user_message' || m.type === 'assistant_message',
              )
              .map((message) => {
                const content =
                  'message' in message &&
                  typeof message.message === 'object' &&
                  message.message?.content
                    ? message.message.content
                    : ''

                if (!content) return null

                return (
                  <div
                    key={`${message.type}-${message.receivedAt.getTime()}`}
                    className={`rounded-2xl px-4 py-2 text-sm ${
                      message.type === 'user_message'
                        ? 'ml-8 bg-brand-purple/10 text-brand-text'
                        : 'mr-8 bg-brand-orange/10 text-brand-text'
                    }`}
                  >
                    <span className="font-medium capitalize">
                      {message.type === 'user_message' ? 'You' : 'Rancho'}:
                    </span>{' '}
                    {content}
                  </div>
                )
              })}
          </CardContent>
        </Card>
      )}

      {!accessToken && (
        <div className="flex items-center justify-center gap-2 text-xs text-brand-text/40">
          <MicOff className="h-3 w-3" />
          Microphone access required after you tap Start
        </div>
      )}
    </div>
  )
}

export function VoiceChat() {
  return (
    <VoiceProvider>
      <VoiceControls />
    </VoiceProvider>
  )
}
