---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

Scope: index.html, the whole SubLens app (one screen plus its modals). Mode: Operate.
Audience: the owner alone, checking their own subscription spend in HKD on desktop or phone.
Task: read total spend first (monthly, then yearly and cumulative), see which items cost most, catch the next charge, and add, edit, pause or remove items.
Constraints: static HTML + ES modules on GitHub Pages; zh-Hant; light and dark; per-item emoji is user content.

## Direction contract

THESIS: SubLens reads as a private monthly bank statement for subscriptions: an amount-due box, a category subtotal table, and an itemised ledger whose column sums to the amount due. It refuses the indigo SaaS dashboard of gradient hero card, doughnut chart and grid of soft cards.

OWN-WORLD: cool security-tint paper ground (#F3F5F1) with one white statement sheet; navy ink (#14213D) for type and heavy rules; hairline grey-green rules; bank green (#2F6F4E) for the primary action; debit red (#B33A3A) only for the next charge and destructive actions. A faint guilloche band under the letterhead. System CJK sans, tabular lining figures in every amount, single and double rules as the only structure. In dark mode the sheet becomes a night statement on deep navy.

STORY: open, read 本月應付 at a glance, see the next debit, scan subtotals by category, find the priciest line at the top of the ledger, act on a row.

FIRST VIEWPORT: letterhead strip (wordmark, statement date, FX rates, theme/settings icons, green 新增訂閱 button). Statement head: account details on the left; on the right a ruled amount-due box with the monthly HKD figure at display scale, yearly and cumulative as ruled rows beneath. A red next-debit line spans the full width. Category subtotals follow with one segmented bar, then the ledger starts.

ADAPTATIONS (recorded after finish review):
- Statement date and FX rates live in the account block, not the letterhead. That keeps the sticky letterhead to brand and actions, so it fits one line at 390px, and keeps the rates next to the currency they convert to.
- The amount-due label reads 每月支出, not 本月應付: the figure averages yearly items over 12 months, so "payable this month" would be untrue.
- Light --paper is #EEF1EC, a step darker than #F3F5F1, so the white sheet's edge reads without a heavy shadow.
- Seed key bcd3b62e comes from the concept-seed run's printed output (DIRECTION CONCEPT SEED key line); that run printed it but did not record it to disk.

FORM: HK bank monthly statement (my grounded #1, user-chosen pick card); seed key bcd3b62e. Signature move: the ledger ends in a double-ruled total row equal to the amount-due figure, and each row's monthly HKD cell carries a hairline proportion bar.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
