'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Pattern = {
  name: string
  inhale: number
  hold: number
  exhale: number
  pause: number
  description: string
}

const PATTERNS: Pattern[] = [
  {
    name: 'Box Breathing',
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 4,
    description: 'Exam se pehle pressure cooker ko thanda kar.',
  },
  {
    name: '4-7-8 Relax',
    inhale: 4,
    hold: 7,
    exhale: 8,
    pause: 0,
    description: 'Slow exhale — dimaag ka traffic kam kar.',
  },
]

type Phase = 'inhale' | 'hold' | 'exhale' | 'pause'

export function BreathingExercise() {
  const [pattern, setPattern] = useState<Pattern>(PATTERNS[0])
  const [active, setActive] = useState(false)
  const [phase, setPhase] = useState<Phase>('inhale')
  const [countdown, setCountdown] = useState(pattern.inhale)

  useEffect(() => {
    if (!active) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1

        const phases: Phase[] = ['inhale', 'hold', 'exhale', 'pause']
        const currentIndex = phases.indexOf(phase)
        let nextPhase = phases[(currentIndex + 1) % phases.length] as Phase

        if (nextPhase === 'pause' && pattern.pause === 0) {
          nextPhase = 'inhale'
        }

        setPhase(nextPhase)
        const durations: Record<Phase, number> = {
          inhale: pattern.inhale,
          hold: pattern.hold,
          exhale: pattern.exhale,
          pause: pattern.pause,
        }
        return durations[nextPhase]
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [active, phase, pattern])

  const scale =
    phase === 'inhale'
      ? 1.2
      : phase === 'hold'
        ? 1.2
        : phase === 'exhale'
          ? 0.8
          : 0.9

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pattern.name}</CardTitle>
        <p className="text-sm text-brand-text/60">{pattern.description}</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {PATTERNS.map((p) => (
            <Button
              key={p.name}
              variant={pattern.name === p.name ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setPattern(p)
                setPhase('inhale')
                setCountdown(p.inhale)
                setActive(false)
              }}
            >
              {p.name}
            </Button>
          ))}
        </div>

        <div className="relative flex h-48 w-48 items-center justify-center">
          <div
            className="absolute rounded-full bg-brand-orange/20 transition-transform duration-1000 ease-in-out"
            style={{
              width: '160px',
              height: '160px',
              transform: `scale(${scale})`,
            }}
          />
          <div className="relative z-10 text-center">
            <p className="text-2xl font-bold capitalize text-brand-text">{phase}</p>
            <p className="text-4xl font-semibold text-brand-orange">{countdown}</p>
          </div>
        </div>

        <Button onClick={() => setActive(!active)} size="lg">
          {active ? 'Pause' : 'Begin'}
        </Button>
      </CardContent>
    </Card>
  )
}
