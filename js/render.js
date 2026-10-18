import { state, CAT_COLORS } from './config.js';
import { monthlyHKD, calcSummary, calcSpendingRanking } from './calc.js';
import { fmtHKD, fmtNum } from './currency.js';
import { daysUntil, formatDate } from './dates.js';
import { escHtml } from './ui.js';

// Fields that affect financial totals and subtotals; others (e.g. notes) only need a row redraw.
const FINANCIAL_FIELDS = ['amount', 'currency', 'billingCycle', 'status', 'startDate', 'endDate'];

export function financialChanged(oldSub, newData) {
  return FINANCIAL_FIELDS.some(f => String(oldSub[f] ?? '') !== String(newData[f] ?? ''));
}

function catColor(cat) {
  return CAT_COLORS[cat] || CAT_COLORS['其他'];
}

function icon(name) {
  return `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

function shortDate(dateStr) {
  const d = new Date(String(dateStr).split('T')[0] + 'T00:00:00');
  return isNaN(d) ? '' : d.toLocaleDateString('zh-HK', { month: 'short', day: 'numeric' });
}

function relDays(d) {
  if (d === 0) return '今天';
  if (d === 1) return '明天';
  return `${d} 天後`;
}

// Builds the HTML string for a single ledger row.
function buildCard(sub) {
  const archived = sub.status === 'archived';
  const paused   = sub.status === 'paused';
  const active   = sub.status === 'active';
  const id       = escHtml(String(sub.id));
  const name     = escHtml(sub.name);

  const m        = monthlyHKD(sub);
  const cycleLbl = sub.billingCycle === 'yearly' ? '每年' : '每月';
  const amount   = parseFloat(sub.amount) || 0;
  const days     = daysUntil(sub.nextBillingDate);

  let next;
  if (archived)    next = `<span class="status archived">已封存</span>`;
  else if (paused) next = `<span class="status paused">暫停</span> ${sub.pausedDate ? formatDate(sub.pausedDate) : ''}`;
  else             next = `${formatDate(sub.nextBillingDate)}${days >= 0 && days <= 7 ? `・${relDays(days)}` : ''}`;
  const soon = active && days >= 0 && days <= 7;

  const note = archived
    ? `結束：${sub.endDate ? formatDate(sub.endDate) : '未記錄'}${sub.notes ? `・${escHtml(String(sub.notes))}` : ''}`
    : (sub.notes ? escHtml(String(sub.notes)) : '');

  // Archived rows get a spacer so edit/remove stay in their columns.
  let toggleBtn = '<span class="icon-btn sm" aria-hidden="true"></span>';
  if (active) {
    toggleBtn = `<button data-action="pause" data-id="${id}" class="icon-btn sm" title="暫停" aria-label="暫停 ${name}">${icon('pause')}</button>`;
  } else if (paused) {
    toggleBtn = `<button data-action="resume" data-id="${id}" class="icon-btn sm" title="恢復" aria-label="恢復 ${name}">${icon('play')}</button>`;
  }

  return `
    <tr data-sub-id="${escHtml(String(sub.id))}" class="row-${escHtml(sub.status)}">
      <td class="cell-item">
        <div class="item">
          <span class="item-emoji" aria-hidden="true">${escHtml(sub.emoji || '📦')}</span>
          <div class="min-w">
            <p class="item-name">${name}</p>
            ${note ? `<p class="item-note">${note}</p>` : ''}
          </div>
        </div>
      </td>
      <td class="col-cat"><span class="cat"><span class="swatch" style="background:${catColor(sub.category)}"></span>${escHtml(sub.category)}</span></td>
      <td class="col-cycle"><span class="cycle">${cycleLbl}</span></td>
      <td class="col-orig"><span class="orig num"><span class="code">${escHtml(sub.currency)}</span>${fmtNum(amount)}</span></td>
      <td class="cell-monthly r">
        <span class="monthly num"><span class="monthly-figure">${m === null ? '匯率未知' : fmtNum(m)}</span></span>
      </td>
      <td class="col-next"><span class="next num${soon ? ' is-soon' : ''}">${next}</span></td>
      <td class="cell-meta">${escHtml(sub.currency)} ${fmtNum(amount)}/${sub.billingCycle === 'yearly' ? '年' : '月'}・${archived ? '已封存' : paused ? '暫停中' : `<span class="${soon ? 'next is-soon' : ''}">${shortDate(sub.nextBillingDate)}</span>`}</td>
      <td class="cell-actions">
        <div class="actions">
          ${toggleBtn}
          <button data-action="edit" data-id="${id}" class="icon-btn sm" title="編輯" aria-label="編輯 ${name}">${icon('pencil')}</button>
          <button data-action="remove" data-id="${id}" class="icon-btn sm danger" title="移除" aria-label="移除 ${name}">${icon('trash')}</button>
        </div>
      </td>
    </tr>`;
}

export function renderAll() {
  renderSummary();
  renderInsights();
  renderFilterTabs();
  renderCards();
  renderSubtotals();
}

export function renderFilterTabs() {
  const counts = { all: state.subscriptions.length, active: 0, paused: 0, archived: 0 };
  state.subscriptions.forEach(s => { if (s.status in counts) counts[s.status]++; });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    const key      = btn.dataset.filter;
    const isActive = state.filter === key;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
    const badge = btn.querySelector('.tab-count');
    if (badge) badge.textContent = counts[key] ?? 0;
  });

  const parts = [`${counts.active} 項啟用`];
  if (counts.paused)   parts.push(`${counts.paused} 項暫停`);
  if (counts.archived) parts.push(`${counts.archived} 項封存`);
  document.getElementById('accountCount').textContent = parts.join('・');
}

// The next-debit line under the statement head.
export function renderInsights() {
  const el = document.getElementById('nextDebit');
  const upcoming = state.subscriptions
    .filter(s => s.status === 'active')
    .map(s => ({ sub: s, d: daysUntil(s.nextBillingDate) }))
    .filter(r => !isNaN(r.d) && r.d >= 0)
    .sort((a, b) => a.d - b.d);

  if (upcoming.length === 0) {
    el.className = 'panel next-debit';
    el.innerHTML = `<span class="next-debit-tag">下一筆扣款</span><span>沒有已排期的扣款</span>`;
    return;
  }

  const { sub, d } = upcoming[0];
  const soon = d <= 7;
  el.className = soon ? 'panel next-debit is-soon' : 'panel next-debit';
  el.innerHTML = `
    <span class="next-debit-tag">下一筆扣款</span>
    <span>${escHtml(sub.name)}</span>
    <span class="num">${formatDate(sub.nextBillingDate)}${soon ? `（${relDays(d)}）` : ''}</span>
    <span class="num">${escHtml(sub.currency)} ${fmtNum(parseFloat(sub.amount) || 0)}</span>`;
}

// Updates summary + one row in-place; redraws subtotals only when financial data changed.
export function renderAfterEdit(id, hasFinancialChange) {
  renderSummary();
  renderInsights();
  const sub  = state.subscriptions.find(s => String(s.id) === String(id));
  const card = document.querySelector(`[data-sub-id="${id}"]`);
  if (sub && card && !hasFinancialChange) {
    card.outerHTML = buildCard(sub);
  } else {
    renderCards(); // amounts changed: order, bars and the total row all move
  }
  if (hasFinancialChange) renderSubtotals();
}

export function renderSummary() {
  const { monthly, yearly, cumulative, unknownCurrencies } = calcSummary();
  document.getElementById('summaryMonthly').textContent    = fmtNum(monthly);
  document.getElementById('summaryYearly').textContent     = fmtHKD(yearly);
  document.getElementById('summaryCumulative').textContent = fmtHKD(cumulative);
  document.getElementById('statementDate').textContent     = formatDate(new Date().toISOString());

  const warn = document.getElementById('summaryWarning');
  warn.hidden = unknownCurrencies.size === 0;
  if (unknownCurrencies.size > 0) {
    warn.textContent = `${[...unknownCurrencies].join('、')} 匯率未知，已從總計中排除`;
  }
}

export function renderCards() {
  const list  = document.getElementById('subscriptionList');
  const empty = document.getElementById('emptyState');

  const rank = { active: 0, paused: 1, archived: 2 };
  const filtered = state.subscriptions
    .filter(s => state.filter === 'all' || s.status === state.filter)
    .sort((a, b) =>
      (rank[a.status] ?? 3) - (rank[b.status] ?? 3) ||
      (monthlyHKD(b) ?? 0) - (monthlyHKD(a) ?? 0));

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  list.innerHTML = filtered.map(buildCard).join('');
}

export function renderSubtotals() {
  const el = document.getElementById('categoryBreakdown');
  const byCat = {};
  calcSpendingRanking(state.subscriptions).forEach(r => {
    byCat[r.category] ??= { total: 0, count: 0 };
    byCat[r.category].total += r.monthly;
    byCat[r.category].count += 1;
  });

  const rows  = Object.entries(byCat).sort((a, b) => b[1].total - a[1].total);
  const total = rows.reduce((t, [, v]) => t + v.total, 0);

  if (rows.length === 0) {
    el.innerHTML = `<p class="empty-note">還沒有啟用中的訂閱。</p>`;
    return;
  }

  const pct = v => (v / total) * 100;
  el.innerHTML = `
    <div class="split-bar" role="img" aria-label="各分類佔每月支出比例">
      ${rows.map(([cat, v]) => `<span style="width:${pct(v.total)}%;background:${catColor(cat)}" title="${escHtml(cat)} ${pct(v.total).toFixed(0)}%"></span>`).join('')}
    </div>
    <table class="subtotal-table">
      <thead><tr><th>分類</th><th class="r">項目</th><th class="r">佔比</th><th class="r">月均港幣</th></tr></thead>
      <tbody>
        ${rows.map(([cat, v]) => `
          <tr>
            <td><span class="swatch" style="background:${catColor(cat)}"></span>${escHtml(cat)}</td>
            <td class="r num">${v.count}</td>
            <td class="r num">${pct(v.total).toFixed(1)}%</td>
            <td class="r num">${fmtNum(v.total)}</td>
          </tr>`).join('')}
      </tbody>
      <tfoot><tr><td>合計</td><td class="r num">${rows.reduce((n, [, v]) => n + v.count, 0)}</td><td class="r num">100%</td><td class="r num">${fmtNum(total)}</td></tr></tfoot>
    </table>`;
}
