
-- M&C 小豬撲滿：冒險者公會 V1
-- 請在 Supabase > SQL Editor 執行一次。

create table if not exists public.game_state (
  room_id uuid primary key references public.rooms(id) on delete cascade,
  reputation integer not null default 120,
  wood integer not null default 20,
  iron integer not null default 8,
  stone integer not null default 15,
  crystal integer not null default 0,
  game_xp_bonus integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_buildings (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  building_type text not null,
  level integer not null default 1,
  grid_x integer not null default 0,
  grid_y integer not null default 0,
  built_at timestamptz not null default now(),
  unique(room_id, building_type)
);

create table if not exists public.game_adventurers (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  name text not null,
  class_name text not null,
  rarity text not null default 'COMMON',
  level integer not null default 1,
  xp integer not null default 0,
  fatigue integer not null default 0,
  injury_until timestamptz,
  traits jsonb not null default '[]'::jsonb,
  recruited_at timestamptz not null default now()
);

create table if not exists public.game_expeditions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  adventurer_id uuid not null references public.game_adventurers(id) on delete cascade,
  zone text not null,
  mission_type text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'ACTIVE',
  reward jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.game_spend (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  currency text not null check(currency in ('GOLD','CONTRIBUTION','REPUTATION','WOOD','IRON','STONE','CRYSTAL')),
  amount numeric not null check(amount > 0),
  reason text not null,
  created_at timestamptz not null default now()
);

alter table public.game_state enable row level security;
alter table public.game_buildings enable row level security;
alter table public.game_adventurers enable row level security;
alter table public.game_expeditions enable row level security;
alter table public.game_spend enable row level security;

drop policy if exists game_state_all on public.game_state;
create policy game_state_all on public.game_state for all
using (public.is_room_member(room_id))
with check (public.is_room_member(room_id));

drop policy if exists game_buildings_all on public.game_buildings;
create policy game_buildings_all on public.game_buildings for all
using (public.is_room_member(room_id))
with check (public.is_room_member(room_id));

drop policy if exists game_adventurers_all on public.game_adventurers;
create policy game_adventurers_all on public.game_adventurers for all
using (public.is_room_member(room_id))
with check (public.is_room_member(room_id));

drop policy if exists game_expeditions_all on public.game_expeditions;
create policy game_expeditions_all on public.game_expeditions for all
using (public.is_room_member(room_id))
with check (public.is_room_member(room_id));

drop policy if exists game_spend_all on public.game_spend;
create policy game_spend_all on public.game_spend for all
using (public.is_room_member(room_id))
with check (public.is_room_member(room_id));

do $$ begin
  alter publication supabase_realtime add table public.game_state;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.game_buildings;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.game_adventurers;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.game_expeditions;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.game_spend;
exception when duplicate_object then null; end $$;
