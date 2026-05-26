import { CATEGORIES, CURRENCIES } from './config.js';

export function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast     = document.createElement('div');
  const bg        = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  toast.className = `${bg} text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg pointer-events-auto`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

export function showModal(id) {
  const overlay = document.getElementById(id);
  overlay._triggerEl = document.activeElement;
  overlay.classList.remove('hidden');
  overlay.classList.add('flex', 'modal-enter');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.querySelector('input:not([type=hidden]), button, select, textarea')?.focus();
  overlay._escHandler = e => { if (e.key === 'Escape') hideModal(id); };
  document.addEventListener('keydown', overlay._escHandler);
}

export function hideModal(id) {
  const overlay = document.getElementById(id);
  overlay.classList.add('hidden');
  overlay.classList.remove('flex', 'modal-enter');
  if (overlay._escHandler) {
    document.removeEventListener('keydown', overlay._escHandler);
    overlay._escHandler = null;
  }
  overlay._triggerEl?.focus();
}

export function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function populateSelects() {
  const catSel = document.getElementById('fieldCategory');
  catSel.innerHTML = '';
  CATEGORIES.forEach(c => {
    const o = document.createElement('option');
    o.value = o.textContent = c;
    catSel.appendChild(o);
  });
  const curSel = document.getElementById('fieldCurrency');
  curSel.innerHTML = '';
  CURRENCIES.forEach(c => {
    const o = document.createElement('option');
    o.value = o.textContent = c;
    curSel.appendChild(o);
  });
}

export function syncRemoveLabels() {
  const selected = document.querySelector('input[name="removeMode"]:checked')?.value;
  document.getElementById('labelDelete').className  = selected === 'delete'
    ? 'flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-indigo-200 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 transition-colors'
    : 'flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors';
  document.getElementById('labelArchive').className = selected === 'archive'
    ? 'flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-indigo-200 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 transition-colors'
    : 'flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors';
  document.getElementById('endDateField').style.display = selected === 'archive' ? 'block' : 'none';
}
