# M&C 小豬撲滿 — 免費共享雲端版

這個版本使用：

- **GitHub Pages**：免費網站託管
- **Supabase Free**：雲端 PostgreSQL、匿名登入、Realtime 即時同步
- **Frankfurter**：免費 AUD/TWD 匯率 API
- **Nager.Date**：自動判斷澳洲 / NSW 公共假日（並保留手動切換）
- **Fair Work Ombudsman Award 規則**：2026-07-01 版本化 penalty rate 邏輯

## 1. 建立免費 Supabase

1. 前往 https://supabase.com 建立帳號與 Free project。
2. 進入 **SQL Editor**。
3. 貼上 `supabase-setup.sql` 全部內容並執行。
4. 到 **Authentication → Providers / Sign In**，開啟 **Anonymous Sign-ins**。
5. 到 **Project Settings → API**，取得：
   - Project URL
   - anon / publishable key
6. 打開 `config.js`，填入：

```js
window.MC_CONFIG = {
  SUPABASE_URL: "https://xxxx.supabase.co",
  SUPABASE_ANON_KEY: "你的 anon 或 publishable key"
};
```

> anon / publishable key 本來就是給前端使用；真正的安全性由 SQL 裡的 RLS 控制。
> 不要把 service_role key 放進網站。

## 2. 免費部署 GitHub Pages

1. 建一個 GitHub public repository，例如 `mc-piggy-bank`。
2. 上傳：
   - `index.html`
   - `config.js`
3. Repository → **Settings → Pages**
4. Source 選 **Deploy from a branch**
5. Branch 選 `main`、folder 選 `/root`
6. 儲存後，GitHub 會提供類似：
   `https://你的帳號.github.io/mc-piggy-bank/`

把這個網址傳給女友即可。

## 3. 第一次使用

其中一人：
- 選「建立」
- 設定房間代碼，例如 `MC2026`
- 設定共同密碼
- 進入後新增 M、C、工作與共同存錢目標

另一人：
- 開同一個網址
- 選「加入」
- 輸入相同房間代碼與密碼

之後兩邊的新增 / 刪除 / 目標修改都會透過 Supabase Realtime 同步。

## Penalty Rate 的版本保存

每一筆 `entries` 都會把以下內容直接存進資料庫：

- `rule_version`
- `penalty_multiplier`
- `base_rate`
- `applied_hourly_rate`
- `aud_income`
- `fx_aud_twd`
- `twd_income`

因此未來 2027 年 Fair Work 規則改變時，只需要在前端新增新的規則版本。**2026 年已存在的紀錄不會被重新計算。**

目前規則版本：`FWO_2026-07-01`

### 目前支援的 Award

- Fast Food Industry Award
- Restaurant Industry Award
- Hospitality Industry (General) Award
- General Retail Industry Award

### 目前自動處理

- Weekday
- Saturday
- Sunday
- Public Holiday
- Casual / Part-time / Full-time
- Level 差異（Fast Food、Restaurant 的 Sunday 規則）

目前沒有自動處理：
- 晚間額外 loading
- overtime
- split shift
- junior rates
- allowances

若你的 payslip 涉及以上項目，請不要把這個簡化計算器當作薪資法律判定工具。


## 冒險者公會 V1

先在 Supabase SQL Editor 執行 `guild-game-migration.sql`，再把新版 `index.html` 與 `sw.js` 上傳 GitHub Pages。

遊戲換算：A$1 真實收入 = 4 Guild Gold；1 真實工作小時 = 1 Contribution；1 小時 = 10 Guild EXP，另每筆真實工作紀錄 +10 Guild EXP。遊戲消耗不會改變真實存款。


## Idle RPG V2

核心改動：真實收入轉 Guild Crystal；冒險者自動打怪產生 Idle Gold；關卡制、Boss、離線收益無時間上限、六稀有度 24 名冒險者、抽卡保底、裝備掉落、DPS 成長、建築升級。


## 星痕公會 V3
- 全繁中暗黑日系 UI
- 四大初始職業：戰士、法師、弓箭手、盜賊
- Lv30 / 60 / 90 / 120 轉職，會改變技能選項
- 56 名冒險者資料池
- 88 種裝備基礎資料
- 8 裝備欄位
- 建築每 10 級外觀進化
- 現實里程碑新增連續工作、總工作天數、單日工時/收入、單週工時/收入等條件


## 班表簽到
班表新增後預設為「預排」，不會進入遊戲。工作日期到達後按「簽到」，才計入星痕鑽石、公會長 EXP、真實工作里程碑、連續工作天數與工時/收入統計。先執行 `checkin-migration.sql`。


## 星痕公會 V4 完整版
這版整合：
- 簽到後才計入遊戲
- 日系暗黑戰鬥視覺與多人割草戰鬥
- 56 名冒險家、四職業、多段轉職與技能升級
- 96 種裝備模板、8 個裝備欄位
- 角色 / 裝備 / 時裝三種召喚
- 翅膀、光環、外觀武器、服裝會顯示在角色 SVG 上
- 公會基地 8 種實體建築；每 10 級外觀進化，5/10/20/30/40/50 解鎖能力
- 5 大區域、每區 10 關、每關獨立首領
- 無離線時間上限的掛機收益
- 真實工作里程碑可實際領取星痕鑽石

第一次更新 V4 時，請在 Supabase SQL Editor 執行 `starfall-v4-migration.sql`。

## V4.1 UI / 經濟平衡更新
- 戰鬥背景改成乾淨的暗黑場景，基地與招募背景降噪。
- 遊戲區文字整體放大。
- A$1 = 2 星痕鑽石（A$25/h 約 50 鑽/h）。
- 角色單抽 150、十連 1300；裝備十連 900；時裝 750。
- 星痕鑽石不能直接換遠征金幣，避免真實收入跳過核心養成。
- 高稀有角色倍率調低，角色等級 / 技能 / 建築仍是主要長期成長來源。
- 初期掛機金幣與建築、技能、角色升級成本重新平衡。
- 裝備可單件售出；可批量出售未裝備的普通 / 優秀裝備。
- 無限離線保留：超過 200 件的離線裝備掉落會自動回收成金幣，不會失去離線價值，也不會把資料庫塞爆。

## V5 — 真正網頁遊戲 UI 全面重製
- 公會頁不再使用概念圖當背景再疊按鈕。
- 六個遊戲頁（戰鬥、冒險家、招募、基地、裝備、世界）全部重新切版。
- 戰鬥場景由 CSS + SVG 元件組成，可真正動畫、更新怪物與角色。
- 冒險家頁變成「名冊 + 紙娃娃 + 技能 + 八格裝備」。
- 招募頁變成真正召喚介面。
- 公會基地由獨立建築 SVG 組成，可點擊選取與升級，不再把按鈕貼在圖片上。
- 裝備頁變成 RPG 背包：選裝備、指定角色穿戴、出售、批量回收。
- 世界頁保留 5 大區域 / 50 關與現實里程碑。
- 保留 V4.1 的平衡經濟、簽到、無限離線與售出機制。
- 不需要新增 SQL；沿用 V4 的資料庫即可。

## V5.1 資料 / 統計 / 載入修正
- 將 v4.js 遊戲引擎與資料直接內嵌到 index.html，避免 GitHub 少上傳 v4.js 導致角色、建築、怪物全部空白。
- 首頁所有統計只計算 checked_in=true 的班次。
- 紀錄頁保留所有預排班表，但本月工時 / AUD / TWD 只計算已簽到。
- 個人貢獻與最近六個月薪資圖表只計算已簽到。
- 移除遊戲 ticker 對 game_meta 的高頻 realtime 全量 reload，減少 Supabase 重複查詢。
- 進入公會頁時才重新整理共享遊戲資料。
- 不需要新增 SQL。

## V6 長期版
- 8 大區域 × 每區 10 關。
- 通關 8 區後進入下一難度：普通 → 困難 → 非常困難 → 夢魘 → 地獄。
- 每關 50 隻小怪；同時最多 3 隻，死亡後再輪流補怪。
- 50 隻後自動挑戰 Boss，不需要手按。
- 小怪與 Boss 會反擊；冒險家有 HP、倒地與 10 分鐘傷勢恢復。
- 全隊倒地會卡關，必須養成後再推。
- 普通前期小怪只會掉普通 / 優秀裝備。
- 稀有以上主要來自 Boss、高難度與裝備召喚。
- 各區域有自己的裝備池概念；難度也限制稀有度上限。
- 小怪自然掉裝備率大幅降到千分之一等級附近。
- 建築 / 角色成本重新拉長，目標讓目前內容可支撐約 5 個月逐步遊玩。
- 離線收益仍無時間上限，但套用卡關 / 死亡 / Boss 效率折損，不會無限跨關。
- RESET-GAME-ONLY.sql 只清遊戲，不碰任何工作與簽到資料。


## V7 美術整合版
這版重點不是新增資料表，而是整合一套真正的美術方向：
- 公會基地：改為概念圖式的大型主城 + 建築視覺展示
- 戰鬥頁：8 區域背景換成獨立地圖美術
- 招募頁：加入角色 / 怪物展示區與新的招募機率說明
- 裝備頁：加入裝備圖鑑展示區與售出建議
- 全滅後：改成可直接重刷目前關卡，不必等傷勢時間，適合持續農金幣與裝備

### 招募機率建議
已移除保底敘述，改用長線機率：
- 角色：普通 45 / 優秀 32 / 稀有 16 / 史詩 5.5 / 傳說 1.3 / 神話 0.2
- 裝備：普通 50 / 優秀 28 / 稀有 14 / 史詩 5.5 / 傳說 2.1 / 神話 0.4
- 時裝：稀有 60 / 史詩 25 / 傳說 12 / 神話 3

### V7 內附美術檔
- assets_v7/guild_main_bg.png
- assets_v7/buildings_strip.png
- assets_v7/characters_sheet.png
- assets_v7/monsters_sheet.png
- assets_v7/equipment_sheet.png
- assets_v7/zone_*.png

## V8.1 P1 + P2 FINAL FIX
- 冒險家重新逐格去背，移除白底與鄰格殘片。
- 怪物重新去背並避開壞掉的原始格子。
- 裝備重新依每列正確數量切割，再用連通元件移除鄰格殘片。
- 移除「建築美術展示」。
- 公會基地：概念圖作環境背景，透明建築物件分層放置。
- 世界地圖恢復：8 區域 / 5 難度。
- 全隊死亡：立即滿血復活、留在同一關、擊殺進度歸 0，繼續刷小怪。
- 增加怪物出現 / 攻擊 / 死亡動畫。
- 招募拆成冒險家 / 裝備 / 時裝獨立 UI。
- 移除硬保底敘述，改為透明機率。
- 增加星痕召喚動畫。
- 建築依等級階段增加視覺光效。
- 不需要新的 SQL。

## V9 — Card Battle / Unified Art System
- 戰鬥完全改成卡牌佈局：怪物卡在上、冒險家卡在下、中央播放技能特效。
- 移除連擊 UI；保留 50 隻小怪後自動 Boss。
- 冒險家卡、怪物卡、144 張裝備卡、8 張建築卡、32 張時裝卡都已重新輸出成統一尺寸的獨立圖片，不再把整張素材表直接切到 UI。
- 公會基地底部的冒險家／怪物戰鬥展示已移除；基地只顯示建築。
- 建築詳情右側圖片使用固定比例卡片，不再偏移。
- 星蝕巨劍固定對應乾淨的單件巨劍卡，不再出現兩個物件黏在一起。
- 冒險家全隊死亡後立即滿血復活，留在同一關並把本關小怪擊殺進度重置後繼續刷。
- 招募分為冒險家／裝備／時裝三個 UI，保留召喚動畫。
- 新增技能效果資產：斬擊、弓箭、法術、聖光、暗影。
- 不需要新的 SQL migration。

### GitHub 更新
請覆蓋 index.html、sw.js，並新增 v9.css、v9.js、assets_v9/。既有 config.js 請保留，不要刪除。
