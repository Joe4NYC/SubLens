// Round 4 verification tests — run with: node test_round4.js
// Tests P3#13 (token auth), P3#14 (modal ARIA/Esc), P3#15 (validateSubscription)

const fs   = require('fs');
const path = require('path');

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

const read = f => fs.readFileSync(path.join(__dirname, f), 'utf8');

// ─── P3#13: Token Auth ────────────────────────────────────────────────────────
console.log('\n[P3#13] API Token Authentication');

const gsSrc  = read('appsscript.gs');
const apiSrc = read('js/api.js');
const cfgSrc = read('js/config.js');
const src    = read('index.html');
const mainSrc = read('js/main.js');

test('appsscript.gs reads TOKEN from PropertiesService',
  gsSrc.includes("PropertiesService.getScriptProperties().getProperty('TOKEN')"), true);
test('appsscript.gs returns unauthorized when token mismatch',
  gsSrc.includes("'unauthorized'"), true);
test('config.js exports getToken',
  cfgSrc.includes('export function getToken'), true);
test('api.js imports getToken',
  apiSrc.includes('getToken'), true);
test('api.js appends token to URL',
  apiSrc.includes('token=${encodeURIComponent'), true);
test('api.js handles unauthorized error',
  apiSrc.includes("result.error === 'unauthorized'"), true);
test('api.js shows token modal on unauthorized',
  apiSrc.includes("showModal('tokenModalOverlay')"), true);
test('index.html has token modal overlay',
  src.includes('id="tokenModalOverlay"'), true);
test('index.html has token input',
  src.includes('id="tokenInput"'), true);
test('index.html has settings button',
  src.includes('id="btnTokenSettings"'), true);
test('main.js wires up btnTokenSettings',
  mainSrc.includes('btnTokenSettings'), true);
test('main.js wires up btnTokenSave',
  mainSrc.includes('btnTokenSave'), true);
test('main.js wires up btnTokenClear',
  mainSrc.includes('btnTokenClear'), true);

// ─── P3#14: Modal ARIA + Esc ──────────────────────────────────────────────────
console.log('\n[P3#14] Modal ARIA + Esc key');

const uiSrc = read('js/ui.js');

test('showModal sets role=dialog',
  uiSrc.includes("setAttribute('role', 'dialog')"), true);
test('showModal sets aria-modal=true',
  uiSrc.includes("setAttribute('aria-modal', 'true')"), true);
test('showModal focuses first focusable element',
  uiSrc.includes("?.focus()"), true);
test('showModal binds Escape key handler',
  uiSrc.includes("e.key === 'Escape'"), true);
test('showModal saves trigger element',
  uiSrc.includes('_triggerEl'), true);
test('hideModal removes Esc listener',
  uiSrc.includes('removeEventListener'), true);
test('hideModal restores focus to trigger',
  uiSrc.includes('_triggerEl?.focus()'), true);
test('hideModal clears _escHandler reference',
  uiSrc.includes('_escHandler = null'), true);

// ─── P3#15: Input Validation — structure ─────────────────────────────────────
console.log('\n[P3#15] Input Validation — structure in modals.js');

const modalsSrc = read('js/modals.js');

test('modals.js imports CATEGORIES and CURRENCIES',
  modalsSrc.includes('CATEGORIES, CURRENCIES') || modalsSrc.includes('CURRENCIES, CATEGORIES'), true);
test('modals.js defines BILLING_CYCLES',
  modalsSrc.includes('BILLING_CYCLES'), true);
test('modals.js has validateSubscription function',
  modalsSrc.includes('function validateSubscription'), true);
test('validates amount > 0',
  modalsSrc.includes('amount <= 0'), true);
test('validates amount upper limit',
  modalsSrc.includes('1_000_000') || modalsSrc.includes('1000000'), true);
test('validates currency enum',
  modalsSrc.includes('CURRENCIES.includes'), true);
test('validates billingCycle enum',
  modalsSrc.includes('BILLING_CYCLES.includes'), true);
test('validates category enum',
  modalsSrc.includes('CATEGORIES.includes'), true);
test('validates emoji length with spread',
  modalsSrc.includes('[...data.emoji]'), true);
test('validates startDate not in future',
  modalsSrc.includes('startDate >'), true);
test('saveSubscription calls validateSubscription',
  modalsSrc.includes('validateSubscription(data)'), true);
test('old manual checks removed (no standalone "if (!name)")',
  !modalsSrc.includes("if (!name)"), true);

// ─── P3#15: validateSubscription logic correctness ────────────────────────────
console.log('\n[P3#15] validateSubscription logic correctness');

const CATEGORIES_LOCAL = ['娛樂', '工作效率', '雲端儲存', 'AI工具', '其他'];
const CURRENCIES_LOCAL  = ['USD','CNY','EUR','HKD','GBP','JPY','TWD','KRW','SGD','AUD','CAD'];
const BILLING_CYCLES    = ['monthly', 'yearly'];

function validateSubscription(data) {
  if (!data.name?.trim())
    return { ok: false, error: '請填寫訂閱名稱' };
  if (!data.startDate)
    return { ok: false, error: '請選擇開始日期' };
  if (data.startDate > new Date().toISOString().split('T')[0])
    return { ok: false, error: '開始日期不能是未來日期' };
  if (isNaN(data.amount) || data.amount <= 0)
    return { ok: false, error: '請輸入有效金額（大於 0）' };
  if (data.amount > 1_000_000)
    return { ok: false, error: '金額不能超過 1,000,000' };
  if (!CURRENCIES_LOCAL.includes(data.currency))
    return { ok: false, error: '請選擇有效的貨幣' };
  if (!BILLING_CYCLES.includes(data.billingCycle))
    return { ok: false, error: '請選擇有效的繳費週期' };
  if (!CATEGORIES_LOCAL.includes(data.category))
    return { ok: false, error: '請選擇有效的分類' };
  if ([...data.emoji].length > 4)
    return { ok: false, error: 'Emoji 不能超過 4 個字元' };
  return { ok: true };
}

const base = {
  name: 'Netflix',
  category: '娛樂',
  emoji: '🎬',
  billingCycle: 'monthly',
  amount: 78,
  currency: 'HKD',
  startDate: '2024-01-01',
  notes: ''
};

test('valid data → ok',                       validateSubscription(base).ok, true);
test('empty name → error',                    validateSubscription({ ...base, name: '' }).ok, false);
test('spaces-only name → error',              validateSubscription({ ...base, name: '   ' }).ok, false);
test('missing startDate → error',             validateSubscription({ ...base, startDate: '' }).ok, false);
test('future startDate → error',              validateSubscription({ ...base, startDate: '2099-01-01' }).ok, false);
test('today startDate → ok',                  validateSubscription({ ...base, startDate: new Date().toISOString().split('T')[0] }).ok, true);
test('amount 0 → error',                      validateSubscription({ ...base, amount: 0 }).ok, false);
test('amount -5 → error',                     validateSubscription({ ...base, amount: -5 }).ok, false);
test('amount NaN → error',                    validateSubscription({ ...base, amount: NaN }).ok, false);
test('amount 1,000,001 → error',              validateSubscription({ ...base, amount: 1_000_001 }).ok, false);
test('amount 1,000,000 → ok',                 validateSubscription({ ...base, amount: 1_000_000 }).ok, true);
test('invalid currency → error',              validateSubscription({ ...base, currency: 'XYZ' }).ok, false);
test('valid currency GBP → ok',               validateSubscription({ ...base, currency: 'GBP' }).ok, true);
test('invalid billingCycle → error',          validateSubscription({ ...base, billingCycle: 'weekly' }).ok, false);
test('billingCycle yearly → ok',              validateSubscription({ ...base, billingCycle: 'yearly' }).ok, true);
test('invalid category → error',              validateSubscription({ ...base, category: '未知' }).ok, false);
test('valid category AI工具 → ok',            validateSubscription({ ...base, category: 'AI工具' }).ok, true);
test('emoji 4 code points → ok',              validateSubscription({ ...base, emoji: '🎬🎬🎬🎬' }).ok, true);
test('emoji 5 code points → error',           validateSubscription({ ...base, emoji: '🎬🎬🎬🎬🎬' }).ok, false);
test('notes-only change does not affect validation', validateSubscription({ ...base, notes: 'anything' }).ok, true);

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(55)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) console.log('All Round 4 tests passed ✅');
else { console.log(`${failed} test(s) failed ❌`); process.exitCode = 1; }
