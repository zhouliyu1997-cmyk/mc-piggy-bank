
-- M&C 小豬撲滿 - Supabase setup
-- Run this entire file once in Supabase > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null default 'M&C的小豬撲滿',
  join_secret_hash text not null,
  goal_twd numeric not null default 0,
  target_date date,
  created_by uuid not null,
  created_at timestamptz not null default now()
);

create table if not exists public.room_members (
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null,
  display_name text,
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create table if not exists public.workers (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  store text not null,
  role text not null,
  base_rate numeric not null,
  award_code text not null default 'FAST_FOOD',
  employment_type text not null default 'CASUAL',
  level_no int not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  worker_id uuid not null references public.workers(id),
  job_id uuid not null references public.jobs(id),
  work_date date not null,
  hours numeric not null,
  day_type text not null,
  fx_aud_twd numeric not null,

  -- snapshot fields: NEVER recompute old records from future rule changes
  worker_name text not null,
  store text not null,
  role text not null,
  base_rate numeric not null,
  award_code text not null,
  employment_type text not null,
  level_no int not null,
  rule_version text not null,
  penalty_multiplier numeric not null,
  applied_hourly_rate numeric not null,
  aud_income numeric not null,
  twd_income numeric not null,

  created_by uuid not null,
  created_at timestamptz not null default now()
);

alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.workers enable row level security;
alter table public.jobs enable row level security;
alter table public.entries enable row level security;

create or replace function public.is_room_member(p_room uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1 from public.room_members
    where room_id = p_room and user_id = auth.uid()
  );
$$;

drop policy if exists rooms_select on public.rooms;
create policy rooms_select on public.rooms for select
using (public.is_room_member(id));

drop policy if exists rooms_update on public.rooms;
create policy rooms_update on public.rooms for update
using (public.is_room_member(id))
with check (public.is_room_member(id));

drop policy if exists members_select on public.room_members;
create policy members_select on public.room_members for select
using (public.is_room_member(room_id));

drop policy if exists workers_all on public.workers;
create policy workers_all on public.workers for all
using (public.is_room_member(room_id))
with check (public.is_room_member(room_id));

drop policy if exists jobs_all on public.jobs;
create policy jobs_all on public.jobs for all
using (public.is_room_member(room_id))
with check (public.is_room_member(room_id));

drop policy if exists entries_all on public.entries;
create policy entries_all on public.entries for all
using (public.is_room_member(room_id))
with check (public.is_room_member(room_id));

create or replace function public.create_piggy_room(
  p_name text,
  p_code text,
  p_password text,
  p_display_name text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room uuid;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  if length(trim(p_code)) < 4 then raise exception 'Room code must be at least 4 characters'; end if;
  if length(p_password) < 4 then raise exception 'Password must be at least 4 characters'; end if;

  insert into public.rooms(code, name, join_secret_hash, created_by)
  values (upper(trim(p_code)), coalesce(nullif(trim(p_name),''),'M&C的小豬撲滿'),
          crypt(p_password, gen_salt('bf')), auth.uid())
  returning id into v_room;

  insert into public.room_members(room_id, user_id, display_name)
  values(v_room, auth.uid(), p_display_name);

  return v_room;
end;
$$;

create or replace function public.join_piggy_room(
  p_code text,
  p_password text,
  p_display_name text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room public.rooms%rowtype;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;

  select * into v_room
  from public.rooms
  where code = upper(trim(p_code))
  limit 1;

  if v_room.id is null or crypt(p_password, v_room.join_secret_hash) <> v_room.join_secret_hash then
    raise exception 'Invalid room code or password';
  end if;

  insert into public.room_members(room_id, user_id, display_name)
  values(v_room.id, auth.uid(), p_display_name)
  on conflict (room_id, user_id)
  do update set display_name = excluded.display_name;

  return v_room.id;
end;
$$;

grant execute on function public.create_piggy_room(text,text,text,text) to authenticated;
grant execute on function public.join_piggy_room(text,text,text) to authenticated;
grant execute on function public.is_room_member(uuid) to authenticated;

-- Realtime
do $$
begin
  alter publication supabase_realtime add table public.rooms;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.workers;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.jobs;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.entries;
exception when duplicate_object then null;
end $$;
