export function computeInternalStressLevel(
  moodScore: number,
  energyLevel: number,
): number {
  const raw = 11 - moodScore * 0.6 - energyLevel * 0.4
  return Math.min(10, Math.max(1, Math.round(raw)))
}
