import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')
  const type = searchParams.get('type') || 'movie'

  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })

  const apiKey = process.env.OMDB_API_KEY || process.env.NEXT_PUBLIC_OMDB_API_KEY || 'b9a5e69d'
  const omdbType = type === 'tv' ? 'series' : 'movie'

  const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}&type=${omdbType}`)
  const data = await res.json()

  return NextResponse.json(data)
}
