// Constructs a Date clamped to the last day of the month, preventing JS Date
// rollover when day > month length (e.g. Jan 31 → Feb would become Mar 3).
export function clampDay(year, month, day) {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDay));
}

// Returns number of full billing cycles between start and end (inclusive of start month).
export function billingCyclesBetween(start, end, cycle) {
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

export function calcNextBillingDate(startDate, billingCycle) {
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

export function daysUntil(dateStr) {
  const target = new Date(dateStr);
  const today  = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export function toDateInputValue(dateStr) {
  if (!dateStr) return '';
  return String(dateStr).split('T')[0];
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const clean = String(dateStr).split('T')[0];
  if (!clean || clean === 'undefined') return '';
  const d = new Date(clean + 'T00:00:00');
  if (isNaN(d)) return clean;
  return d.toLocaleDateString('zh-HK', { year: 'numeric', month: 'long', day: 'numeric' });
}
