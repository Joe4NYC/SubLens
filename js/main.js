import { state } from './config.js';
import { populateSelects, showModal, hideModal, showToast, syncRemoveLabels } from './ui.js';
import { loadData, loadAndDisplayRates } from './api.js';
import { renderCards, renderTrendChart, renderPieChart } from './render.js';
import { openAddModal, openEditModal, openRemoveModal, closeModal, saveSubscription, confirmRemove } from './modals.js';

// ── Initialization ────────────────────────────────────────────────
async function init() {
  populateSelects();
  await loadAndDisplayRates();
  await loadData();
}

// ── Filter Tabs ───────────────────────────────────────────────────
function setFilter(filter) {
  state.filter = filter;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const active = btn.dataset.filter === filter;
    btn.className = active
      ? 'tab-btn px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-indigo-600 text-white shadow-sm'
      : 'tab-btn px-4 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
  });
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
  renderTrendChart(state.subscriptions);
  renderPieChart();
});

// ── Event Listeners ───────────────────────────────────────────────
document.getElementById('subscriptionList').addEventListener('click', e => {
  const editBtn   = e.target.closest("[data-action='edit']");
  const removeBtn = e.target.closest("[data-action='remove']");
  if (editBtn)   openEditModal(editBtn.dataset.id);
  if (removeBtn) openRemoveModal(removeBtn.dataset.id);
});

document.getElementById('btnAdd').addEventListener('click', openAddModal);
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
  showToast('Token 已儲存', 'success');
  hideModal('tokenModalOverlay');
});

document.getElementById('btnTokenClear').addEventListener('click', () => {
  localStorage.removeItem('sublens_token');
  document.getElementById('tokenInput').value = '';
  showToast('Token 已清除', 'success');
  hideModal('tokenModalOverlay');
});

document.getElementById('tokenModalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('tokenModalOverlay')) hideModal('tokenModalOverlay');
});

setFilter('all');
init();
