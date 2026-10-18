import { CATEGORIES, CURRENCIES } from './config.js';

export function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast     = document.createElement('div');
  toast.className = type === 'error' ? 'toast error' : 'toast';
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
  toast.append(message);
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
  document.getElementById('labelDelete').classList.toggle('is-selected', selected === 'delete');
  document.getElementById('labelArchive').classList.toggle('is-selected', selected === 'archive');
  document.getElementById('endDateField').style.display = selected === 'archive' ? '' : 'none';
  const confirm = document.getElementById('btnConfirmRemove');
  confirm.textContent = selected === 'delete' ? '永久刪除' : '確認封存';
  confirm.className   = selected === 'delete' ? 'btn btn-danger' : 'btn btn-primary';
}
