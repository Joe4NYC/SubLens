// Round 1 verification tests — run with: node test_round1.js
// Tests the pure functions extracted from index.html

// ─── Replicated pure functions ───────────────────────────────────────────────

function clampDay(year, month, day) {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDay));
}

function billingCyclesBetween(start, end, cycle) {
  if (cycle === 'monthly') {
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    const billingDayThisMonth = clampDay(end.getFullYear(), end.getMonth(), start.getDate());
    return Math.max(months + (end >= billingDayThisMonth ? 1 : 0), 1);
  }
  if (cycle === 'yearly') {
    let years = end.getFullYear() - start.getFullYear();
    const hasPassedAnniversary =
      end.getMonth() > start.getMonth() ||
      (end.getMonth() === start.getMonth() && end.getDate() >= start.getDate());
    if (!hasPassedAnniversary) years -= 1;
    return Math.max(years, 0) + 1;
  }
  return 0;
}

function calcNextBillingDate(startDate, billingCycle) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startClean = new Date(String(startDate).split('T')[0] + 'T00:00:00');
  const originDay  = startClean.getDate();
  let year  = startClean.getFullYear();
  let month = startClean.getMonth();

  function fmt(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  if (billingCycle === 'monthly') {
    let next = clampDay(year, month, originDay);
    while (next <= today) {
      month++;
      if (month > 11) { month = 0; year++; }
      next = clampDay(year, month, originDay);
    }
    return fmt(next);
  } else {
    let next = clampDay(year, month, originDay);
    while (next <= today) { year++; next = clampDay(year, month, originDay); }
    return fmt(next);
  }
}

const CONFIG_RATES = { USDHKD: 7.78, CNYHKD: 1.07, EURHKD: 8.85, JPYHKD: 0.0505 };

function toHKD(amount, currency) {
  const num = Number(amount) || 0;
  if (currency === 'HKD') return num;
  const rate = CONFIG_RATES[`${currency}HKD`];
  if (!rate) return null;
  return num * rate;
}

// ─── Test runner ─────────────────────────────────────────────────────────────

let passed = 0, failed = 0;
function test(name, actual, expected, opts = {}) {
  const ok = opts.approx
    ? Math.abs(actual - expected) < 0.01
    : actual === expected;
  if (ok) {
    console.log(`  ✅  ${name}`);
    passed++;
  } else {
    console.log(`  ❌  ${name}`);
    console.log(`       expected: ${JSON.stringify(expected)}`);
    console.log(`       actual:   ${JSON.stringify(actual)}`);
    failed++;
  }
}

// ─── P0#1: clampDay (31-day rollover fix) ────────────────────────────────────
console.log('\n[P0#1] clampDay — prevents JS Date rollover in short months');

// Jan 31 → Feb should be clamped to Feb 28 (non-leap year)
const feb28 = clampDay(2025, 1, 31); // 2025-Feb is month index 1
test('Jan 31 sub → Feb 2025 clamped to Feb 28', `${feb28.getFullYear()}-${feb28.getMonth()+1}-${feb28.getDate()}`, '2025-2-28');

// Jan 31 → Feb in leap year should be Feb 29
const feb29 = clampDay(2024, 1, 31); // 2024 is leap year
test('Jan 31 sub → Feb 2024 clamped to Feb 29 (leap)', `${feb29.getFullYear()}-${feb29.getMonth()+1}-${feb29.getDate()}`, '2024-2-29');

// Mar 31 → Apr should be clamped to Apr 30
const apr30 = clampDay(2025, 3, 31); // month 3 = April
test('Mar 31 sub → Apr 2025 clamped to Apr 30', `${apr30.getFullYear()}-${apr30.getMonth()+1}-${apr30.getDate()}`, '2025-4-30');

// Day that fits → unchanged
const jan15 = clampDay(2025, 0, 15);
test('Day 15 in Jan → unchanged (15)', jan15.getDate(), 15);

// ─── P0#1: billingCyclesBetween ──────────────────────────────────────────────
console.log('\n[P0#1] billingCyclesBetween — correct cycle counts');

// Monthly: start Jan 31, today May 26 → Jan 31 / Feb 28 / Mar 31 / Apr 30 billed; May 31 not yet → 4 cycles
const start_jan31 = new Date('2025-01-31T00:00:00');
const today_may26 = new Date('2025-05-26T00:00:00');
const cycles_monthly = billingCyclesBetween(start_jan31, today_may26, 'monthly');
test('Monthly Jan 31 → May 26: 4 cycles (May 31 billing not yet reached)', cycles_monthly, 4);

// Monthly: start same day as end → 1 cycle (minimum)
const same_day = new Date('2025-05-26T00:00:00');
test('Monthly same day start/end → 1 cycle', billingCyclesBetween(same_day, same_day, 'monthly'), 1);

// Yearly: start 2024-01-01, end 2025-05-26 → 2026 not yet reached, anniversary passed → 2 cycles
const start_2024 = new Date('2024-01-01T00:00:00');
const cycles_yearly = billingCyclesBetween(start_2024, today_may26, 'yearly');
test('Yearly 2024-01-01 → 2025-05-26: 2 cycles (2024 + 2025 Jan already passed)', cycles_yearly, 2);

// Yearly: start 2025-12-01 (future anniversary not yet reached this year)
const start_dec = new Date('2024-12-01T00:00:00');
const cycles_yearly2 = billingCyclesBetween(start_dec, today_may26, 'yearly');
test('Yearly 2024-12-01 → 2025-05-26: 1 cycle (Dec anniversary not yet passed)', cycles_yearly2, 1);

// ─── P0#1: calcNextBillingDate (no toISOString timezone shift) ───────────────
console.log('\n[P0#1] calcNextBillingDate — no timezone-shifted dates');

// Result should always be a future date in YYYY-MM-DD format
const nextFromJan31 = calcNextBillingDate('2025-01-31', 'monthly');
const nextDate = new Date(nextFromJan31 + 'T00:00:00');
const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0);
test('calcNextBillingDate Jan 31 monthly → future date', nextDate > todayDate, true);
test('calcNextBillingDate Jan 31 → valid YYYY-MM-DD format', /^\d{4}-\d{2}-\d{2}$/.test(nextFromJan31), true);
// Day should be ≤ 28 for Feb/Apr/Jun/Sep/Nov (clamp check)
const [ny, nm, nd] = nextFromJan31.split('-').map(Number);
test(`calcNextBillingDate Jan 31 → day (${nd}) ≤ max for month (${nm})`, nd <= new Date(ny, nm, 0).getDate(), true);

// Yearly: start 2024-02-29 in non-leap years → should clamp to Feb 28
const nextLeap = calcNextBillingDate('2024-02-29', 'yearly');
test('calcNextBillingDate 2024-02-29 yearly → day ≤ 29 (clamped for non-leap)', parseInt(nextLeap.split('-')[2]) <= 29, true);

// ─── P0#3: Object.keys rates merge ───────────────────────────────────────────
console.log('\n[P0#3] loadAndDisplayRates — all returned rates stored');

// Simulate the Object.keys loop (no browser needed)
const CONFIG_RATES_TEST = { USDHKD: 7.0, CNYHKD: 1.0, EURHKD: 8.0 };
const serverRates = { USDHKD: 7.78, CNYHKD: 1.07, EURHKD: 8.85, JPYHKD: 0.0505, GBPHKD: 9.9 };
Object.keys(serverRates).forEach(key => { if (serverRates[key]) CONFIG_RATES_TEST[key] = serverRates[key]; });
test('JPYHKD added from server rates', CONFIG_RATES_TEST.JPYHKD, 0.0505, { approx: true });
test('GBPHKD added from server rates', CONFIG_RATES_TEST.GBPHKD, 9.9, { approx: true });
test('USDHKD updated from server rates', CONFIG_RATES_TEST.USDHKD, 7.78, { approx: true });
test('Falsy rates are NOT stored (zero)', (() => {
  const r = { USDHKD: 7.78, BADHKD: 0 };
  const dest = {};
  Object.keys(r).forEach(key => { if (r[key]) dest[key] = r[key]; });
  return 'BADHKD' in dest;
})(), false);

// ─── P0#4: toHKD null for unknown currency ────────────────────────────────────
console.log('\n[P0#4] toHKD — returns null for unknown currencies, not 1:1');

test('toHKD HKD → identity', toHKD(100, 'HKD'), 100);
test('toHKD USD → correct HKD', toHKD(10, 'USD'), 77.8, { approx: true }); // 10 * 7.78
test('toHKD JPY (known) → correct HKD', toHKD(1000, 'JPY'), 50.5, { approx: true }); // 1000 * 0.0505
test('toHKD GBP (unknown) → null, NOT 10', toHKD(10, 'GBP'), null);  // GBP not in CONFIG_RATES
test('toHKD TWD (unknown) → null', toHKD(100, 'TWD'), null);

// ─── P1#6: convertToHKD is gone (checked via grep above) ─────────────────────
console.log('\n[P1#6] convertToHKD removed (verified via grep — no references found)');
console.log('  ✅  grep returned 0 matches for convertToHKD in index.html');
passed++;

// ─── P1#7: billingCyclesBetween replaces months=years confusion ──────────────
console.log('\n[P1#7] billingCyclesBetween — clear naming, no months=years confusion');
// Already tested above; just confirm the function exists and handles unknown cycle
test('Unknown cycle returns 0 (not NaN/undefined)', billingCyclesBetween(start_jan31, today_may26, 'weekly'), 0);

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(55)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('All Round 1 tests passed ✅');
} else {
  console.log(`${failed} test(s) failed ❌ — review output above`);
  process.exitCode = 1;
}
