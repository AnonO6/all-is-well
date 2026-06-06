import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { MoodService } from '@/services/mood/mood.service'
import { fetchWellnessImage } from '@/lib/unsplash'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoodSparkline } from '@/components/dashboard/mood-sparkline'
import { getMoodEmoji } from '@/lib/utils'
import { getDailyGreeting, RANCHO_QUOTES } from '@/lib/rancho-copy'
import {
  Sparkles,
  PenLine,
  Wind,
  MessageCircle,
  Flame,
} from 'lucide-react'

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const stats = await MoodService.getDashboardStats(userId)
  const heroImage = await fetchWellnessImage(
    stats.averageMood ? Math.round(stats.averageMood) : undefined,
  )
  const quote = RANCHO_QUOTES[new Date().getDate() % RANCHO_QUOTES.length]
  const greeting = getDailyGreeting(session.user.name ?? 'buddy')

  const sparklineData = stats.weeklyEntries.map((entry) => ({
    date: new Date(entry.created_at).toISOString().slice(5, 10),
    moodScore: entry.mood_score,
  }))

  const quickActions = [
    { href: '/check-in', label: 'Reality check', icon: Sparkles, color: 'bg-brand-orange' },
    { href: '/journal', label: 'Chupke se likh', icon: PenLine, color: 'bg-brand-purple' },
    { href: '/breathe', label: 'Saans le', icon: Wind, color: 'bg-brand-teal' },
    { href: '/rancho', label: 'Talk to Rancho', icon: MessageCircle, color: 'bg-brand-purple' },
  ]

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-brand-text/60">{greeting.eyebrow}</p>
          <h1 className="text-2xl font-bold text-brand-text">{greeting.headline}</h1>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple text-sm font-bold text-white">
          {(session.user.name?.[0] ?? 'S').toUpperCase()}
        </div>
      </header>

      <section className="space-y-2">
        <h2 className="text-lg font-medium leading-snug text-brand-text/80">
          {greeting.subline}
        </h2>
        {!stats.checkedInToday && (
          <Link href="/check-in">
            <Button className="mt-2 w-full">All is well check-in</Button>
          </Link>
        )}
      </section>

      {heroImage && (
        <Card className="overflow-hidden p-0">
          <div className="relative h-40 w-full">
            <Image
              src={heroImage.url}
              alt={heroImage.alt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <p className="absolute bottom-3 left-4 text-sm text-white/80">
              Photo by {heroImage.credit}
            </p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-brand-orange/10 p-2">
              <Flame className="h-5 w-5 text-brand-orange" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.streak}</p>
              <p className="text-xs text-brand-text/60">Din streak — Rancho proud</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="text-3xl">
              {stats.averageMood ? getMoodEmoji(Math.round(stats.averageMood)) : '🌱'}
            </span>
            <div>
              <p className="text-2xl font-bold">
                {stats.averageMood ? stats.averageMood.toFixed(1) : '—'}
              </p>
              <p className="text-xs text-brand-text/60">Weekly dil meter</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Is hafte ka scene</CardTitle>
        </CardHeader>
        <CardContent>
          <MoodSparkline data={sparklineData} />
        </CardContent>
      </Card>

      <Card className="border-brand-purple/10 bg-brand-purple/5">
        <CardContent className="p-5">
          <p className="text-sm font-medium text-brand-purple">Rancho bol raha hai</p>
          <p className="mt-2 text-brand-text">{quote}</p>
        </CardContent>
      </Card>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Kya karna hai?</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href}>
                <Card className="transition-transform hover:scale-[1.02]">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className={`rounded-full p-2 ${action.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">{action.label}</span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
