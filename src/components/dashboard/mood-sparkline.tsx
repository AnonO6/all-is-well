'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

type MoodSparklineProps = {
  data: Array<{ date: string; moodScore: number }>
}

export function MoodSparkline({ data }: MoodSparklineProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl bg-brand-purple/5 text-sm text-brand-text/50">
        Check in daily to see your mood trend
      </div>
    )
  }

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            tickFormatter={(v: string) => v.slice(5)}
            stroke="#7C6FCD"
          />
          <YAxis domain={[1, 10]} tick={{ fontSize: 10 }} stroke="#7C6FCD" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="moodScore"
            stroke="#FF8C42"
            strokeWidth={3}
            dot={{ fill: '#7C6FCD', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
