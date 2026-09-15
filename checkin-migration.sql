
-- M&C 小豬撲滿：班表簽到功能
-- 在 Supabase SQL Editor 執行一次

alter table public.entries
  add column if not exists checked_in boolean not null default false;

alter table public.entries
  add column if not exists checked_in_at timestamptz;

alter table public.entries
  add column if not exists checked_in_by uuid;

create index if not exists entries_room_checked_in_idx
  on public.entries(room_id, checked_in);
