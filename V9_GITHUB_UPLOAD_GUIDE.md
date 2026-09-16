# V9 GitHub 分包上傳說明（單層版）

這一版刻意取消 assets_v9/01_core/heroes/... 這種多層資料夾。

## 你在 GitHub repo 根目錄最後只需要這 6 個新資料夾

- v9_01_heroes — 24 個檔案（預留未來擴充到 60）
- v9_02_monsters — 24 個檔案（預留未來擴充，超過 89 時再拆第二包）
- v9_03_world — 18 個檔案（8 建築 + 6 FX + 4 reference）
- v9_04_gear_a — 72 個檔案
- v9_05_gear_b — 72 個檔案
- v9_06_fashion — 32 個檔案

全部都沒有第二層子資料夾，且目前每包都低於 90。

## 上傳順序

1. 把 UPLOAD_ROOT_FILES 裡的 index.html、v9.js、v9.css、sw.js 等檔案上傳到 repo 根目錄，覆蓋同名檔案。
2. 在 repo 根目錄分別拖入六個 v9_* 資料夾。直接拖「整個資料夾」即可，不要先進入同名資料夾後再拖一次，避免多包一層。
3. 每個資料夾分開 Commit，較不容易觸發 GitHub 網頁上傳限制。
4. 等 GitHub Pages deployment 綠色完成後，Ctrl + Shift + R。
5. 舊 assets_v9 暫時可保留；新版 code 已不使用它。確認新站正常後再刪也可以。

不需要跑新的 SQL。
