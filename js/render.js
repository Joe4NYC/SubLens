import { state, CAT_COLORS } from './config.js';
import { monthlyHKD, calcSummary, calcLast6MonthsSpending } from './calc.js';
import { fmtHKD, formatAmount } from './currency.js';
import { daysUntil, formatDate } from './dates.js';
import { escHtml } from './ui.js';

// Fields that affect financial totals and charts; others (e.g. notes) only need a card redraw.
const FINANCIAL_FIELDS = ['amount', 'currency', 'billingCycle', 'status', 'startDate', 'endDate'];

export function financialChanged(oldSub, newData) {
  return FINANCIAL_FIELDS.some(f => String(oldSub[f] ?? '') !== String(newData[f] ?? ''));
}

function catColor(cat) {
  return CAT_COLORS[cat] || '#a855f7';
}

function getChartColors() {
  const isDark = document.documentElement.classList.contains('dark');
  return {
    gridColor:   isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
    tickColor:   isDark ? '#9CA3AF' : '#6B7280',
    labelColor:  isDark ? '#D1D5DB' : '#374151',
    borderColor: isDark ? '#1F2937' : '#fff'
  };
}

// Builds the HTML string for a single subscription card.
function buildCard(sub) {
  const archived    = sub.status === 'archived';
  const days        = daysUntil(sub.nextBillingDate);
  const urgentBadge = (!archived && days >= 0 && days <= 7)
    ? `<span class="text-xs font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">⚡ ${days}天後扣費</span>`
    : '';
  const cycleLbl   = sub.billingCycle === 'yearly' ? '每年' : '每月';
  const statusCls  = archived ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700';
  const statusLbl  = archived ? '封存' : '啟用中';
  const cardOpacity = archived ? 'opacity-60' : '';

  return `
    <div data-sub-id="${escHtml(String(sub.id))}"
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow ${cardOpacity}">
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-3xl leading-none">${escHtml(sub.emoji || '📦')}</span>
          <div class="min-w-0">
            <p class="font-semibold text-gray-800 dark:text-gray-100 truncate text-sm">${escHtml(sub.name)}</p>
            <span class="inline-block text-xs px-2 py-0.5 rounded-full text-white font-medium mt-0.5"
              style="background-color:${catColor(sub.category)}">${escHtml(sub.category)}</span>
          </div>
        </div>
        <span class="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusCls}">${statusLbl}</span>
      </div>

      <div class="flex items-baseline justify-between">
        <span class="text-base font-bold text-gray-800 dark:text-gray-100 amount-display">${formatAmount(sub.amount, sub.currency)}</span>
        <span class="text-xs text-gray-400 dark:text-gray-500">${cycleLbl}</span>
      </div>

      <div class="flex items-center gap-2 flex-wrap text-xs text-gray-400 dark:text-gray-500">
        <span>下次：${formatDate(sub.nextBillingDate)}</span>
        ${urgentBadge}
      </div>

      ${sub.notes ? `<p class="text-xs text-gray-400 dark:text-gray-500 truncate">${escHtml(String(sub.notes))}</p>` : ''}
      ${archived ? `<p class="text-xs text-gray-400 dark:text-gray-500">結束日期：${sub.endDate ? formatDate(sub.endDate) : '未記錄'}</p>` : ''}

      <div class="flex gap-2 pt-2 border-t border-gray-50 dark:border-gray-700 mt-auto">
        <button
          data-action="edit" data-id="${escHtml(String(sub.id))}"
          class="flex-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
          編輯
        </button>
        <button
          data-action="remove" data-id="${escHtml(String(sub.id))}"
          class="flex-1 text-xs text-red-500 hover:text-red-700 font-semibold py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          移除
        </button>
      </div>
    </div>`;
}

export function renderAll() {
  renderSummary();
  renderCards();
  renderCharts();
}

// Updates summary + one card in-place; redraws charts only when financial data changed.
export function renderAfterEdit(id, hasFinancialChange) {
  renderSummary();
  const sub  = state.subscriptions.find(s => String(s.id) === String(id));
  const card = document.querySelector(`[data-sub-id="${id}"]`);
  if (sub && card) {
    card.outerHTML = buildCard(sub);
  } else {
    renderCards(); // fallback: full re-render if card not found in DOM
  }
  if (hasFinancialChange) renderCharts();
}

export function renderSummary() {
  const { monthly, yearly, cumulative, unknownCurrencies } = calcSummary();
  document.getElementById('summaryMonthly').textContent    = fmtHKD(monthly);
  document.getElementById('summaryYearly').textContent     = fmtHKD(yearly);
  document.getElementById('summaryCumulative').textContent = fmtHKD(cumulative);

  let warn = document.getElementById('summaryWarning');
  if (!warn) {
    warn = document.createElement('p');
    warn.id = 'summaryWarning';
    warn.className = 'text-xs text-amber-600 dark:text-amber-400 text-center';
    document.getElementById('summaryMonthly').closest('section').after(warn);
  }
  warn.hidden = unknownCurrencies.size === 0;
  if (unknownCurrencies.size > 0) {
    warn.textContent = `⚠️ ${[...unknownCurrencies].join('、')} 匯率未知，已從總計中排除`;
  }
}

export function renderCards() {
  const list   = document.getElementById('subscriptionList');
  const empty  = document.getElementById('emptyState');
  let filtered = [...state.subscriptions];
  if (state.filter === 'active')   filtered = filtered.filter(s => s.status === 'active');
  if (state.filter === 'archived') filtered = filtered.filter(s => s.status === 'archived');

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  list.innerHTML = filtered.map(buildCard).join('');
}

export function renderCharts() {
  renderPieChart();
  renderTrendChart(state.subscriptions);
}

export function renderPieChart() {
  const active = state.subscriptions.filter(s => s.status === 'active');
  const byCat  = {};
  active.forEach(s => {
    const m = monthlyHKD(s);
    if (m === null) return;
    const k = s.category || '其他';
    byCat[k] = (byCat[k] || 0) + m;
  });

  const labels   = Object.keys(byCat);
  const data     = labels.map(k => byCat[k]);
  const colors   = labels.map(l => catColor(l));
  const pieEmpty = document.getElementById('pieEmpty');

  if (state.charts.pie) { state.charts.pie.destroy(); state.charts.pie = null; }

  if (labels.length === 0) {
    pieEmpty.classList.remove('hidden');
    return;
  }
  pieEmpty.classList.add('hidden');

  const { borderColor, labelColor } = getChartColors();

  state.charts.pie = new Chart(
    document.getElementById('pieChart').getContext('2d'),
    {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { size: 11 }, padding: 12, color: labelColor }
          },
          tooltip: {
            callbacks: { label: ctx => ` ${ctx.label}: ${fmtHKD(ctx.parsed)}/月` }
          }
        }
      }
    }
  );
}

export function renderTrendChart(subscriptions) {
  const monthlyData = calcLast6MonthsSpending(subscriptions);
  const ctx = document.getElementById('trendChart').getContext('2d');

  if (state.charts.trend) state.charts.trend.destroy();

  const { gridColor, tickColor } = getChartColors();

  state.charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: monthlyData.map(m => m.label),
      datasets: [{
        label: '月支出 (HKD)',
        data: monthlyData.map(m => parseFloat(m.total.toFixed(2))),
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#4F46E5',
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `HK$${ctx.parsed.y.toFixed(2)}` } }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: val => `HK$${val}`, color: tickColor },
          grid: { color: gridColor }
        },
        x: { grid: { display: false }, ticks: { color: tickColor } }
      }
    }
  });
}
