import { state } from './config.js';
import { toHKD } from './currency.js';
import { clampDay, billingCyclesBetween } from './dates.js';

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
    .filter(sub => sub.status === 'active' || sub.status === 'archived')
    .reduce((total, sub) => {
      const dateStr = String(sub.startDate).split('T')[0];
      const start   = new Date(dateStr + 'T00:00:00');
      if (isNaN(start.getTime())) return total;

      const endDateStr = sub.endDate ? String(sub.endDate).split('T')[0] : null;
      const end = (endDateStr && sub.status === 'archived')
        ? new Date(endDateStr + 'T00:00:00')
        : today;

      const cycles = billingCyclesBetween(start, end, sub.billingCycle);
      const amount = toHKD(sub.amount, sub.currency);
      if (amount === null) return total;
      return total + amount * cycles;
    }, 0);
}

export function calcLast6MonthsSpending(subscriptions) {
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months.push({
      year:  d.getFullYear(),
      month: d.getMonth(),
      label: `${d.getMonth() + 1}月`,
      total: 0
    });
  }

  subscriptions.forEach(sub => {
    if (!sub.startDate) return;
    const start     = new Date(String(sub.startDate).split('T')[0]);
    const end       = sub.endDate ? new Date(String(sub.endDate).split('T')[0]) : new Date();
    const amountHKD = toHKD(parseFloat(sub.amount) || 0, sub.currency);
    if (amountHKD === null) return;

    months.forEach(m => {
      const monthStart = new Date(m.year, m.month, 1);
      const monthEnd   = new Date(m.year, m.month + 1, 0);

      if (start > monthEnd || end < monthStart) return;

      if (sub.billingCycle === 'monthly') {
        const billingDay = clampDay(m.year, m.month, start.getDate());
        if (billingDay >= monthStart && billingDay <= monthEnd &&
            billingDay >= start && billingDay <= end) {
          m.total += amountHKD;
        }
      } else if (sub.billingCycle === 'yearly') {
        const billingDay = clampDay(m.year, start.getMonth(), start.getDate());
        if (billingDay.getMonth() === m.month &&
            billingDay.getFullYear() === m.year &&
            billingDay >= start && billingDay <= end) {
          m.total += amountHKD;
        }
      }
    });
  });

  return months;
}
