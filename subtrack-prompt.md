# SubTrack — Subscription Tracker Web App

## Project Overview

Build a single-file interactive HTML web app to track personal software subscription spending.
Data is persisted via **Google Apps Script Web App** acting as a REST API backed by **Google Sheets**.

---

## Tech Stack

- HTML5 + CSS (Tailwind CSS via CDN)
- Vanilla JavaScript (ES6+, no frameworks)
- Chart.js (via CDN) for visualizations
- Google Apps Script as backend API (URL to be filled in by user)

---

## File Structure

Deliver **two files**:

1. `index.html` — the full frontend web app
2. `appsscript.gs` — the Google Apps Script backend code

---

## Google Sheets Structure

### Sheet 1: `subscriptions`

| Column | Type | Description |
|--------|------|-------------|
| id | string | UUID |
| name | string | 軟件名稱 |
| category | string | 分類 |
| emoji | string | 圖示 |
| billingCycle | string | `monthly` / `yearly` |
| amount | number | 金額 |
| currency | string | `HKD` / `USD` / `CNY` |
| startDate | string | ISO date |
| nextBillingDate | string | ISO date |
| status | string | `active` / `archived` |
| notes | string | 備註 |

### Sheet 2: `bills`

| Column | Type | Description |
|--------|------|-------------|
| id | string | UUID |
| subscriptionId | string | 對應訂閱 ID |
| date | string | ISO date |
| amount | number | 金額 |
| currency | string | `HKD` / `USD` / `CNY` |

---

## Apps Script API (`appsscript.gs`)

Implement a Web App with `doGet(e)` and `doPost(e)`.

### GET Actions

Triggered via URL param `?action=...`

| Action | Description |
|--------|-------------|
| `getSubscriptions` | Return all rows from `subscriptions` sheet as JSON array |
| `getBills` | Return all rows from `bills` sheet as JSON array |

### POST Actions

Triggered via JSON body `{ action, data }`

| Action | Description |
|--------|-------------|
| `addSubscription` | Append new row to `subscriptions` |
| `updateSubscription` | Find row by `id`, update changed fields |
| `addBill` | Append new row to `bills` |
| `deleteSubscription` | Delete row by `id`; if `data.deleteBills === true`, also delete all matching rows in `bills` by `subscriptionId` |

### Helper Functions Required

- `getSheetData(sheetName)` — read all rows as array of objects
- `appendRow(sheetName, data)` — append a new row
- `updateRow(sheetName, data)` — find by `id` and update
- `deleteRow(sheetName, id)` — delete row by `id`
- `deleteRowsBySubId(sheetName, subscriptionId)` — delete all matching bill rows

> All responses must use `ContentService.createTextOutput(JSON.stringify(...)).setMimeType(ContentService.MimeType.JSON)`

---

## Frontend Web App (`index.html`)

### Configuration Block

At the top of the `<script>`, expose a config object:

```js
const CONFIG = {
  API_URL: "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE",
  DEFAULT_CURRENCY: "HKD",
  USD_TO_HKD: 7.78,
  CNY_TO_HKD: 1.07
};
```

### Page Layout

```
┌──────────────────────────────────────┐
│  💰 SubTrack              [+ 新增]   │  ← Sticky Header
├──────────────────────────────────────┤
│  [每月支出]  [每年支出]  [累積支出]  │  ← Summary Cards
├──────────────────────────────────────┤
│  Pie Chart (category) | Bar Chart    │  ← Charts
│                       (monthly trend)│
├──────────────────────────────────────┤
│  [全部]  [啟用中]  [封存]            │  ← Filter Tabs
│  Subscription Cards List             │
└──────────────────────────────────────┘
```

### Subscription Card

Each card must display:

- Emoji + 軟件名稱 + 分類 badge
- 金額 + 貨幣 + 繳費週期
- 距下次扣費天數（≤7 天顯示橙色警示 badge）
- 狀態 badge（`active` / `archived`）
- `[編輯]` and `[移除]` buttons
- Archived cards use muted/greyed-out styling

### Add / Edit Modal

| Field | Type | Validation |
|-------|------|-----------|
| 名稱 | text | Required |
| 分類 | select | 娛樂 / 工作效率 / 雲端儲存 / AI工具 / 其他 |
| Emoji | text | Default: 📦 |
| 金額 | number | Required, positive |
| 貨幣 | select | HKD / USD / CNY |
| 繳費週期 | select | monthly / yearly |
| 開始日期 | date | Required |
| 備註 | textarea | Optional |

Auto-calculate `nextBillingDate` from `startDate` + `billingCycle`.

### Remove Confirmation Modal

```
⚠️ 確認移除 "[name]"？

  ( ) 完全刪除（移除所有帳單記錄）
  (●) 封存並保留帳單記錄  ← 預設選項

                [取消]  [確認移除]
```

### Spending Calculations

All amounts must be converted to HKD for display using `CONFIG` rates.

| View | Formula |
|------|---------|
| 每月支出 | Σ monthly subs + Σ (yearly subs ÷ 12)，active only |
| 每年支出 | Σ (monthly subs × 12) + Σ yearly subs，active only |
| 累積支出 | Σ all rows in `bills` sheet (converted to HKD) |

### Charts (Chart.js)

1. **Pie Chart** — spending by category (active subscriptions, normalised to HKD/month)
2. **Bar Chart** — last 6 months spending trend, calculated from `bills` data

### API Integration

```js
// Wrapper for all API calls
async function apiFetch(action, method = "GET", data = null) {
  // Show loading spinner
  // On error: show toast with error message
  // On success: return parsed JSON
}
```

- On page load: fetch `getSubscriptions` + `getBills` in parallel, then render
- Show full-page loading overlay on first load
- Show toast notifications (success/error) after every user action

---

## UX Requirements

- Fully responsive and mobile-friendly
- All UI text in **Traditional Chinese**
- Tailwind CSS utility classes throughout
- Smooth CSS transitions on modal open/close
- Empty state message/illustration when no subscriptions exist
- Loading spinner while fetching from API

---

## Implementation Notes

- Use `crypto.randomUUID()` to generate IDs for new records
- Do **not** use `localStorage` — all data must go through the API
- Do **not** use any JS framework (no React, Vue, Alpine, etc.)
- Load Tailwind CSS via: `<script src="https://cdn.tailwindcss.com"></script>`
- Load Chart.js via CDN
- The Apps Script URL is a placeholder — user will replace it manually after deployment

---

## Output Instructions

1. Output `appsscript.gs` first with section comments
2. Then output `index.html` with section comments
3. Add a short setup guide at the end explaining how to deploy the Apps Script and replace the API URL
