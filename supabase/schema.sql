create table if not exists public.little_miss_counter (
  id text primary key,
  moments jsonb not null default '[]'::jsonb,
  photo text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.little_miss_counter enable row level security;

drop policy if exists "couple read" on public.little_miss_counter;
drop policy if exists "couple insert" on public.little_miss_counter;
drop policy if exists "couple update" on public.little_miss_counter;

create policy "couple read"
on public.little_miss_counter for select
using (id = 'raj-swamini');

create policy "couple insert"
on public.little_miss_counter for insert
with check (id = 'raj-swamini');

create policy "couple update"
on public.little_miss_counter for update
using (id = 'raj-swamini')
with check (id = 'raj-swamini');

do $$
begin
  alter publication supabase_realtime add table public.little_miss_counter;
exception
  when duplicate_object then null;
end $$;
