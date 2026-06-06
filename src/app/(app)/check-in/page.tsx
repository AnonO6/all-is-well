'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoodPicker } from '@/components/mood/mood-picker'
import { TriggerChips } from '@/components/mood/trigger-chips'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { getMoodLabel } from '@/lib/utils'
import type { TriggerType } from '@/types/database'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

const STEPS = ['Mood', 'Energy & Stress', 'Triggers', 'Reflect']

export default function CheckInPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [moodScore, setMoodScore] = useState(5)
  const [energyLevel, setEnergyLevel] = useState(5)
  const [stressLevel, setStressLevel] = useState(5)
  const [triggers, setTriggers] = useState<TriggerType[]>([])
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
        stressLevel,
        triggers,
        note: note || undefined,
      }),
    })
    setLoading(false)
    if (response.ok) {
      setDone(true)
      setTimeout(() => router.push('/'), 1500)
    }
  }

  if (done) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-brand-teal/20 p-6">
          <Check className="h-12 w-12 text-brand-teal" />
        </div>
        <h2 className="text-2xl font-bold">You showed up for yourself today</h2>
        <p className="text-brand-text/60">That matters more than you know.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-brand-text/60">
          Step {step + 1} of {STEPS.length}
        </p>
        <h1 className="text-2xl font-bold">Daily Check-In</h1>
        <div className="mt-3 flex gap-1">
          {STEPS.map((s, i) => (
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
            <CardTitle>How are you feeling?</CardTitle>
            <p className="text-sm text-brand-text/60">
              {getMoodLabel(moodScore)} — tap the face that fits
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
            <CardTitle>Energy & stress levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Energy</span>
                <span className="font-semibold text-brand-orange">{energyLevel}/10</span>
              </div>
              <Slider
                value={[energyLevel]}
                onValueChange={([v]) => setEnergyLevel(v)}
                min={1}
                max={10}
                step={1}
              />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Stress</span>
                <span className="font-semibold text-brand-orange">{stressLevel}/10</span>
              </div>
              <Slider
                value={[stressLevel]}
                onValueChange={([v]) => setStressLevel(v)}
                min={1}
                max={10}
                step={1}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>What&apos;s weighing on you?</CardTitle>
            <p className="text-sm text-brand-text/60">Select all that apply — no judgment</p>
          </CardHeader>
          <CardContent>
            <TriggerChips selected={triggers} onChange={setTriggers} />
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Anything else on your mind?</CardTitle>
            <p className="text-sm text-brand-text/60">Optional — even one sentence helps</p>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="I'm feeling... because..."
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
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} className="ml-auto gap-1">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={loading} className="ml-auto">
            {loading ? 'Saving...' : 'Complete check-in'}
          </Button>
        )}
      </div>
    </div>
  )
}
