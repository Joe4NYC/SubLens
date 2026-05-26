export const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbx3Qcm7zEpFvIMFET95UrdohfF68UZ0riDM9ydATGjaf9QGE_wpEu5_uJbRvyNPzCnYPQ/exec",
  DEFAULT_CURRENCY: "HKD",
  RATES: {
    USDHKD: 7.78,  // fallback if API fails
    CNYHKD: 1.07
  }
};

export const state = {
  subscriptions: [],
  filter: 'all',
  editingId: null,
  removingId: null,
  charts: { pie: null, trend: null }
};

export const CURRENCY_FLAGS = {
  HKD: '🇭🇰',
  USD: '🇺🇸',
  CNY: '🇨🇳',
};

export const CATEGORIES = ['娛樂', '工作效率', '雲端儲存', 'AI工具', '其他'];
export const CURRENCIES  = Object.keys(CURRENCY_FLAGS);

export const CAT_COLORS = {
  '娛樂':    '#6366f1',
  '工作效率': '#22c55e',
  '雲端儲存': '#3b82f6',
  'AI工具':  '#f59e0b',
  '其他':    '#a855f7'
};

export function getToken() {
  return localStorage.getItem('sublens_token') || '';
}
