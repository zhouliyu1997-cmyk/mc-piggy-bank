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
