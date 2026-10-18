---
name: SubLens
description: A private monthly bank statement for one person's subscriptions, totalled in HKD.
colors:
  paper: "#EEF1EC"
  sheet: "#FFFFFF"
  tint: "#F5F7F3"
  ink: "#14213D"
  ink-2: "#44506A"
  ink-3: "#5F6A80"
  rule: "#D6DCD4"
  rule-soft: "#E7EBE5"
  green: "#2F6F4E"
  green-hi: "#255A3F"
  green-wash: "#E6F0EA"
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
    fontSize: "clamp(40px, 6vw, 60px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.035em"
    fontFeature: "\"tnum\" 1, \"lnum\" 1"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang HK, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "20px"
    fontWeight: 800
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang HK, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 700
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang HK, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "\"tnum\" 1, \"lnum\" 1"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang HK, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 600
rounded:
  hairline: "2px"
  chip: "3px"
  control: "4px"
  sheet: "6px"
  slip: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  section-y: "28px"
  section-x: "32px"
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
  amount-due-box:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.control}"
    padding: "16px 20px 18px"
  next-debit-line:
    backgroundColor: "{colors.red-wash}"
    textColor: "{colors.ink}"
    padding: "12px 32px"
  status-chip:
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    padding: "1px 6px"
  tab:
    textColor: "{colors.ink-3}"
    padding: "10px 14px"
  tab-active:
    textColor: "{colors.ink}"
  dialog:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.slip}"
    width: "460px"
---

# Design System: SubLens

## Overview

**Creative North Star: "The Private Statement"**

SubLens is a bank's monthly statement printed for one customer: a security-tint paper ground, one white statement sheet, navy ink, and structure made only from single and double rules. The amount-due box carries the one number that matters; the ledger below it itemises that number and closes on a double-ruled total that equals it. Everything reads like a document you audit, not a dashboard you browse.

Density is that of a printed statement: ruled rows, small grey column heads, right-aligned tabular figures, generous section padding around tight tables. Colour is ink, not decoration. Bank green marks the actions you take, debit red marks money about to leave, amber marks a paused or uncertain state, and category inks exist only to tell five categories apart. Dark mode is the same statement printed at night on deep navy, with every role preserved.

**Key Characteristics:**
- One white sheet on tinted paper; the sheet holds the whole statement.
- Rules, not cards: hairline grey-green rules between rows, navy rules for totals and the amount-due box.
- Every amount in tabular lining figures, right-aligned in columns.
- A faint guilloche security band crowns the sheet.
- The ledger total is double-underlined and equals the amount-due figure.

## Colors

A cool, near-monochrome statement palette of navy ink on grey-green paper, with three meaning-bearing inks and five muted category inks.

### Primary
- **Bank Green** (green): the only action colour. Primary buttons, text buttons, focus outline, input focus ring, selection, the "Lens" half of the wordmark, active tab count, spinner arc. Hover deepens to **Vault Green** (green-hi). **Green Wash** (green-wash) is the reserved pale fill of the same ink.

### Secondary
- **Debit Red** (red): money about to leave and destruction. The next-debit tag and dot, row dates within seven days, required-field asterisks, the danger button, trash hover, the delete choice when selected. **Debit Wash** (red-wash) fills the next-debit line and destructive hover backgrounds.

### Tertiary
- **Ledger Amber** (amber): paused status chips and the unknown-currency warning under the amount-due box, on **Amber Wash** (amber-wash).

### Category inks
- **Plum** (cat-entertainment), **Teal Slate** (cat-productivity), **Statement Blue** (cat-cloud), **Ochre** (cat-ai), **Pewter** (cat-other). Used only in the segmented split bar and 10px category swatches. Defined in `js/config.js`, not as custom properties.

### Neutral
- **Security Tint Paper** (paper): page ground behind the sheet; also the translucent letterhead.
- **Statement White** (sheet): the sheet, dialogs, inputs, ghost buttons, emoji tiles; also text on filled buttons.
- **Counterfoil Tint** (tint): guilloche band, fine-print footer, dialog footers, row and icon hover, selected choice, quiet next-debit line.
- **Navy Ink** (ink): all primary type, the amount-due box border, total rules, active tab underline, dialog border.
- **Ink 2 / Ink 3** (ink-2, ink-3): secondary values and labels / column heads, notes, meta, placeholders.
- **Rule / Soft Rule** (rule, rule-soft): structural borders and table-head rules / row dividers and bar tracks.

Dark mode (`.dark`) redefines every token in place: paper #080E1B, sheet #0F1729, tint #131D33, ink #E7EBF3, ink-2 #B3BCCD, ink-3 #8E98AD, rule #27324A, rule-soft #1B2540, green #79C59B, green-hi #95D4B0, green-wash #13291F, red #EC8B83, red-wash #2E1719, amber #E3B566, amber-wash #2A2213. Category inks do not change.

### Named Rules
**The Meaning Ink Rule.** Green means "act", red means "money leaves or data dies", amber means "paused or uncertain". None is used for decoration, and no category ink may sit near green or red.

**The Red Is Earned Rule.** The next-debit line turns red only when a charge falls within seven days; otherwise it sits quiet on the tint with a grey dot.

## Typography

**Display Font:** System CJK sans stack (-apple-system, PingFang HK/TC, Noto Sans TC, Microsoft JhengHei, Segoe UI)
**Body Font:** the same stack
**Label/Mono Font:** none distinct; figures use `tnum` and `lnum` on the body face

**Character:** One sans in many weights, set like a statement: heavy navy figures, plain body, small grey semibold column heads. The stack is a constraint of the platform (zh-Hant, no CDN, no build step), not a style.

### Hierarchy
- **Display** (800, clamp(40px, 6vw, 60px), line-height 1, -0.035em): the monthly HKD figure in the amount-due box only, with an 18px/700 ink-2 "HK$" prefix on its baseline.
- **Headline** (800, 20px, -0.02em): the wordmark.
- **Title** (700, 16px; dialogs 17px): section and dialog titles. Ledger total figure at 800/18px.
- **Body** (400, 15px, 1.55; 14px under 720px): running text. Table cells 14px; names and figures at 600–700.
- **Label** (600, 12px): table column heads, tab counts, status chips, item notes (400). Form labels at 13px/600 in ink-2.

### Named Rules
**The Tabular Figures Rule.** Every amount, date, rate and count is set in tabular lining figures (`font-feature-settings: "tnum" 1, "lnum" 1` on body plus `.num`) and right-aligned in its column, so the eye can run a column like a bank clerk.

**The One Big Number Rule.** Display scale belongs to the monthly amount due. No other figure on the screen comes close.

## Layout

A single centred column, 1080px max, holding one sheet. A sticky translucent letterhead (blurred paper at 88%) carries brand and actions only. Inside the sheet: the guilloche band (14px), then sections padded 28px 32px and separated by 1px rules. The statement head is a two-column grid (account details, amount-due box up to 420px, 32px gap); at 860px it stacks with the amount-due box first. The next-debit line spans the sheet's full width between the head and the subtotals.

Account details are a definition list with an 88px label column and soft rules between rows. Tables run edge to edge of the section with 12px 10px cells and no outer padding on first/last columns.

Under 720px: section padding becomes 20px 16px, the sheet takes a 16px margin, the wordmark subtitle hides, and the ledger becomes a two-row grid per item (name and monthly figure on top, a meta line and actions below), with category, cycle, original amount and next-date columns folded into the meta line.

## Elevation & Depth

Flat by construction. Depth comes from the paper/sheet value step and rules, not shadow. The single shadow token is a 1px lift that only separates the sheet (and toasts, the API activity pill) from the paper. Dialogs sit on a navy scrim with a 1px ink border and no shadow.

### Shadow Vocabulary
- **Sheet lift** (`box-shadow: 0 1px 2px rgba(20, 33, 61, 0.08)`; dark `0 1px 2px rgba(0, 0, 0, 0.4)`): the statement sheet, toasts, API activity pill.

### Named Rules
**The Paper Not Shadow Rule.** If a surface needs to read as separate, step its value (paper to sheet to tint) or rule it. Do not add a larger shadow.

## Shapes

Small, square-ish corners: 2px on the split bar and swatches, 3px on status chips, 4px on buttons, inputs, choices, the amount-due box and emoji tiles, 6px on the sheet. Dialogs are square (0px), like a slip laid over the statement. Rules are the dominant form: 1px grey-green hairlines, 1px navy for totals, 2px navy for the amount-due box, and a 3px navy double rule under the ledger total. The guilloche band is one repeated 48x14 SVG of interlaced sine curves used as a mask, so its ink follows the theme.

## Components

### Buttons
- **Shape:** gently squared (4px), 38px tall, 16px horizontal padding, 14px/600, 6px icon gap.
- **Primary:** bank green with white text; hover deepens to vault green. One per surface: "新增訂閱" in the letterhead, the save action in dialogs.
- **Ghost:** white sheet with a rule border; hover darkens the border to ink-3.
- **Danger:** debit red; hover dims by brightness(.92). Only for confirming removal.
- **Text:** green, no fill, 28px tall; hover underlines with 3px offset. Used in the demo strip.
- **Icon button:** 38px (32px small, 30px on mobile rows), transparent ink-2 stroke icon; hover fills tint and darkens to ink. The danger variant hovers to red on red wash.
- **Focus:** 2px green outline at 2px offset on every focusable element. Transitions are 0.15s ease on colour properties only.

### Amount-due box (signature)
2px navy border, 4px radius. The label (14px/600 ink-2) sits over the display figure; beneath a 1px navy rule, ruled rows for yearly and cumulative totals (16px/700 figures). An amber warning row appears only when a currency's rate is unknown.

### Next-debit line (signature)
Full-width band, 12px 32px, carrying an 8px dot, the tag "下一筆扣款", the item name, date with relative days, original amount and a count of charges within seven days. Red wash and red tag inside seven days; tint and grey otherwise.

### Category subtotals
A 12px segmented split bar (2px gaps, 2px radius, soft-rule track) above a ruled table: swatch and name, count, share, monthly HKD. The footer row sits on a 1px navy rule in 700.

### Ledger (signature)
Status tabs with an ink underline on the active tab and a green count. Rows: a 34px emoji tile (sheet, rule border, 4px), name in 600 with a 12px ink-3 note, category swatch, cycle, original amount with a grey currency code, monthly HKD figure in 700, next date (red and 600 within seven days), and icon actions. Each active row's monthly cell carries a 2px hairline proportion bar on a soft-rule track, filled from the right in ink-2, scaled to the largest active line. Rows sort active, paused, archived, then by monthly HKD descending; row hover fills tint. Paused and archived rows fade emoji and swatch to 50% and drop the figure to ink-2; archived figures are struck through. The total row sits on a 1px navy rule and its figure (800, 18px) is underlined with a 3px navy double rule.

### Chips
- **Status:** 12px/600, 1px currentColor border, 3px radius, no fill. Paused in amber, archived in ink-3.

### Inputs / Fields
- **Style:** 40px, 8px 10px padding, 1px rule border, 4px radius, white sheet, 15px text. Hover darkens border to ink-3.
- **Focus:** border turns green with a 3px green ring at 22% mix.
- **Select:** native appearance removed, 12px chevron at right 10px.
- **Choice cards:** 1px rule, 4px radius, 12px 14px; selected shows an ink border on tint, the danger choice a red border on red wash.

### Dialogs
460px (400px small), square corners, 1px ink border, sheet background. Head and foot separated by rules; the foot sits on tint with equal-width buttons. Enter with a 0.2s fade on the scrim and a 0.35s rise of 12px on cubic-bezier(.16, 1, .3, 1).

### Navigation
The letterhead: wordmark ("Sub" in ink, "Lens" in green) with a 13px ink-3 subtitle, then icon buttons and the primary add button. Sticky, blurred, one line at 390px.

## Do's and Don'ts

### Do:
- **Do** set every figure in tabular lining numerals and right-align it.
- **Do** build structure from rules: 1px rule or rule-soft between rows, 1px ink above totals, 3px double ink under the grand total.
- **Do** keep the amount-due figure the only display-scale element.
- **Do** reserve green for actions, red for imminent debits and destruction, amber for paused or uncertain states.
- **Do** define both light and dark values for any new colour token on `:root` and `.dark`.
- **Do** keep per-item emoji in its 34px ruled tile; it is user content.

### Don't:
- **Don't** introduce gradient hero cards, doughnut charts or grids of soft rounded cards; this world is a statement, not a dashboard.
- **Don't** use green, red or amber decoratively, or add a category ink near either meaning ink.
- **Don't** add shadows beyond the 1px sheet lift.
- **Don't** round controls or containers beyond 6px; the 8px next-debit dot is the only circle.
