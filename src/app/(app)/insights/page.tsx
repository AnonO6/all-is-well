'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'

type InsightsData = {
  days: number
  moodEntries: Array<{
    date: string
    moodScore: number
    stressLevel: number
  }>
  triggerBreakdown: Array<{ type: string; label: string; count: number }>
  averageMood: number | null
  averageStress: number | null
  summary: string | null
  examType: string
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [days, setDays] = useState<7 | 30>(7)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/insights?days=${days}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setInsights(data.data)
        setLoading(false)
      })
  }, [days])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Your Insights</h1>
        <p className="text-sm text-brand-text/60">
          Patterns in your wellness journey
        </p>
      </header>

      <Tabs
        value={String(days)}
        onValueChange={(v) => setDays(Number(v) as 7 | 30)}
      >
        <TabsList className="w-full">
          <TabsTrigger value="7" className="flex-1">
            7 days
          </TabsTrigger>
          <TabsTrigger value="30" className="flex-1">
            30 days
          </TabsTrigger>
        </TabsList>

        <TabsContent value={String(days)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-brand-orange">
                  {insights?.averageMood?.toFixed(1) ?? '—'}
                </p>
                <p className="text-xs text-brand-text/60">Avg mood</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-brand-purple">
                  {insights?.averageStress?.toFixed(1) ?? '—'}
                </p>
                <p className="text-xs text-brand-text/60">Avg stress</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mood trend</CardTitle>
            </CardHeader>
            <CardContent className="h-56">
              {insights?.moodEntries.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={insights.moodEntries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#7C6FCD20" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis domain={[1, 10]} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="moodScore"
                      stroke="#FF8C42"
                      strokeWidth={2}
                      name="Mood"
                    />
                    <Line
                      type="monotone"
                      dataKey="stressLevel"
                      stroke="#7C6FCD"
                      strokeWidth={2}
                      name="Stress"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-sm text-brand-text/50">
                  No data yet — start with a check-in!
                </p>
              )}
            </CardContent>
          </Card>

          {insights?.triggerBreakdown.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Stress triggers</CardTitle>
              </CardHeader>
              <CardContent className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={insights.triggerBreakdown} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={120}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#7C6FCD" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : null}

          {insights?.summary && (
            <Card className="border-brand-teal/20 bg-brand-teal/5">
              <CardHeader>
                <CardTitle>AI wellness summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-brand-text">
                  {insights.summary}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
