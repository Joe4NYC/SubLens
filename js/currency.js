import { CONFIG } from './config.js';

// Returns HKD amount, or null if the currency rate is unknown (avoids 1:1 silent error).
export function toHKD(amount, currency) {
  const num = Number(amount) || 0;
  if (currency === 'HKD') return num;
  const rate = CONFIG.RATES[`${currency}HKD`];
  if (!rate) return null;
  return num * rate;
}

const NUM = new Intl.NumberFormat('en-HK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function fmtNum(amount) {
  return NUM.format(Number(amount) || 0);
}

export function fmtHKD(amount) {
  return 'HK$' + fmtNum(amount);
}
