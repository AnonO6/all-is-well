'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoodPicker } from '@/components/mood/mood-picker'
import { PositiveHighlightChips } from '@/components/mood/positive-highlight-chips'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { getMoodLabel } from '@/lib/utils'
import { CHECK_IN_COPY, CHECK_IN_STEPS } from '@/lib/rancho-copy'
import type { PositiveHighlightType } from '@/types/database'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

export default function CheckInPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [moodScore, setMoodScore] = useState(5)
  const [energyLevel, setEnergyLevel] = useState(5)
  const [positiveHighlights, setPositiveHighlights] = useState<PositiveHighlightType[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async () => {
    setLoading(true)
    const response = await fetch('/api/check-ins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moodScore,
        energyLevel,
        positiveHighlights,
        note: note || undefined,
      }),
    })
    setLoading(false)
    if (response.ok) {
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 1500)
    }
  }

  if (done) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-brand-teal/20 p-6">
          <Check className="h-12 w-12 text-brand-teal" />
        </div>
        <h2 className="text-2xl font-bold">{CHECK_IN_COPY.doneTitle}</h2>
        <p className="text-brand-text/60">{CHECK_IN_COPY.doneSubtitle}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-brand-text/60">
          Step {step + 1} of {CHECK_IN_STEPS.length}
        </p>
        <h1 className="text-2xl font-bold">{CHECK_IN_COPY.title}</h1>
        <p className="text-sm text-brand-text/50">{CHECK_IN_STEPS[step]}</p>
        <div className="mt-3 flex gap-1">
          {CHECK_IN_STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full ${
                i <= step ? 'bg-brand-orange' : 'bg-brand-purple/10'
              }`}
            />
          ))}
        </div>
      </div>

      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{CHECK_IN_COPY.moodTitle}</CardTitle>
            <p className="text-sm text-brand-text/60">
              {getMoodLabel(moodScore)} — {CHECK_IN_COPY.moodHint}
            </p>
          </CardHeader>
          <CardContent>
            <MoodPicker value={moodScore} onChange={setMoodScore} />
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>{CHECK_IN_COPY.energyTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between text-sm">
              <span>{CHECK_IN_COPY.energyLabel}</span>
              <span className="font-semibold text-brand-orange">{energyLevel}/10</span>
            </div>
            <Slider
              value={[energyLevel]}
              onValueChange={([v]) => setEnergyLevel(v)}
              min={1}
              max={10}
              step={1}
            />
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>{CHECK_IN_COPY.highlightsTitle}</CardTitle>
            <p className="text-sm text-brand-text/60">{CHECK_IN_COPY.highlightsHint}</p>
          </CardHeader>
          <CardContent>
            <PositiveHighlightChips
              selected={positiveHighlights}
              onChange={setPositiveHighlights}
            />
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>{CHECK_IN_COPY.noteTitle}</CardTitle>
            <p className="text-sm text-brand-text/60">{CHECK_IN_COPY.noteHint}</p>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={CHECK_IN_COPY.notePlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
            />
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        {step < CHECK_IN_STEPS.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} className="ml-auto gap-1">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={loading} className="ml-auto">
            {loading ? CHECK_IN_COPY.saving : CHECK_IN_COPY.complete}
          </Button>
        )}
      </div>
    </div>
  )
}
