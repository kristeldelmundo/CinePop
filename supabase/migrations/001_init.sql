-- Watchlist items table
create table if not exists watchlist_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text not null check (type in ('movie', 'tv')),
  added_by text not null check (added_by in ('K', 'J')),
  poster text,
  plot text,
  year text,
  genre text,
  rating text,
  watched boolean default false,
  created_at timestamptz default now()
);

-- Reviews table
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  watchlist_item_id uuid references watchlist_items(id) on delete cascade,
  title text not null,
  poster text,
  rating_k integer default 0 check (rating_k between 0 and 5),
  rating_j integer default 0 check (rating_j between 0 and 5),
  thoughts_k text default '',
  thoughts_j text default '',
  reactions text[] default '{}',
  created_at timestamptz default now()
);

-- Enable Row Level Security (open for now, tighten with auth later)
alter table watchlist_items enable row level security;
alter table reviews enable row level security;

-- Policies: allow all for now (add user auth later)
create policy "Allow all on watchlist_items" on watchlist_items for all using (true) with check (true);
create policy "Allow all on reviews" on reviews for all using (true) with check (true);
