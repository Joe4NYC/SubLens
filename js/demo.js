// ============================================================
// Demo Mode — 讓沒有設定 Google Sheets / API 的用戶即時試用
// ============================================================
// 啟用後，所有 API 操作改由本機 localStorage 模擬，資料不會上傳。
// apiFetch() 會在 isDemoMode() 為真時改走 demoFetch()。
// ============================================================

import { calcNextBillingDate, todayISO } from './dates.js';

const DEMO_FLAG_KEY = 'sublens_demo';
const DEMO_DATA_KEY = 'sublens_demo_data';

// 模擬匯率（無需 GOOGLEFINANCE）
export const DEMO_RATES = { USDHKD: 7.8125, CNYHKD: 1.0824 };

// ── 種子資料 ───────────────────────────────────────────────
// 以相對今天的日期生成，確保「下次扣費」「累積支出」等計算有意義。
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function seedSubscriptions() {
  const seed = [
    { name: 'Netflix',         category: '娛樂',     emoji: '🎬', billingCycle: 'monthly', amount: 93,   currency: 'HKD', startDate: daysAgo(420), status: 'active',   notes: '4K 方案' },
    { name: 'Spotify',         category: '娛樂',     emoji: '🎵', billingCycle: 'monthly', amount: 58,   currency: 'HKD', startDate: daysAgo(300), status: 'active',   notes: '' },
    { name: 'ChatGPT Plus',    category: 'AI工具',   emoji: '🤖', billingCycle: 'monthly', amount: 20,   currency: 'USD', startDate: daysAgo(180), status: 'active',   notes: '' },
    { name: 'iCloud+',         category: '雲端儲存', emoji: '☁️', billingCycle: 'monthly', amount: 8,    currency: 'HKD', startDate: daysAgo(500), status: 'active',   notes: '200GB' },
    { name: 'Notion',          category: '工作效率', emoji: '📝', billingCycle: 'yearly',  amount: 96,   currency: 'USD', startDate: daysAgo(240), status: 'active',   notes: 'Plus 年費' },
    { name: 'YouTube Premium', category: '娛樂',     emoji: '📺', billingCycle: 'monthly', amount: 48,   currency: 'HKD', startDate: daysAgo(90),  status: 'paused',   pausedDate: daysAgo(20), notes: '暫停中' },
    { name: 'Adobe CC',        category: '工作效率', emoji: '🎨', billingCycle: 'monthly', amount: 53,   currency: 'USD', startDate: daysAgo(700), status: 'archived', endDate: daysAgo(60),    notes: '已取消' },
  ];

  return seed.map(s => ({
    id: crypto.randomUUID(),
    emoji: '📦',
    notes: '',
    endDate: '',
    pausedDate: '',
    ...s,
    nextBillingDate: calcNextBillingDate(s.startDate, s.billingCycle),
  }));
}

// ── 狀態 ───────────────────────────────────────────────────
export function isDemoMode() {
  return localStorage.getItem(DEMO_FLAG_KEY) === '1';
}

function loadStore() {
  try {
    const raw = localStorage.getItem(DEMO_DATA_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { /* fall through to reseed */ }
  const fresh = seedSubscriptions();
  saveStore(fresh);
  return fresh;
}

function saveStore(subs) {
  localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(subs));
}

export function enterDemoMode() {
  localStorage.setItem(DEMO_FLAG_KEY, '1');
  if (!localStorage.getItem(DEMO_DATA_KEY)) saveStore(seedSubscriptions());
  location.reload();
}

export function exitDemoMode() {
  localStorage.removeItem(DEMO_FLAG_KEY);
  location.reload();
}

export function resetDemoData() {
  saveStore(seedSubscriptions());
  location.reload();
}

// ── 模擬 API ───────────────────────────────────────────────
// 回傳形狀與 appsscript.gs 一致，讓 api.js / modals.js 無需特別處理。
export function demoFetch(action, data = null) {
  return new Promise(resolve => {
    // 加入少許延遲，模擬真實網路體驗（spinner 才看得見）
    setTimeout(() => resolve(handle(action, data)), 120);
  });
}

function handle(action, data) {
  let subs = loadStore();

  switch (action) {
    case 'getSubscriptions':
      return subs;

    case 'getRates':
      return { ...DEMO_RATES };

    case 'addSubscription':
      subs.push(data);
      saveStore(subs);
      return { success: true };

    case 'updateSubscription': {
      const idx = subs.findIndex(s => String(s.id) === String(data.id));
      if (idx === -1) return { error: '找不到 id 為 ' + data.id + ' 的資料列' };
      subs[idx] = { ...subs[idx], ...data };
      saveStore(subs);
      return { success: true };
    }

    case 'deleteSubscription':
      subs = subs.filter(s => String(s.id) !== String(data.id));
      saveStore(subs);
      return { success: true };

    default:
      return { error: 'Unknown action: ' + action };
  }
}

// ── 橫幅 UI ─────────────────────────────────────────────────
export function renderDemoBanner() {
  const el = document.getElementById('demoBanner');
  if (!el) return;

  if (isDemoMode()) {
    el.className =
      'bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-700';
    el.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span class="text-amber-800 dark:text-amber-200">
          🧪 <strong>Demo 模式</strong> — 範例資料僅儲存在此瀏覽器，不會上傳。
        </span>
        <div class="flex items-center gap-3">
          <button id="btnDemoReset" class="text-amber-700 dark:text-amber-300 hover:underline font-medium">重設資料</button>
          <button id="btnDemoExit" class="text-amber-700 dark:text-amber-300 hover:underline font-medium">結束 Demo</button>
        </div>
      </div>`;
    el.classList.remove('hidden');
    document.getElementById('btnDemoReset').addEventListener('click', resetDemoData);
    document.getElementById('btnDemoExit').addEventListener('click', exitDemoMode);
  } else {
    el.className =
      'bg-indigo-50 dark:bg-indigo-900/30 border-b border-indigo-200 dark:border-indigo-700';
    el.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span class="text-indigo-800 dark:text-indigo-200">
          👋 未設定 Google Sheets？用範例資料即時試用所有功能。
        </span>
        <button id="btnDemoEnter"
          class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
          試用 Demo
        </button>
      </div>`;
    el.classList.remove('hidden');
    document.getElementById('btnDemoEnter').addEventListener('click', enterDemoMode);
  }
}
