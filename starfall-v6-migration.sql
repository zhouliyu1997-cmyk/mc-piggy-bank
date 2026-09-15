
-- =========================================================
-- M&C：星痕公會 V6 長期版 migration
-- 只新增遊戲欄位，不會動工作資料
-- =========================================================

alter table public.game_meta
  add column if not exists difficulty integer not null default 1,
  add column if not exists auto_boss boolean not null default true,
  add column if not exists current_wave integer not null default 1;

alter table public.game_adventurers
  add column if not exists current_hp numeric,
  add column if not exists max_hp numeric,
  add column if not exists knocked_out boolean not null default false,
  add column if not exists injury_until timestamptz;

update public.game_adventurers
set max_hp = coalesce(max_hp, 250 + greatest(level,1) * 55),
    current_hp = coalesce(current_hp, 250 + greatest(level,1) * 55)
where max_hp is null or current_hp is null;
