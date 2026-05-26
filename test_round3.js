// Round 3 verification tests — run with: node test_round3.js
// Tests P1#5 (ES module split) and P2#11 (renderAfterEdit + financialChanged)

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

const jsDir = path.join(__dirname, 'js');
const src   = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// ─── P1#5: ES module split ────────────────────────────────────────────────────
console.log('\n[P1#5] ES modules created and index.html wired up');

const modules = ['config.js','dates.js','currency.js','calc.js','ui.js','render.js','api.js','modals.js','main.js'];
modules.forEach(m => {
  test(`js/${m} exists`, fs.existsSync(path.join(jsDir, m)), true);
});

test('index.html uses <script type="module">', src.includes('<script type="module" src="js/main.js">'), true);
test('index.html has no inline JS (no global function declarations)', !src.includes('function renderAll'), true);
test('index.html has no inline const CONFIG',  !src.includes('const CONFIG'), true);

// ─── Dependency graph ─────────────────────────────────────────────────────────
console.log('\n[P1#5] Dependency graph — no cycles, all imports resolve');

const deps = {};
for (const m of modules) {
  const code = fs.readFileSync(path.join(jsDir, m), 'utf8');
  deps[m] = [...code.matchAll(/^import .+ from '\.\/(.+\.js)'/gm)].map(x => x[1]);
}

function hasCycle(node, visited, stack) {
  visited.add(node); stack.add(node);
  for (const d of (deps[node] || [])) {
    if (!visited.has(d) && hasCycle(d, visited, stack)) return true;
    if (stack.has(d)) return true;
  }
  stack.delete(node);
  return false;
}
const cycles = modules.filter(m => hasCycle(m, new Set(), new Set()));
test('No circular dependencies', cycles.length, 0);

const missing = [];
for (const [m, imps] of Object.entries(deps)) {
  imps.forEach(i => { if (!fs.existsSync(path.join(jsDir, i))) missing.push(`${m}→${i}`); });
}
test('All import paths resolve', missing.length, 0);

// ─── Module contents ─────────────────────────────────────────────────────────
console.log('\n[P1#5] Each module exports the right symbols');

const read = m => fs.readFileSync(path.join(jsDir, m), 'utf8');

test('config.js exports CONFIG',        read('config.js').includes('export const CONFIG'), true);
test('config.js exports state',         read('config.js').includes('export const state'), true);
test('config.js exports CURRENCY_FLAGS',read('config.js').includes('export const CURRENCY_FLAGS'), true);
test('config.js exports CAT_COLORS',    read('config.js').includes('export const CAT_COLORS'), true);
test('dates.js exports clampDay',       read('dates.js').includes('export function clampDay'), true);
test('dates.js exports billingCyclesBetween', read('dates.js').includes('export function billingCyclesBetween'), true);
test('currency.js exports toHKD',       read('currency.js').includes('export function toHKD'), true);
test('calc.js exports calcSummary',     read('calc.js').includes('export function calcSummary'), true);
test('calc.js exports calcCumulative',  read('calc.js').includes('export function calcCumulative'), true);
test('ui.js exports showToast',         read('ui.js').includes('export function showToast'), true);
test('ui.js exports escHtml',           read('ui.js').includes('export function escHtml'), true);
test('render.js exports renderAll',     read('render.js').includes('export function renderAll'), true);
test('render.js exports renderAfterEdit', read('render.js').includes('export function renderAfterEdit'), true);
test('render.js exports financialChanged', read('render.js').includes('export function financialChanged'), true);
test('api.js exports apiFetch',         read('api.js').includes('export async function apiFetch'), true);
test('modals.js exports saveSubscription', read('modals.js').includes('export async function saveSubscription'), true);

// ─── P2#11: renderAfterEdit + financialChanged ────────────────────────────────
console.log('\n[P2#11] renderAfterEdit and financialChanged');

const renderSrc = read('render.js');
const modalsSrc = read('modals.js');

test('render.js defines FINANCIAL_FIELDS',      renderSrc.includes('FINANCIAL_FIELDS'), true);
test('render.js financialChanged checks fields', renderSrc.includes('FINANCIAL_FIELDS.some'), true);
test('render.js renderAfterEdit targets data-sub-id', renderSrc.includes('data-sub-id'), true);
test('buildCard adds data-sub-id attribute',    renderSrc.includes('data-sub-id="${escHtml'), true);
test('modals.js calls renderAfterEdit for edit', modalsSrc.includes('renderAfterEdit('), true);
test('modals.js calls renderAll for new sub',   modalsSrc.includes('renderAll()'), true);
test('modals.js uses financialChanged before merge', (() => {
  // financialChanged must be called BEFORE state mutation (state.subscriptions[idx] = ...)
  const fcIdx   = modalsSrc.indexOf('financialChanged(');
  const mergeIdx = modalsSrc.indexOf('state.subscriptions[idx] = {');
  return fcIdx > 0 && mergeIdx > 0 && fcIdx < mergeIdx;
})(), true);

// ─── Simulate financialChanged logic ─────────────────────────────────────────
console.log('\n[P2#11] financialChanged logic correctness');

// Replicate the logic from render.js
const FINANCIAL_FIELDS = ['amount', 'currency', 'billingCycle', 'status', 'startDate', 'endDate'];
function financialChanged(oldSub, newData) {
  return FINANCIAL_FIELDS.some(f => String(oldSub[f] ?? '') !== String(newData[f] ?? ''));
}

const base = { amount: 10, currency: 'HKD', billingCycle: 'monthly', status: 'active', startDate: '2025-01-01', notes: 'old note' };

test('notes-only change → NOT financial', financialChanged(base, { ...base, notes: 'new note' }), false);
test('name-only change → NOT financial',  financialChanged(base, { ...base, name: 'New Name' }), false);
test('amount change → IS financial',      financialChanged(base, { ...base, amount: 20 }), true);
test('currency change → IS financial',    financialChanged(base, { ...base, currency: 'USD' }), true);
test('billingCycle change → IS financial', financialChanged(base, { ...base, billingCycle: 'yearly' }), true);
test('status change → IS financial',      financialChanged(base, { ...base, status: 'archived' }), true);
test('startDate change → IS financial',   financialChanged(base, { ...base, startDate: '2024-06-01' }), true);
test('endDate added → IS financial',      financialChanged(base, { ...base, endDate: '2025-12-31' }), true);
test('no change → NOT financial',         financialChanged(base, { ...base }), false);

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(55)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) console.log('All Round 3 tests passed ✅');
else { console.log(`${failed} test(s) failed ❌`); process.exitCode = 1; }
