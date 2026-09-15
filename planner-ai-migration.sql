
-- M&C 小豬撲滿：排班顧問對話記憶
-- 在 Supabase SQL Editor 執行一次即可。

create table if not exists public.planner_profiles (
  room_id uuid not null references public.rooms(id) on delete cascade,
  worker_id uuid not null references public.workers(id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  updated_by uuid,
  updated_at timestamptz not null default now(),
  primary key (room_id, worker_id)
);

create table if not exists public.planner_chat (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  author_id uuid,
  role text not null check (role in ('user','advisor')),
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.planner_profiles enable row level security;
alter table public.planner_chat enable row level security;

drop policy if exists planner_profiles_all on public.planner_profiles;
create policy planner_profiles_all
on public.planner_profiles for all
using (public.is_room_member(room_id))
with check (public.is_room_member(room_id));

drop policy if exists planner_chat_all on public.planner_chat;
create policy planner_chat_all
on public.planner_chat for all
using (public.is_room_member(room_id))
with check (public.is_room_member(room_id));

do $$
begin
  alter publication supabase_realtime add table public.planner_profiles;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.planner_chat;
exception when duplicate_object then null;
end $$;
