/**
 * Toast Notification & Modal Confirmation Engine
 */

class ToastManager {
  constructor() {
    this.createContainer();
  }

  createContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    this.container = container;
  }

  show(message, type = 'info', title = '', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} glass-card animate-slide-in`;

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: '🔔'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || '🔔'}</div>
      <div class="toast-body">
        ${title ? `<strong class="toast-title">${title}</strong>` : ''}
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  success(msg, title = 'Berjaya!') {
    this.show(msg, 'success', title);
  }

  error(msg, title = 'Ralat!') {
    this.show(msg, 'error', title, 5000);
  }

  warning(msg, title = 'Amaran!') {
    this.show(msg, 'warning', title);
  }

  info(msg, title = 'Makluman') {
    this.show(msg, 'info', title);
  }

  confirm(title, message, onConfirm, confirmText = 'Padam', cancelText = 'Batal', type = 'danger') {
    let modalOverlay = document.getElementById('global-confirm-modal');
    if (modalOverlay) modalOverlay.remove();

    modalOverlay = document.createElement('div');
    modalOverlay.id = 'global-confirm-modal';
    modalOverlay.className = 'modal-overlay glass-backdrop animate-fade-in';

    modalOverlay.innerHTML = `
      <div class="modal-card glass-card animate-pop">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span class="modal-icon">${type === 'danger' ? '⚠️' : '❓'}</span>
            <h3>${title}</h3>
          </div>
          <button class="modal-close" id="btn-modal-close-x">&times;</button>
        </div>
        <div class="modal-body">
          <p>${message}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="btn-modal-cancel">${cancelText}</button>
          <button class="btn btn-${type}" id="btn-modal-confirm">${confirmText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    const closeModal = () => modalOverlay.remove();

    document.getElementById('btn-modal-close-x').onclick = closeModal;
    document.getElementById('btn-modal-cancel').onclick = closeModal;
    document.getElementById('btn-modal-confirm').onclick = () => {
      closeModal();
      if (typeof onConfirm === 'function') onConfirm();
    };
  }
}

const toast = new ToastManager();
window.toast = toast;
