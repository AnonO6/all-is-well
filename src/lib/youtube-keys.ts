export function pickApiKey(keys: string[], seed: string): string | null {
  if (keys.length === 0) return null

  let hash = 0
  for (const char of seed) {
    hash = (hash + char.charCodeAt(0)) % keys.length
  }

  return keys[hash] ?? keys[0]
}
