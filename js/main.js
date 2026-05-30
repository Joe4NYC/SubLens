import { state } from './config.js';
import { populateSelects, showModal, hideModal, showToast, syncRemoveLabels } from './ui.js';
import { loadData, loadAndDisplayRates, isApiConfigured } from './api.js';
import { renderCards, renderRankingChart, renderPieChart, renderFilterTabs } from './render.js';
import { openAddModal, openEditModal, openRemoveModal, closeModal, saveSubscription, confirmRemove, pauseSubscription, resumeSubscription } from './modals.js';
import { isDemoMode, enterDemoMode, renderDemoBanner } from './demo.js';

// ── Initialization ────────────────────────────────────────────────
async function init() {
  // 未設定 API 且未在 Demo 模式 → 自動進入 Demo，讓用戶即時試用範例資料
  if (!isDemoMode() && !isApiConfigured()) {
    enterDemoMode(); // reloads the page
    return;
  }
  populateSelects();
  renderDemoBanner();
  await loadAndDisplayRates();
  await loadData();
}

// ── Filter Tabs ───────────────────────────────────────────────────
function setFilter(filter) {
  state.filter = filter;
  renderFilterTabs();
  renderCards();
}

// ── Dark Mode ─────────────────────────────────────────────────────
function applyDarkMode(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  document.getElementById('darkModeIcon').textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('sublens-darkmode', isDark ? '1' : '0');
}

const savedDark   = localStorage.getItem('sublens-darkmode');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyDarkMode(savedDark !== null ? savedDark === '1' : prefersDark);

document.getElementById('darkModeToggle').addEventListener('click', () => {
  applyDarkMode(!document.documentElement.classList.contains('dark'));
  renderRankingChart(state.subscriptions);
  renderPieChart();
});

// ── Event Listeners ───────────────────────────────────────────────
document.getElementById('subscriptionList').addEventListener('click', e => {
  const editBtn   = e.target.closest("[data-action='edit']");
  const removeBtn = e.target.closest("[data-action='remove']");
  const pauseBtn  = e.target.closest("[data-action='pause']");
  const resumeBtn = e.target.closest("[data-action='resume']");
  if (editBtn)   openEditModal(editBtn.dataset.id);
  if (removeBtn) openRemoveModal(removeBtn.dataset.id);
  if (pauseBtn)  pauseSubscription(pauseBtn.dataset.id);
  if (resumeBtn) resumeSubscription(resumeBtn.dataset.id);
});

document.getElementById('btnAdd').addEventListener('click', openAddModal);
document.getElementById('refreshRatesBtn').addEventListener('click', loadAndDisplayRates);
document.getElementById('btnCloseModal').addEventListener('click', closeModal);
document.getElementById('btnCancelModal').addEventListener('click', closeModal);
document.getElementById('subscriptionForm').addEventListener('submit', saveSubscription);
document.getElementById('btnCancelRemove').addEventListener('click', () => hideModal('removeModalOverlay'));
document.getElementById('btnConfirmRemove').addEventListener('click', confirmRemove);

document.querySelectorAll('.tab-btn').forEach(btn =>
  btn.addEventListener('click', () => setFilter(btn.dataset.filter))
);

document.querySelectorAll('input[name="removeMode"]').forEach(r =>
  r.addEventListener('change', syncRemoveLabels)
);

document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});
document.getElementById('removeModalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('removeModalOverlay')) hideModal('removeModalOverlay');
});

document.getElementById('btnTokenSettings').addEventListener('click', () => {
  document.getElementById('tokenInput').value = localStorage.getItem('sublens_token') || '';
  showModal('tokenModalOverlay');
});

document.getElementById('btnTokenSave').addEventListener('click', () => {
  const token = document.getElementById('tokenInput').value.trim();
  if (!token) { showToast('請輸入 Token', 'error'); return; }
  localStorage.setItem('sublens_token', token);
  localStorage.removeItem('sublens_demo'); // 退出 Demo 模式（如有），改用真實資料
  showToast('Token 已儲存，重新載入中…', 'success');
  hideModal('tokenModalOverlay');
  location.reload(); // 重新以新 Token 載入資料
});

document.getElementById('btnTokenDemo').addEventListener('click', enterDemoMode);

document.getElementById('btnTokenClear').addEventListener('click', () => {
  localStorage.removeItem('sublens_token');
  document.getElementById('tokenInput').value = '';
  showToast('Token 已清除，重新載入中…', 'success');
  hideModal('tokenModalOverlay');
  location.reload(); // 重新載入資料
});

document.getElementById('tokenModalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('tokenModalOverlay')) hideModal('tokenModalOverlay');
});

setFilter('all');
init();
