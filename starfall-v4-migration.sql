
-- =========================================================
-- M&C：星痕公會 V4 完整系統
-- 可重複執行。請在 Supabase SQL Editor 執行一次。
-- =========================================================

alter table public.game_meta
  add column if not exists premium_bonus integer not null default 0;

create table if not exists public.game_skill_levels (
  room_id uuid not null references public.rooms(id) on delete cascade,
  adventurer_id uuid not null references public.game_adventurers(id) on delete cascade,
  skill_key text not null,
  skill_level integer not null default 1,
  updated_at timestamptz not null default now(),
  primary key(room_id, adventurer_id, skill_key)
);

create table if not exists public.game_fashion (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  owner_adventurer_id uuid references public.game_adventurers(id) on delete set null,
  fashion_type text not null check(fashion_type in ('WINGS','AURA','WEAPON_SKIN','OUTFIT')),
  name text not null,
  rarity text not null,
  power_bonus numeric not null default 0,
  equipped boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.game_milestone_claims (
  room_id uuid not null references public.rooms(id) on delete cascade,
  milestone_key text not null,
  claimed_at timestamptz not null default now(),
  reward jsonb not null default '{}'::jsonb,
  primary key(room_id, milestone_key)
);

alter table public.game_skill_levels enable row level security;
alter table public.game_fashion enable row level security;
alter table public.game_milestone_claims enable row level security;

drop policy if exists game_skill_levels_all on public.game_skill_levels;
create policy game_skill_levels_all on public.game_skill_levels for all
using (public.is_room_member(room_id))
with check (public.is_room_member(room_id));

drop policy if exists game_fashion_all on public.game_fashion;
create policy game_fashion_all on public.game_fashion for all
using (public.is_room_member(room_id))
with check (public.is_room_member(room_id));

drop policy if exists game_milestone_claims_all on public.game_milestone_claims;
create policy game_milestone_claims_all on public.game_milestone_claims for all
using (public.is_room_member(room_id))
with check (public.is_room_member(room_id));

do $$ begin
  alter publication supabase_realtime add table public.game_skill_levels;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.game_fashion;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.game_milestone_claims;
exception when duplicate_object then null; end $$;
