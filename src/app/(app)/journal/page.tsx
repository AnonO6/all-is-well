'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { MoodPicker } from '@/components/mood/mood-picker'
import { formatDate, getMoodEmoji } from '@/lib/utils'
import { DEFAULT_JOURNAL_PROMPTS, PAGE_COPY } from '@/lib/rancho-copy'
import { Loader2 } from 'lucide-react'

const copy = PAGE_COPY.journal

type JournalEntry = {
  id: string
  prompt: string
  response: string
  mood_before: number | null
  mood_after: number | null
  created_at: string
}

function pickDefaultPrompt() {
  return DEFAULT_JOURNAL_PROMPTS[
    Math.floor(Math.random() * DEFAULT_JOURNAL_PROMPTS.length)
  ]
}

export default function JournalPage() {
  const [prompt, setPrompt] = useState(pickDefaultPrompt)
  const [response, setResponse] = useState('')
  const [moodBefore, setMoodBefore] = useState(5)
  const [moodAfter, setMoodAfter] = useState<number | null>(null)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loadingPrompt, setLoadingPrompt] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showMoodAfter, setShowMoodAfter] = useState(false)

  const loadEntries = async () => {
    const res = await fetch('/api/journal')
    const data = await res.json()
    if (data.success) setEntries(data.data)
  }

  const generatePrompt = async () => {
    setLoadingPrompt(true)
    setError('')
    const res = await fetch('/api/journal/prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moodScore: moodBefore }),
    })
    const data = await res.json()
    if (data.success) {
      setPrompt(data.data.prompt)
    } else {
      setError(data.message ?? 'Could not fetch a new prompt right now.')
    }
    setLoadingPrompt(false)
  }

  const saveEntry = async () => {
    if (!prompt || !response) return
    setSaving(true)
    setError('')
    const res = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        response,
        moodBefore,
        moodAfter: moodAfter ?? undefined,
      }),
    })
    const data = await res.json()
    if (res.ok && data.success) {
      setResponse('')
      setMoodAfter(null)
      setShowMoodAfter(false)
      setPrompt(pickDefaultPrompt())
      await loadEntries()
    } else {
      setError(data.message ?? 'Could not save your entry.')
    }
    setSaving(false)
  }

  useEffect(() => {
    loadEntries()
  }, [])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{copy.title}</h1>
        <p className="text-sm text-brand-text/60">{copy.subtitle}</p>
      </header>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Rancho ka sawaal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingPrompt ? (
            <div className="flex items-center gap-2 text-brand-text/50">
              <Loader2 className="h-4 w-4 animate-spin" />
              {copy.promptLoading}
            </div>
          ) : (
            <p className="text-brand-text italic">&ldquo;{prompt}&rdquo;</p>
          )}
          <Button variant="outline" size="sm" onClick={generatePrompt}>
            {copy.newPrompt}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.moodBefore}</CardTitle>
        </CardHeader>
        <CardContent>
          <MoodPicker value={moodBefore} onChange={setMoodBefore} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.reflection}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={copy.reflectionPlaceholder}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
          {!showMoodAfter ? (
            <Button
              onClick={() => setShowMoodAfter(true)}
              disabled={!response.trim()}
            >
              {copy.saveMood}
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium">{copy.moodAfter}</p>
              <MoodPicker
                value={moodAfter ?? 5}
                onChange={(v) => setMoodAfter(v)}
              />
              <Button onClick={saveEntry} disabled={saving}>
                {saving ? copy.saving : copy.save}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">{copy.past}</h2>
          <div className="space-y-3">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="p-4">
                  <p className="text-xs text-brand-text/50">
                    {formatDate(entry.created_at)}
                  </p>
                  <p className="mt-1 text-sm italic text-brand-purple">
                    {entry.prompt}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm text-brand-text">
                    {entry.response}
                  </p>
                  {(entry.mood_before || entry.mood_after) && (
                    <p className="mt-2 text-xs text-brand-text/60">
                      Mood:{' '}
                      {entry.mood_before
                        ? getMoodEmoji(entry.mood_before)
                        : '—'}{' '}
                      →{' '}
                      {entry.mood_after
                        ? getMoodEmoji(entry.mood_after)
                        : '—'}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
