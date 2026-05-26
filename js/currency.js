import { CONFIG, CURRENCY_FLAGS } from './config.js';

// Returns HKD amount, or null if the currency rate is unknown (avoids 1:1 silent error).
export function toHKD(amount, currency) {
  const num = Number(amount) || 0;
  if (currency === 'HKD') return num;
  const rate = CONFIG.RATES[`${currency}HKD`];
  if (!rate) return null;
  return num * rate;
}

export function fmtHKD(amount) {
  return 'HK$' + Number(amount).toFixed(2);
}

export function formatAmount(amount, currency) {
  const num  = parseFloat(amount) || 0;
  const flag = CURRENCY_FLAGS[currency] ?? '';
  const original = `${flag} ${currency} ${num.toFixed(2)}`.trim();
  if (currency === 'HKD') return original;
  const hkd = toHKD(num, currency);
  if (hkd === null) return original;
  return `${original} <span class="text-gray-400 dark:text-gray-500 text-sm font-normal">(≈ 🇭🇰 HK$${hkd.toFixed(2)})</span>`;
}
