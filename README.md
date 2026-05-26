# 💰 SubLens

> 個人訂閱支出監察工具 — Track every subscription, stay in control.

SubLens 是一個純前端的互動網頁應用，幫助你追蹤所有軟件訂閱服務的支出，支援多貨幣換算、實時匯率、深色模式，資料儲存於 Google Sheets。

---

## ✨ 功能特色

- 📋 **訂閱管理** — 新增、編輯、移除訂閱，支援封存並保留記錄
- 💸 **三種支出總覽** — 每月 / 每年 / 累積支出，自動換算至 HKD
- 🌍 **多貨幣支援** — HKD、USD、CNY，每張卡片顯示原幣及 HKD 換算值
- 📈 **實時匯率** — 透過 Google Sheets GOOGLEFINANCE 函數取得即時市場匯率
- 📊 **視覺化圖表** — 分類支出圓餅圖 + 過去 6 個月趨勢折線圖
- 🔑 **API Token 保護** — 可選啟用密鑰驗證，防止未授權存取 Google Sheet
- 🌙 **深色/淺色模式** — 一鍵切換，自動記住偏好設定
- 📱 **響應式設計** — 桌面及手機版完整支援
- ☁️ **雲端儲存** — 所有資料儲存於 Google Sheets，跨裝置同步

---

## 🖥️ 頁面預覽

| 淺色模式 | 深色模式 |
|---------|---------|
| ![Light Mode](screenshots/light.png) | ![Dark Mode](screenshots/dark.png) |

---

## 🛠️ 技術架構

| 項目 | 技術 |
|------|------|
| 前端 | HTML5 + Tailwind CSS (CDN) + Vanilla JavaScript (ES Modules) |
| 圖表 | Chart.js (CDN) |
| 後端 API | Google Apps Script (Web App) |
| 資料庫 | Google Sheets |
| 匯率來源 | Google Sheets GOOGLEFINANCE 函數 |
| 部署 | GitHub Pages |

---

## 📁 檔案結構

```
sublens/
├── index.html          # 主網頁（HTML 結構 + Tailwind + CDN）
├── js/
│   ├── config.js       # 常數設定、共用狀態（CONFIG、state）
│   ├── dates.js        # 日期計算 helper（含月底封頂邏輯）
│   ├── currency.js     # 貨幣換算 helper
│   ├── calc.js         # 支出計算邏輯
│   ├── ui.js           # UI 通用功能（toast、modal ARIA、select）
│   ├── render.js       # DOM 渲染（卡片、圖表、摘要）
│   ├── api.js          # API 請求、資料載入
│   ├── modals.js       # 新增／編輯／移除 Modal 邏輯
│   └── main.js         # 初始化、事件監聽
├── appsscript.gs       # Google Apps Script 後端代碼
├── manifest.json       # PWA manifest
├── icons/              # 應用圖示
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── icon-180.png
│   ├── icon-192.png
│   └── icon-512.png
└── README.md
```

---

## 🚀 快速開始

### 第一步：建立 Google Sheets

1. 前往 [sheets.new](https://sheets.new) 建立新試算表，命名為 **SubLens**
2. 建立以下兩個分頁並設定欄位標題：

**`subscriptions` 分頁：**
```
id | name | category | emoji | billingCycle | amount | currency | startDate | endDate | pausedDate | nextBillingDate | status | notes
```

**`rates` 分頁：**

| A | B |
|---|---|
| USDHKD | `=GOOGLEFINANCE("CURRENCY:USDHKD")` |
| CNYHKD | `=GOOGLEFINANCE("CURRENCY:CNYHKD")` |

### 第二步：部署 Apps Script

1. 在 Google Sheet 點擊 **擴充功能 → Apps Script**
2. 刪除預設內容，貼入 `appsscript.gs` 的全部代碼
3. 按 **Ctrl+S** 儲存，將專案命名為 `SubLens API`
4. 點擊 **部署 → 新增部署項目**
5. 類型選 **網頁應用程式**，設定如下：
   - 執行身分：**我**
   - 誰可以存取：**任何人**
6. 點擊 **部署**，複製生成的 **Web App URL**

### 第三步：設定前端

打開 `js/config.js`，填入你的 Apps Script URL：

```js
export const CONFIG = {
  API_URL: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
  DEFAULT_CURRENCY: "HKD",
  RATES: {
    USDHKD: 7.78,  // fallback 匯率（API 失敗時使用）
    CNYHKD: 1.07,
    EURHKD: 8.45
  }
};
```

### 第四步：啟用 API Token 保護（建議）

Apps Script URL 一旦公開，任何人都可存取你的資料。建議啟用 Token 保護：

1. 在 Apps Script → **專案設定 → 指令碼屬性**，新增屬性：
   - 名稱：`TOKEN`
   - 值：自訂密碼（如 `sublens-abc123xyz`）
2. **重新部署**新版本（部署 → 管理部署項目 → 鉛筆圖示 → 選「新增版本」→ 部署）
3. 打開 SubLens 網頁，點右上角 **⚙️ 按鈕**，輸入相同的密碼並儲存

啟用後，沒有正確 Token 的請求一律回傳 `{"error":"unauthorized"}`。Token 存於瀏覽器 localStorage，不上傳至任何伺服器。

### 第五步：部署到 GitHub Pages

1. 建立 GitHub repo，上傳所有檔案
2. 前往 **Settings → Pages**
3. Source 選擇 **Deploy from a branch → main → / (root)**
4. 等待約 1 分鐘，網站即上線

---

## 📊 Google Sheets 資料結構

### `subscriptions` 欄位說明

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | string | UUID，自動生成 |
| `name` | string | 訂閱名稱（如 Netflix）|
| `category` | string | 娛樂 / 工作效率 / 雲端儲存 / AI工具 / 其他 |
| `emoji` | string | 顯示圖示（如 🎬）|
| `billingCycle` | string | `monthly` 或 `yearly` |
| `amount` | number | 金額 |
| `currency` | string | `HKD` / `USD` / `CNY` |
| `startDate` | string | 開始日期（ISO 格式）|
| `endDate` | string | 結束日期（封存時填入）|
| `pausedDate` | string | 暫停日期（暫停時填入；恢復時清空）|
| `nextBillingDate` | string | 下次扣費日期 |
| `status` | string | `active` / `paused` / `archived` |
| `notes` | string | 備註（選填）|

---

## ⚠️ 注意事項

- 每次修改 `appsscript.gs` 後，必須重新部署**新版本**才會生效（「最新版本」不等於已部署版本）
- 部署設定必須保持「誰可以存取：任何人」，Token 保護由代碼層實現，不依賴 Google 登入
- GOOGLEFINANCE 匯率約有 15 分鐘延遲，屬正常現象
- 所有資料儲存於你自己的 Google Sheet，不經過任何第三方伺服器

---

## 📅 開發記錄

| 版本 | 日期 | 更新內容 |
|------|------|---------|
| v1.0 | 2026-04-14 | 初始版本：訂閱管理、支出計算、圖表 |
| v1.1 | 2026-04-14 | 新增實時匯率、國旗顯示、深色模式 |
| v1.2 | 2026-04-14 | 修復日期顯示、趨勢圖計算、響應式佈局 |
| v2.0 | 2026-05-26 | 重大重構：ES 模組拆分（9 個 JS 檔）、修正月底帳日翻月 bug、移除廢棄 bills 系統、擴充至 11 種貨幣、API Token 認證、Modal ARIA + Esc、統一輸入驗證、局部 DOM 更新優化 |

---

## 📄 License

MIT License — 自由使用、修改及分發。
