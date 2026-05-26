import { CONFIG, state, getToken } from './config.js';
import { showToast, showModal } from './ui.js';
import { renderAll } from './render.js';

let spinnerDepth = 0;

// All requests use GET to avoid CORS preflight.
// Write operations encode their payload as ?data=<JSON string>.
export async function apiFetch(action, data = null) {
  spinnerDepth++;
  document.getElementById('apiSpinner').classList.remove('hidden');
  try {
    let url = `${CONFIG.API_URL}?action=${encodeURIComponent(action)}`;
    const token = getToken();
    if (token) url += `&token=${encodeURIComponent(token)}`;
    if (data !== null) {
      url += `&data=${encodeURIComponent(JSON.stringify(data))}`;
    }
    const response = await fetch(url, { redirect: 'follow' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    if (result && result.error === 'unauthorized') {
      showToast('存取被拒絕，請更新 API Token', 'error');
      showModal('tokenModalOverlay');
      return null;
    }
    if (result && result.error) throw new Error(result.error);
    return result;
  } catch (err) {
    showToast('錯誤：' + err.message, 'error');
    return null;
  } finally {
    spinnerDepth = Math.max(0, spinnerDepth - 1);
    if (spinnerDepth === 0) document.getElementById('apiSpinner').classList.add('hidden');
  }
}

export async function loadData() {
  if (CONFIG.API_URL === 'https://script.google.com/macros/library/d/19jY9_w1DV4NgHSWRxxMnxLaksAru240q0QM0nGR3ED6nF9o_KbgwYemK/2') {
    showToast('請先在 CONFIG.API_URL 填入 Apps Script 網址', 'error');
    document.getElementById('loadingOverlay').style.display = 'none';
    renderAll();
    return;
  }
  const subs = await apiFetch('getSubscriptions');
  state.subscriptions = Array.isArray(subs) ? subs : [];
  renderAll();
  document.getElementById('loadingOverlay').style.display = 'none';
}

export async function loadAndDisplayRates() {
  ['rateUSD', 'rateCNY', 'rateEUR'].forEach(id => {
    document.getElementById(id).textContent = '...';
  });

  try {
    const rates = await apiFetch('getRates');
    if (!rates) return; // error already shown by apiFetch; keep fallback rates

    Object.keys(rates).forEach(key => { if (rates[key]) CONFIG.RATES[key] = rates[key]; });

    document.getElementById('rateUSD').textContent = rates.USDHKD ? rates.USDHKD.toFixed(4) : 'N/A';
    document.getElementById('rateCNY').textContent = rates.CNYHKD ? rates.CNYHKD.toFixed(4) : 'N/A';
    document.getElementById('rateEUR').textContent = rates.EURHKD ? rates.EURHKD.toFixed(4) : 'N/A';

    const now = new Date();
    document.getElementById('ratesUpdatedAt').textContent =
      now.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' });

    renderAll();
    console.log('✅ Live rates loaded:', CONFIG.RATES);
  } catch (e) {
    ['rateUSD', 'rateCNY', 'rateEUR'].forEach(id => {
      document.getElementById(id).textContent = 'N/A';
    });
    document.getElementById('ratesUpdatedAt').textContent = '獲取失敗';
    console.warn('Failed to load rates, using fallback:', CONFIG.RATES);
  }
}
