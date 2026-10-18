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
  removingId: null
};

export const CURRENCY_FLAGS = {
  HKD: '🇭🇰',
  USD: '🇺🇸',
  CNY: '🇨🇳',
};

export const CATEGORIES = ['娛樂', '工作效率', '雲端儲存', 'AI工具', '其他'];
export const CURRENCIES  = Object.keys(CURRENCY_FLAGS);

// Muted statement inks; none may sit near debit red or bank green, which carry meaning.
export const CAT_COLORS = {
  '娛樂':    '#7B5EA7',
  '工作效率': '#4A8291',
  '雲端儲存': '#3D6FA8',
  'AI工具':  '#C08A1E',
  '其他':    '#8C92A0'
};

export function getToken() {
  return localStorage.getItem('sublens_token') || '';
}
