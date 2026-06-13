import { OMDBMovie } from '@/types'

const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || 'b9a5e69d'

export async function fetchMovieInfo(title: string, type: 'movie' | 'tv'): Promise<OMDBMovie | null> {
  try {
    const omdbType = type === 'tv' ? 'series' : 'movie'
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}&type=${omdbType}`
    )
    const data: OMDBMovie = await res.json()
    if (data.Response === 'True') return data
    return null
  } catch {
    return null
  }
}
