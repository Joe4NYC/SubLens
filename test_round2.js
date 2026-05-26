// Round 2 verification tests — run with: node test_round2.js
// Tests P0#2 (bills removed), P1#8 (constants), P1#9 (state.charts), P1#10 (null pattern)

let passed = 0, failed = 0;
function test(name, actual, expected) {
  const ok = actual === expected;
  if (ok) { console.log(`  ✅  ${name}`); passed++; }
  else {
    console.log(`  ❌  ${name}`);
    console.log(`       expected: ${JSON.stringify(expected)}`);
    console.log(`       actual:   ${JSON.stringify(actual)}`);
    failed++;
  }
}

// ─── Read index.html source ───────────────────────────────────────────────────
const fs  = require('fs');
const src = fs.readFileSync('index.html', 'utf8');

// ─── P0#2: bills system removed ──────────────────────────────────────────────
console.log('\n[P0#2] bills system removed from frontend');

test('state has no bills array',          src.includes("bills: []"), false);
test('apiFetch getBills removed',         src.includes("apiFetch('getBills')"), false);
test('apiFetch addBill removed',          src.includes("apiFetch('addBill'"), false);
test('state.bills filter removed',        src.includes("state.bills"), false);
test('Promise.all subs+bills removed',    src.includes("Promise.all"), false);
// deleteBills flag may still be sent to backend — that's intentional
test('backend deleteBills param kept',    src.includes("deleteBills: true"), true);

// ─── P1#8: single-source constants + dynamic selects ─────────────────────────
console.log('\n[P1#8] CATEGORIES/CURRENCIES constants + dynamic select population');

test('CATEGORIES array defined',          src.includes("const CATEGORIES = ["), true);
test('CURRENCIES array defined',          src.includes("const CURRENCIES  = Object.keys(CURRENCY_FLAGS)"), true);
test('populateSelects function defined',  src.includes("function populateSelects()"), true);
test('populateSelects called in init',    src.includes("populateSelects();"), true);

// The HTML <select> elements should no longer have hardcoded <option> tags
const catSelectBlock = src.match(/<select id="fieldCategory"[\s\S]*?<\/select>/)?.[0] ?? '';
const curSelectBlock = src.match(/<select id="fieldCurrency"[\s\S]*?<\/select>/)?.[0] ?? '';
test('fieldCategory has no hardcoded <option>',   catSelectBlock.includes('<option'), false);
test('fieldCurrency has no hardcoded <option>',   curSelectBlock.includes('<option'), false);

// All 11 currencies from CURRENCY_FLAGS should be in the constant, not just 3
const currencyFlagsBlock = src.match(/const CURRENCY_FLAGS = \{[\s\S]*?\};/)?.[0] ?? '';
['USD','CNY','EUR','HKD','GBP','JPY','TWD','KRW','SGD','AUD','CAD'].forEach(c => {
  test(`CURRENCY_FLAGS includes ${c}`, currencyFlagsBlock.includes(`${c}:`), true);
});

// ─── P1#9: chart instances in state.charts ────────────────────────────────────
console.log('\n[P1#9] chart instances unified in state.charts');

test('state.charts defined (not state.pieChart)', src.includes("charts: { pie: null, trend: null }"), true);
test('state.pieChart removed from state def',     src.includes("pieChart: null"), false);
test('window.trendChartInstance removed',         src.includes("window.trendChartInstance"), false);
test('state.charts.pie used for pie chart',       src.includes("state.charts.pie"), true);
test('state.charts.trend used for trend chart',   src.includes("state.charts.trend"), true);

// ─── P1#10: consistent null-based error handling ─────────────────────────────
console.log('\n[P1#10] apiFetch returns null on error; callers check null');

test('apiFetch returns null (not throw)',          src.includes("return null;") && !src.includes("throw err"), true);
test('loadAndDisplayRates has null guard',         src.includes("if (!rates) return;"), true);
test('saveSubscription update path checks null',  src.includes("if (result === null) return;"), true);
test('No silent catch(_) blocks remain',          src.includes("catch (_)"), false);

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(55)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) console.log('All Round 2 tests passed ✅');
else { console.log(`${failed} test(s) failed ❌`); process.exitCode = 1; }
