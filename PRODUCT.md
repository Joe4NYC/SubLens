# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

One person: the owner (Joe), a Hong Kong-based individual tracking their own software and media subscriptions. They open it occasionally to check what they spend, add or pause a subscription, and see what bills next.

## Product Purpose

SubLens shows how much the owner spends on subscriptions, converted to HKD. The main job is seeing total spend clearly: monthly, yearly and cumulative, and which subscriptions cost the most. Upcoming billing dates come second.

## Positioning

A personal ledger rather than a SaaS product. Data lives in the owner's own Google Sheet, live FX rates come from GOOGLEFINANCE, and there are no accounts and no backend beyond an Apps Script web app.

## Operating Context

- Opened on desktop and phone (GitHub Pages).
- Currencies: HKD, USD, CNY. Every amount shows its original currency plus the HKD equivalent.
- Billing cycles: monthly, yearly. Statuses: active, paused, archived (archived keeps bill history, with an optional end date).
- Demo mode uses sample data stored in localStorage when no API token is set.

## Capabilities and Constraints

- Add, edit, pause/resume, archive or delete a subscription; filter by status.
- Statement view: monthly / yearly / cumulative spend in HKD, the next scheduled charge, category subtotals (share and monthly HKD), and an itemised ledger sorted by monthly cost whose total equals the monthly figure.
- Per-subscription emoji is user content and is shown wherever the subscription appears.
- Stack: static HTML + vanilla ES modules + one stylesheet (`css/app.css`), deployed to GitHub Pages. No CDN dependencies and no build step.
- UI language: Traditional Chinese (zh-Hant).

## Brand Commitments

None binding. The owner said the name, colors, icon and visual style can all change.

## Evidence on Hand

- Real data lives in the owner's Google Sheet; demo data is in `js/demo.js`.
- Current-state screenshots: `screenshots/light.jpg`, `screenshots/dark.jpg`.

## Product Principles

1. Total spend comes first; everything else supports reading it.
2. Every number is honest: original currency plus HKD, never rounded away.
3. Personal tool, not a product pitch: no onboarding fluff or marketing copy.
