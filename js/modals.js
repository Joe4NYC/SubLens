import { state, CONFIG, CATEGORIES, CURRENCIES } from './config.js';
import { calcNextBillingDate, todayISO, toDateInputValue } from './dates.js';
import { showToast, showModal, hideModal, syncRemoveLabels } from './ui.js';
import { apiFetch } from './api.js';
import { renderAll, renderAfterEdit, financialChanged } from './render.js';

const BILLING_CYCLES = ['monthly', 'yearly'];

function validateSubscription(data) {
  if (!data.name?.trim())
    return { ok: false, error: '請填寫訂閱名稱' };
  if (!data.startDate)
    return { ok: false, error: '請選擇開始日期' };
  if (data.startDate > new Date().toISOString().split('T')[0])
    return { ok: false, error: '開始日期不能是未來日期' };
  if (isNaN(data.amount) || data.amount <= 0)
    return { ok: false, error: '請輸入有效金額（大於 0）' };
  if (data.amount > 1_000_000)
    return { ok: false, error: '金額不能超過 1,000,000' };
  if (!CURRENCIES.includes(data.currency))
    return { ok: false, error: '請選擇有效的貨幣' };
  if (!BILLING_CYCLES.includes(data.billingCycle))
    return { ok: false, error: '請選擇有效的繳費週期' };
  if (!CATEGORIES.includes(data.category))
    return { ok: false, error: '請選擇有效的分類' };
  if ([...data.emoji].length > 4)
    return { ok: false, error: 'Emoji 不能超過 4 個字元' };
  return { ok: true };
}

export function openAddModal() {
  state.editingId = null;
  document.getElementById('modalTitle').textContent    = '新增訂閱';
  document.getElementById('subscriptionForm').reset();
  document.getElementById('fieldEmoji').value          = '📦';
  document.getElementById('fieldStartDate').value      = todayISO();
  document.getElementById('fieldCurrency').value       = CONFIG.DEFAULT_CURRENCY;
  document.getElementById('fieldEndDateWrapper').style.display = 'none';
  document.getElementById('fieldEndDate').value        = '';
  showModal('modalOverlay');
}

export function openEditModal(id) {
  const sub = state.subscriptions.find(s => String(s.id) === String(id));
  if (!sub) return;
  state.editingId = sub.id;
  document.getElementById('modalTitle').textContent        = '編輯訂閱';
  document.getElementById('fieldId').value                 = sub.id;
  document.getElementById('fieldName').value               = sub.name;
  document.getElementById('fieldCategory').value           = sub.category;
  document.getElementById('fieldEmoji').value              = sub.emoji || '📦';
  document.getElementById('fieldAmount').value             = sub.amount;
  document.getElementById('fieldCurrency').value           = sub.currency;
  document.getElementById('fieldBillingCycle').value       = sub.billingCycle;
  document.getElementById('fieldStartDate').value          = toDateInputValue(sub.startDate);
  document.getElementById('fieldNotes').value              = sub.notes || '';
  const endDateWrapper = document.getElementById('fieldEndDateWrapper');
  if (sub.status === 'archived') {
    endDateWrapper.style.display = 'block';
    document.getElementById('fieldEndDate').value = toDateInputValue(sub.endDate);
  } else {
    endDateWrapper.style.display = 'none';
    document.getElementById('fieldEndDate').value = '';
  }
  showModal('modalOverlay');
}

export function closeModal() {
  hideModal('modalOverlay');
}

export async function saveSubscription(e) {
  e.preventDefault();

  const billingCycle    = document.getElementById('fieldBillingCycle').value;
  const startDate       = document.getElementById('fieldStartDate').value;
  const nextBillingDate = calcNextBillingDate(startDate, billingCycle);

  const data = {
    name:           document.getElementById('fieldName').value.trim(),
    category:       document.getElementById('fieldCategory').value,
    emoji:          document.getElementById('fieldEmoji').value.trim() || '📦',
    billingCycle,
    amount:         parseFloat(document.getElementById('fieldAmount').value),
    currency:       document.getElementById('fieldCurrency').value,
    startDate,
    nextBillingDate,
    notes:          document.getElementById('fieldNotes').value.trim()
  };

  const endDateWrapper = document.getElementById('fieldEndDateWrapper');
  if (endDateWrapper && endDateWrapper.style.display !== 'none') {
    data.endDate = document.getElementById('fieldEndDate').value || '';
  }

  const validation = validateSubscription(data);
  if (!validation.ok) { showToast(validation.error, 'error'); return; }

  if (state.editingId) {
    data.id = state.editingId;
    const result = await apiFetch('updateSubscription', data);
    if (result === null) return;
    const idx = state.subscriptions.findIndex(s => String(s.id) === String(state.editingId));
    const needsChartRedraw = idx !== -1 && financialChanged(state.subscriptions[idx], data);
    if (idx !== -1) state.subscriptions[idx] = { ...state.subscriptions[idx], ...data };
    showToast('訂閱已更新', 'success');
    closeModal();
    renderAfterEdit(data.id, needsChartRedraw);
  } else {
    data.id     = crypto.randomUUID();
    data.status = 'active';
    const result = await apiFetch('addSubscription', data);
    if (result === null) return;
    state.subscriptions.push(data);
    showToast('訂閱已新增', 'success');
    closeModal();
    renderAll();
  }
}

export function openRemoveModal(id) {
  const sub = state.subscriptions.find(s => String(s.id) === String(id));
  if (!sub) return;
  state.removingId = sub.id;
  document.getElementById('removeModalName').textContent = `「${sub.name}」`;
  document.querySelectorAll('input[name="removeMode"]').forEach(r => {
    r.checked = r.value === 'archive';
  });
  document.getElementById('removeEndDate').value = todayISO();
  syncRemoveLabels();
  showModal('removeModalOverlay');
}

export async function pauseSubscription(id) {
  const sub = state.subscriptions.find(s => String(s.id) === String(id));
  if (!sub || sub.status !== 'active') return;
  const pausedDate = todayISO();
  const result = await apiFetch('updateSubscription', { id, status: 'paused', pausedDate });
  if (result === null) return;
  sub.status     = 'paused';
  sub.pausedDate = pausedDate;
  showToast('訂閱已暫停', 'success');
  renderAll();
}

export async function resumeSubscription(id) {
  const sub = state.subscriptions.find(s => String(s.id) === String(id));
  if (!sub || sub.status !== 'paused') return;
  const result = await apiFetch('updateSubscription', { id, status: 'active', pausedDate: '' });
  if (result === null) return;
  sub.status     = 'active';
  sub.pausedDate = '';
  showToast('訂閱已恢復', 'success');
  renderAll();
}

export async function confirmRemove() {
  const mode        = document.querySelector('input[name="removeMode"]:checked').value;
  const deleteBills = mode === 'delete';

  if (deleteBills) {
    const result = await apiFetch('deleteSubscription', { id: state.removingId, deleteBills: true });
    if (result === null) return;
    state.subscriptions = state.subscriptions.filter(s => String(s.id) !== String(state.removingId));
    showToast('訂閱已刪除', 'success');
  } else {
    const endDate = document.getElementById('removeEndDate').value || todayISO();
    const result  = await apiFetch('updateSubscription', { id: state.removingId, status: 'archived', endDate });
    if (result === null) return;
    const idx = state.subscriptions.findIndex(s => String(s.id) === String(state.removingId));
    if (idx !== -1) {
      state.subscriptions[idx].status  = 'archived';
      state.subscriptions[idx].endDate = endDate;
    }
    showToast('訂閱已封存', 'success');
  }
  hideModal('removeModalOverlay');
  renderAll();
}
