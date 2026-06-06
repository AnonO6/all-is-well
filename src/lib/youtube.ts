import { env } from '@/lib/env'

type YouTubeVideo = {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
}

const MEDITATION_QUERIES = [
  'guided meditation exam stress relief',
  'breathing exercise calm mind',
  'lofi study music focus',
]

let keyIndex = 0

function getYouTubeKeys() {
  return [env.YOUTUBE_API_KEY_ONE, env.YOUTUBE_API_KEY_TWO, env.YOUTUBE_API_KEY_THREE].filter(
    (key): key is string => Boolean(key),
  )
}

function getNextKey() {
  const keys = getYouTubeKeys()
  const key = keys[keyIndex % keys.length]
  keyIndex += 1
  return key
}

export async function searchWellnessVideos(category: 'meditation' | 'music' = 'meditation') {
  const query =
    category === 'music'
      ? 'lofi study beats calm focus'
      : MEDITATION_QUERIES[Math.floor(Math.random() * MEDITATION_QUERIES.length)]

  const apiKey = getNextKey()
  if (!apiKey) return []

  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '6',
    videoEmbeddable: 'true',
    safeSearch: 'strict',
    key: apiKey,
  })

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
    { next: { revalidate: 3600 } },
  )

  if (!response.ok) {
    return []
  }

  const data = (await response.json()) as {
    items: Array<{
      id: { videoId: string }
      snippet: {
        title: string
        channelTitle: string
        thumbnails: { medium: { url: string } }
      }
    }>
  }

  return data.items.map(
    (item): YouTubeVideo => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
    }),
  )
}
