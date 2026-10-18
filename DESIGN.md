---
name: SubLens
description: A private monthly bank statement for one person's subscriptions, totalled in HKD.
colors:
  paper: "#F4F5F2"
  sheet: "#FFFFFF"
  tint: "#F2F4F0"
  ink: "#14213D"
  ink-2: "#44506A"
  ink-3: "#5F6A80"
  rule: "#D6DCD4"
  rule-soft: "#E7EBE5"
  green: "#2F6F4E"
  green-hi: "#255A3F"
  red: "#B33A3A"
  red-wash: "#F8E9E7"
  amber: "#8A5A00"
  amber-wash: "#F6EEDC"
  cat-entertainment: "#7B5EA7"
  cat-productivity: "#4A8291"
  cat-cloud: "#3D6FA8"
  cat-ai: "#C08A1E"
  cat-other: "#8C92A0"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang HK, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "clamp(40px, 4.2vw, 56px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
    fontFeature: "\"tnum\" 1, \"lnum\" 1"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang HK, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "26px"
    fontWeight: 800
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang HK, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 700
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang HK, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "\"tnum\" 1, \"lnum\" 1"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang HK, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 500
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang HK, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 400
rounded:
  hairline: "2px"
  chip: "3px"
  control: "4px"
  inset: "6px"
  panel: "8px"
  dot: "50%"
  slip: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  panel-x: "24px"
  page-x: "32px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "38px"
  button-primary-hover:
    backgroundColor: "{colors.green-hi}"
  button-ghost:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "38px"
  button-danger:
    backgroundColor: "{colors.red}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "38px"
  button-text:
    textColor: "{colors.green}"
    padding: "0 6px"
    height: "28px"
  icon-button:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    size: "38px"
  icon-button-hover:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.ink}"
  input:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "8px 10px"
    height: "40px"
  panel:
    backgroundColor: "{colors.sheet}"
    rounded: "{rounded.panel}"
    padding: "20px 24px 16px"
  amount-box:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.inset}"
    padding: "16px 18px 14px"
  next-debit-panel:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.panel}"
    padding: "12px 24px"
  status-chip:
    typography: "{typography.caption}"
    rounded: "{rounded.chip}"
    padding: "1px 6px"
  tab:
    textColor: "{colors.ink-3}"
    padding: "10px 14px"
  tab-active:
    textColor: "{colors.green}"
  dialog:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.slip}"
    width: "460px"
---

# Design System: SubLens

## Overview

**Creative North Star: "The Private Statement"**

SubLens is a bank's monthly statement for one customer, laid out as separate white panels on a light neutral ground: an account panel with ruled detail rows, an amount panel whose tinted inner box holds the one number that matters, a one-line next-debit panel, a category subtotal table, and an itemised ledger. It reads like a document you audit, not a dashboard you browse.

Density is that of a statement: ruled rows, small grey column heads, right-aligned tabular figures, and roomy panel padding around tight tables. Colour carries meaning, never decoration. Bank green marks the actions you take and the current tab, debit red marks money about to leave, amber marks a paused or uncertain state, and category inks exist only to tell five categories apart. Dark mode is the same statement at night on deep navy, with every role preserved.

**Key Characteristics:**
- Separate white panels (8px radius, 1px soft-rule border, 1px lift) on a pale neutral ground, 16px apart.
- Rules inside panels: soft grey-green hairlines between rows, a full rule under table heads.
- Every amount in tabular lining figures, right-aligned in columns.
- One display-scale figure, in a tinted inner box with yearly and cumulative totals split in two columns beneath it.
- Small circles carry state and category: the next-debit dot and the subtotal swatches.

## Colors

A cool, near-monochrome statement palette of navy ink on pale grey-green paper, with three meaning-bearing inks and five muted category inks.

### Primary
- **Bank Green** (green): the action and selection colour. Primary buttons, text buttons, focus outline, input focus ring, text selection, the "Lens" half of the wordmark, the active tab's label, count and 3px underline, the spinner arc, and the next-debit dot when no charge is near. Hover deepens to **Vault Green** (green-hi).

### Secondary
- **Debit Red** (red): money about to leave, and destruction. The next-debit dot and tag inside seven days, ledger dates within seven days, required-field asterisks, the danger button, trash hover, the delete choice when selected. **Debit Wash** (red-wash) fills destructive hover backgrounds and the selected delete choice.

### Tertiary
- **Ledger Amber** (amber): paused status chips and the unknown-currency warning inside the amount box, on **Amber Wash** (amber-wash).

### Category inks
- **Plum** (cat-entertainment), **Teal Slate** (cat-productivity), **Statement Blue** (cat-cloud), **Ochre** (cat-ai), **Pewter** (cat-other). Used only in the segmented split bar and category swatches. Defined in `js/config.js` `CAT_COLORS`, not as custom properties.

### Neutral
- **Statement Paper** (paper): page ground behind the panels; also the translucent sticky letterhead and the loading screen.
- **Statement White** (sheet): panels, dialogs, inputs, ghost buttons, emoji tiles; also text on filled buttons.
- **Counterfoil Tint** (tint): the amount box, dialog footers, row and icon-button hover, selected choice.
- **Navy Ink** (ink): all primary type, figures, totals, toasts (light mode), selected choice border.
- **Ink 2 / Ink 3** (ink-2, ink-3): secondary values, labels and column heads / notes, meta, placeholders, inactive tabs, the demo strip's dashed border.
- **Rule / Soft Rule** (rule, rule-soft): letterhead, table-head, tab-bar and amount-box dividers, control borders / panel borders and row dividers.

Dark mode (`.dark`) redefines every token in place: paper #080E1B, sheet #0F1729, tint #131D33, ink #E7EBF3, ink-2 #B3BCCD, ink-3 #8E98AD, rule #27324A, rule-soft #1B2540, green #79C59B, green-hi #95D4B0, red #EC8B83, red-wash #2E1719, amber #E3B566, amber-wash #2A2213. Category inks do not change.

### Named Rules
**The Meaning Ink Rule.** Green means "act" or "selected", red means "money leaves or data dies", amber means "paused or uncertain". None is used for decoration.

**The Red Is Earned Rule.** The next-debit dot is green by default and turns red, with a red 600 tag, only when a charge falls within seven days. Ledger dates follow the same seven-day threshold.

## Typography

**Display Font:** System CJK sans stack (-apple-system, PingFang HK/TC, Noto Sans TC, Microsoft JhengHei, Segoe UI)
**Body Font:** the same stack
**Label/Mono Font:** none distinct; figures use `tnum` and `lnum` on the body face

**Character:** One sans in many weights, set like a statement: heavy navy figures, plain body, small grey column heads. The stack is a platform constraint (zh-Hant, no CDN, no build step), not a style.

### Hierarchy
- **Display** (800, clamp(40px, 4.2vw, 56px), line-height 1.05, -0.03em): the monthly HKD figure in the amount box only, with a 26px/800 "HK$" prefix on its baseline.
- **Headline** (800, 26px, -0.02em): the wordmark.
- **Title** (700, 18px; dialogs 17px): panel and dialog titles. The yearly and cumulative figures in the amount box also sit at 18px/700 (16px under 720px).
- **Body** (400, 15px, 1.55; 14px under 720px): running text. Table cells, account rows, buttons, tabs and the next-debit line at 14px; names and figures at 600–700.
- **Label** (500, 13px): table column heads in ink-2. Amount-box sub-labels, category and cycle cells, form labels (600) and the demo strip also sit at 13px.
- **Caption** (400, 12px): item notes, currency codes, tab counts (600), status chips (600), panel notes, fine print.

### Named Rules
**The Tabular Figures Rule.** Every amount, date, rate and count is set in tabular lining figures (`font-feature-settings: "tnum" 1, "lnum" 1` on body plus `.num`) and right-aligned in its column, so the eye can run a column like a bank clerk.

**The One Big Number Rule.** Display scale belongs to the monthly amount. The next largest figures are 18px.

## Layout

A single centred column, 1440px max, padded 16px 32px 48px, stacking panels on a 16px grid gap. A sticky translucent letterhead (paper at 88%, saturate 1.4 and 10px blur, 1px rule beneath) carries the wordmark and actions only, at the same 1440px width. A dashed demo strip may sit between letterhead and first panel.

The statement head is a two-column grid (1.5fr account panel, 1fr amount panel, 16px gap). The account panel is a definition list with a 132px label column and soft rules between rows. The amount panel is padded 6px around its tinted inner box. Below it, the next-debit panel, then the subtotals panel and the ledger panel, each padded 20px 24px 16px with an 18px title row (16px below it).

Tables run edge to edge of their panel with no outer padding on first and last columns. Subtotal cells pad 8px 0; ledger cells 6px 10px with 12px 10px 8px heads. The ledger's 操作 column is a fixed 140px.

At 960px the head stacks with the amount panel first. Under 720px: page padding becomes 12px 16px 32px with a 12px gap, panels pad 16px, the account label column narrows to 76px, the next-debit facts wrap without separators, and the ledger becomes a two-row grid per item (name and monthly figure on top, a meta line and actions below), folding category, cycle, original amount and next date into the meta line.

## Elevation & Depth

Nearly flat. Panels separate from the paper by value step (paper to sheet), a 1px soft-rule border and a single 1px lift. Inside a panel, depth is a further value step (sheet to tint) or a rule, never another shadow. Toasts and the API activity pill share the same lift. Dialogs sit on a navy scrim with a 1px ink border and no shadow.

### Shadow Vocabulary
- **Panel lift** (`box-shadow: 0 1px 2px rgba(20, 33, 61, 0.08)`; dark `0 1px 2px rgba(0, 0, 0, 0.4)`): panels, toasts, API activity pill.

### Named Rules
**The One Lift Rule.** Separation comes from value steps, borders and rules. The 1px panel lift is the only shadow; a surface that needs more separation gets a tint step or a rule, not a larger shadow.

## Shapes

Softly squared corners on a short scale: 2px on the split-bar segments, 3px on status chips, 4px on buttons, inputs, choices, icon buttons and the amount warning, 6px on the amount box and emoji tiles, 8px on panels. Circles (50%) mark state and category: the 9px next-debit dot and the 14px subtotal swatches. Dialogs are square (0px), a slip laid over the statement. Inside panels, 1px rules carry structure: soft rule between rows, full rule under table heads and the tab bar, and full rules dividing the amount box's figure from its two-column split.

## Components

### Buttons
- **Shape:** gently squared (4px), 38px tall, 16px horizontal padding, 14px/600, 6px icon gap.
- **Primary:** bank green with white text; hover deepens to vault green. One per surface: "新增訂閱" in the letterhead, the save action in dialogs.
- **Ghost:** white with a rule border; hover darkens the border to ink-3.
- **Danger:** debit red; hover dims by brightness(.92). Only for confirming removal.
- **Text:** green, no fill, 28px tall; hover underlines with 3px offset. Used in the demo strip.
- **Icon button:** 38px (32px small, 30px on mobile rows), transparent, 18px ink-2 stroke icon at 1.8 stroke; hover fills tint and darkens to ink. The danger variant hovers red on red wash.
- **Focus:** 2px green outline at 2px offset on every focusable element. Transitions are 0.15s ease on colour properties only.

### Panels
- **Corner Style:** 8px.
- **Background:** sheet, 1px rule-soft border, panel lift.
- **Internal Padding:** 20px 24px 16px for titled panels (16px on mobile); 12px 24px for the account and next-debit panels.

### Amount panel (signature)
A 6px-padded panel holding a tint box (6px radius, 16px 18px 14px). The 14px/600 label "每月支出" sits over the display figure. Beneath a 1px rule, a two-column split: 年支出 and 累積支出, each a 13px ink-2 label over an 18px/700 figure, divided by a 1px vertical rule. A 13px amber warning on amber wash (4px radius) appears only when a currency's rate is unknown.

### Next-debit panel (signature)
A one-line panel, 12px 24px, 14px ink-2. A 9px dot and the tag "下一筆扣款" (10px gap), then the item, date (with relative days inside seven days) and original amount, separated by ink-3 "·" with 10px margins. Dot is green; inside seven days dot and tag turn red and the tag goes 600.

### Category subtotals
A 12px segmented split bar (2px gaps, 2px radius segments, 4px minimum width) above a ruled table: 14px circle swatch and name, count, share, monthly HKD. Body figures in ink-2; the footer row is 700 ink with no rule beneath.

### Ledger (signature)
Status tabs with 12px gaps over a 1px rule: inactive 14px/600 ink-3, active green with a 3px green underline and green count. Columns: item, 分類, 週期, 原幣金額, 月均港幣 (right-aligned), 下次扣款, 操作. Rows: a 34px emoji tile (sheet, rule border, 6px), name in 600 with a 12px ink-3 note, category swatch, cycle, original amount with a 12px grey currency code, monthly HKD figure in 700, next date (red 600 within seven days), and three small icon actions (pause or resume, edit, remove; archived rows keep a spacer). Rows sort active, paused, archived, then by monthly HKD descending; row hover fills tint. Paused and archived rows fade emoji and swatch to 50% and drop the figure to ink-2; archived figures are struck through. A 12px ink-3 fine-print line closes the panel; the ledger has no total row.

### Chips
- **Status:** 12px/600, 1px currentColor border, 3px radius, no fill. Paused in amber, archived in ink-3.

### Inputs / Fields
- **Style:** 40px, 8px 10px padding, 1px rule border, 4px radius, sheet, 15px text. Hover darkens the border to ink-3.
- **Focus:** border turns green with a 3px green ring at 22% mix.
- **Select:** native appearance removed, 12px chevron at right 10px.
- **Choice cards:** 1px rule, 4px radius, 12px 14px; selected shows an ink border on tint, the danger choice a red border on red wash.

### Dialogs
460px (400px small), square corners, 1px ink border, sheet background. Head (17px/700) and foot separated by rules; the foot sits on tint with equal-width buttons. Enter with a 0.2s fade on the scrim and a 0.35s, 12px rise on cubic-bezier(.16, 1, .3, 1).

### Navigation
The letterhead: wordmark ("Sub" in ink, "Lens" in green, 26px/800), then theme and token icon buttons and the primary add button. Sticky, blurred, one line at 390px.

## Do's and Don'ts

### Do:
- **Do** set every figure in tabular lining numerals and right-align it.
- **Do** group content into white panels (8px radius, 1px rule-soft border, panel lift) on paper, 16px apart.
- **Do** build structure inside panels from 1px rules: rule-soft between rows, rule under heads.
- **Do** keep the monthly amount the only display-scale element.
- **Do** reserve green for actions and selection, red for imminent debits and destruction, amber for paused or uncertain states.
- **Do** define both light and dark values for any new colour token on `:root` and `.dark`.
- **Do** keep per-item emoji in its 34px ruled tile; it is user content.

### Don't:
- **Don't** introduce gradient hero cards, doughnut charts or dashboard tiles; this world is a statement.
- **Don't** use green, red or amber decoratively.
- **Don't** add shadows beyond the 1px panel lift.
- **Don't** round panels beyond 8px or controls beyond 4px; full circles are only for dots and swatches.
