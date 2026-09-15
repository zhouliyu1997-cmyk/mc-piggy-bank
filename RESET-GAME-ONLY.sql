
-- =========================================================
-- M&C：星痕公會 V6 — 只重置「遊戲進度」
-- 保留：
-- rooms / room_members / workers / jobs / entries
-- 也就是：房間、M/C、店家、班表、簽到、薪資紀錄全部保留
--
-- 清除：
-- 遊戲角色、裝備、時裝、技能、建築、遠征、遊戲貨幣、世界進度、里程碑領取
-- =========================================================

begin;

delete from public.game_skill_levels;
delete from public.game_fashion;
delete from public.game_equipment;
delete from public.game_milestone_claims;
delete from public.game_expeditions;
delete from public.game_spend;
delete from public.game_buildings;
delete from public.game_adventurers;
delete from public.game_state;
delete from public.game_meta;

commit;
