'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { BreathingExercise } from '@/components/breathe/breathing-exercise'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Video = {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
}

const BODY_SCAN = [
  'Relax your forehead and jaw',
  'Drop your shoulders away from your ears',
  'Unclench your hands',
  'Soften your belly — breathe naturally',
  'Feel your feet grounded on the floor',
  'Notice one thing you are grateful for today',
]

export default function BreathePage() {
  const [meditationVideos, setMeditationVideos] = useState<Video[]>([])
  const [musicVideos, setMusicVideos] = useState<Video[]>([])
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/media/videos?category=meditation')
      .then((r) => r.json())
      .then((d) => d.success && setMeditationVideos(d.data))
    fetch('/api/media/videos?category=music')
      .then((r) => r.json())
      .then((d) => d.success && setMusicVideos(d.data))
  }, [])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Breathe & Relax</h1>
        <p className="text-sm text-brand-text/60">
          Calm your nervous system — works offline too
        </p>
      </header>

      <BreathingExercise />

      <Card>
        <CardContent className="p-5">
          <h3 className="mb-3 font-semibold">Body scan checklist</h3>
          <ul className="space-y-2">
            {BODY_SCAN.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-brand-text/80">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-teal" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Tabs defaultValue="meditation">
        <TabsList className="w-full">
          <TabsTrigger value="meditation" className="flex-1">
            Guided meditation
          </TabsTrigger>
          <TabsTrigger value="music" className="flex-1">
            Study lo-fi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meditation" className="space-y-3">
          {activeVideo && (
            <div className="aspect-video overflow-hidden rounded-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Guided meditation"
              />
            </div>
          )}
          {meditationVideos.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setActiveVideo(video.id)}
              className="flex w-full gap-3 rounded-2xl border border-brand-purple/10 bg-white p-3 text-left transition-colors hover:border-brand-purple/30"
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={80}
                height={60}
                className="rounded-lg object-cover"
              />
              <div>
                <p className="line-clamp-2 text-sm font-medium">{video.title}</p>
                <p className="text-xs text-brand-text/50">{video.channelTitle}</p>
              </div>
            </button>
          ))}
        </TabsContent>

        <TabsContent value="music" className="space-y-3">
          {musicVideos.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setActiveVideo(video.id)}
              className="flex w-full gap-3 rounded-2xl border border-brand-purple/10 bg-white p-3 text-left transition-colors hover:border-brand-purple/30"
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={80}
                height={60}
                className="rounded-lg object-cover"
              />
              <div>
                <p className="line-clamp-2 text-sm font-medium">{video.title}</p>
                <p className="text-xs text-brand-text/50">{video.channelTitle}</p>
              </div>
            </button>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
