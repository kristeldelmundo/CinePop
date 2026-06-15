// Shared profile bits: the genre catalog and the viewer-type deriver.

export interface Genre {
  name: string
  emoji: string
  // light bg + text color for the pill when selected
  bg: string
  text: string
}

export const GENRES: Genre[] = [
  { name: 'Rom-Com', emoji: '💕', bg: '#fce8f0', text: '#c4577f' },
  { name: 'Horror', emoji: '🔪', bg: '#ede9fe', text: '#7c3aed' },
  { name: 'A24 indie', emoji: '🎭', bg: '#e0f2fe', text: '#0369a1' },
  { name: 'Ghibli', emoji: '🌸', bg: '#fce7f3', text: '#be185d' },
  { name: 'Thriller', emoji: '😰', bg: '#fef3c7', text: '#b45309' },
  { name: 'Sci-Fi', emoji: '🚀', bg: '#dbeafe', text: '#1d4ed8' },
  { name: 'K-Drama', emoji: '🇰🇷', bg: '#fae8ff', text: '#a21caf' },
  { name: 'Documentary', emoji: '🎥', bg: '#d1fae5', text: '#047857' },
  { name: 'Action', emoji: '💥', bg: '#ffedd5', text: '#c2410c' },
  { name: 'Animation', emoji: '🎨', bg: '#cffafe', text: '#0e7490' },
  { name: 'Drama', emoji: '🎬', bg: '#f1f5f9', text: '#475569' },
  { name: 'Comedy', emoji: '😂', bg: '#fef9c3', text: '#a16207' },
]

export function genreByName(name: string): Genre | undefined {
  return GENRES.find(g => g.name === name)
}

// Derive a fun "viewer type" label from genre picks + how the user rates.
// avgRating is 0 when there aren't enough reviews yet.
export function deriveViewerType(genres: string[], avgRating: number): string {
  const has = (n: string) => genres.includes(n)

  if (has('Horror') && has('Thriller')) return 'The 2am Horror Gremlin'
  if (has('Thriller')) return 'The Plot-Twist Hunter'
  if (has('Rom-Com') && has('K-Drama')) return 'The Hopeless Romantic'
  if (has('Rom-Com')) return 'The Cozy Rewatcher'
  if (has('A24 indie') || has('Documentary')) return 'The Indie Connoisseur'
  if (has('Ghibli') || has('Animation')) return 'The Animation Soul'
  if (has('Sci-Fi')) return 'The World-Builder'
  if (has('Action')) return 'The Popcorn Thrill-Seeker'

  // Fall back to rating habits if no strong genre signal
  if (avgRating >= 4.3) return 'The Generous Heart'
  if (avgRating > 0 && avgRating <= 2.8) return 'The Tough Critic'
  return 'The Curious Watcher'
}
