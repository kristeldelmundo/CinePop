# 🎬 The Watchlist

A shared couples movie night app — add movies & TV shows, let the randomizer pick what to watch, then rate and share together.

## ✨ Features

- **Shared Watchlist** — Both K & J add movies and TV shows, auto-fetches poster + plot from OMDB
- **Movie Randomizer** — Spin to pick tonight's watch, filter by type or who added it
- **Rate & Share** — Individual star ratings and thoughts, fun reactions, shareable movie card
- **Past Reviews** — Browse all your past movie nights together

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Postgres database)
- **OMDB API** (movie/show metadata)
- **Vercel** (deployment)

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/kristeldelmundo/TheWatchlist.git
cd TheWatchlist
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the migration:

```sql
-- Copy and run the contents of:
supabase/migrations/001_init.sql
```

3. Get your project URL and anon key from **Settings → API**

### 3. Get an OMDB API key

1. Go to [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
2. Sign up for a free key (1,000 requests/day)

### 4. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_OMDB_API_KEY=your_omdb_key
OMDB_API_KEY=your_omdb_key
```

### 5. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📦 Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add your environment variables in Vercel project settings
4. Deploy!

## 📁 Project Structure

```
app/
  page.tsx          # Home / landing
  watchlist/        # Browse & add titles
  randomizer/       # Random picker
  review/           # Rate & share
  api/movies/       # OMDB proxy route
components/
  layout/Navbar.tsx
  ui/MovieCard.tsx
  ui/AddMovieForm.tsx
lib/
  supabase.ts       # Supabase client
  omdb.ts           # OMDB fetch helper
types/
  index.ts          # TypeScript types
supabase/
  migrations/       # SQL schema
```

## 🎨 Design

Romantic editorial aesthetic — Playfair Display display font, rose/plum gradient palette, glassmorphism cards, film grain texture overlay. Built for two. 💕

---

made with ♥ for movie nights 🍿
