import { state } from './config.js';
import { toHKD } from './currency.js';
import { billingCyclesBetween } from './dates.js';

export function monthlyHKD(sub) {
  const hkd = toHKD(sub.amount, sub.currency);
  if (hkd === null) return null;
  return sub.billingCycle === 'yearly' ? hkd / 12 : hkd;
}

export function yearlyHKD(sub) {
  const hkd = toHKD(sub.amount, sub.currency);
  if (hkd === null) return null;
  return sub.billingCycle === 'monthly' ? hkd * 12 : hkd;
}

export function calcSummary() {
  const active = state.subscriptions.filter(s => s.status === 'active');
  const unknownCurrencies = new Set();
  let monthly = 0, yearly = 0;
  active.forEach(sub => {
    const m = monthlyHKD(sub);
    const y = yearlyHKD(sub);
    if (m === null) { unknownCurrencies.add(sub.currency); }
    else { monthly += m; yearly += y; }
  });
  return { monthly, yearly, cumulative: calcCumulative(state.subscriptions), unknownCurrencies };
}

export function calcCumulative(subscriptions) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return subscriptions
    .filter(sub => sub.status === 'active' || sub.status === 'archived' || sub.status === 'paused')
    .reduce((total, sub) => {
      const dateStr = String(sub.startDate).split('T')[0];
      const start   = new Date(dateStr + 'T00:00:00');
      if (isNaN(start.getTime())) return total;

      // Use pausedDate for paused subs, endDate for archived, today for active
      let endStr = null;
      if (sub.status === 'archived' && sub.endDate)    endStr = String(sub.endDate).split('T')[0];
      else if (sub.status === 'paused' && sub.pausedDate) endStr = String(sub.pausedDate).split('T')[0];
      const end = endStr ? new Date(endStr + 'T00:00:00') : today;

      const cycles = billingCyclesBetween(start, end, sub.billingCycle);
      const amount = toHKD(sub.amount, sub.currency);
      if (amount === null) return total;
      return total + amount * cycles;
    }, 0);
}

export function calcSpendingRanking(subscriptions) {
  return subscriptions
    .filter(s => s.status === 'active')
    .map(s => ({
      id: s.id,
      name: s.name,
      emoji: s.emoji || '📦',
      category: s.category || '其他',
      monthly: monthlyHKD(s)
    }))
    .filter(r => r.monthly !== null && r.monthly > 0)
    .sort((a, b) => b.monthly - a.monthly);
}

