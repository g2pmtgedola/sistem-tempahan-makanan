/**
 * Staff & Role Privilege Management
 */

class StaffModule {
  render() {
    const staffList = window.db.getTable('Staff');

    return `
      <div class="animate-fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div>
            <h3>👨‍🍳 Pengurusan Staff Restoran</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Pentadbiran peranan (Admin, Cashier, Chef) & kebenaran sistem.</p>
          </div>
          <button class="btn btn-primary" onclick="window.staffModule.openModal()">
            ➕ Tambah Staff Baharu
          </button>
        </div>

        <div class="modern-table-wrap glass-card">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Nama Staff</th>
                <th>Peranan</th>
                <th>No. Telefon</th>
                <th>Email</th>
                <th>Tarikh Sertai</th>
                <th>Status</th>
                <th style="text-align: right;">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              ${staffList.map(s => `
                <tr>
                  <td><strong>${s.name}</strong></td>
                  <td>
                    <span class="status-badge ${s.role === 'Admin' ? 'badge-baru' : s.role === 'Chef' ? 'badge-dimasak' : 'badge-diproses'}">
                      ${s.role}
                    </span>
                  </td>
                  <td>${s.phone}</td>
                  <td>${s.email}</td>
                  <td>${s.joinedDate}</td>
                  <td><span class="status-badge badge-siap">${s.status}</span></td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm" onclick="window.staffModule.resetPassword('${s.id}')">🔑 Reset Pass</button>
                    <button class="btn btn-secondary btn-sm" onclick="window.staffModule.openModal('${s.id}')">✏️ Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="window.staffModule.deleteStaff('${s.id}')">🗑️</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  openModal(id = null) {
    const item = id ? window.db.getItem('Staff', id) : null;

    const modalHtml = `
      <div id="stf-modal" class="modal-overlay glass-backdrop animate-fade-in">
        <div class="modal-card glass-card animate-pop" style="max-width: 500px;">
          <div class="modal-header">
            <h3>${item ? '✏️ Edit Staff' : '➕ Tambah Staff Baharu'}</h3>
            <button class="modal-close" onclick="document.getElementById('stf-modal').remove()">&times;</button>
          </div>
          <form onsubmit="window.staffModule.saveStaff(event, '${item ? item.id : ''}')">
            <div style="margin-bottom: 14px;">
              <label style="font-size: 0.85rem; font-weight: 600;">Nama Staff *</label>
              <input type="text" id="fs-name" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${item ? item.name : ''}">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Peranan *</label>
                <select id="fs-role" class="btn btn-secondary" style="width:100%; text-align:left;" required>
                  <option value="Admin" ${item && item.role === 'Admin' ? 'selected' : ''}>Admin</option>
                  <option value="Cashier" ${item && item.role === 'Cashier' ? 'selected' : ''}>Cashier</option>
                  <option value="Chef" ${item && item.role === 'Chef' ? 'selected' : ''}>Chef</option>
                </select>
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">No. Telefon *</label>
                <input type="tel" id="fs-phone" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${item ? item.phone : ''}">
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <label style="font-size: 0.85rem; font-weight: 600;">Email Staff *</label>
              <input type="email" id="fs-email" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${item ? item.email : ''}">
            </div>

            <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:12px;">
              <button type="button" class="btn btn-secondary" onclick="document.getElementById('stf-modal').remove()">Batal</button>
              <button type="submit" class="btn btn-primary">Simpan Rekod</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  saveStaff(e, id) {
    e.preventDefault();
    const payload = {
      name: document.getElementById('fs-name').value.trim(),
      role: document.getElementById('fs-role').value,
      phone: document.getElementById('fs-phone').value.trim(),
      email: document.getElementById('fs-email').value.trim(),
      status: 'Aktif',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    if (id) {
      window.db.updateItem('Staff', id, payload);
      window.toast.success('Maklumat staff dikemaskini!');
    } else {
      window.db.addItem('Staff', payload);
      window.toast.success('Staff baharu mendaftar ke sistem!');
    }

    document.getElementById('stf-modal').remove();
    window.app.renderActiveView();
  }

  resetPassword(id) {
    const staff = window.db.getItem('Staff', id);
    window.toast.confirm(
      'Reset Password',
      `Adakah anda pasti untuk tetapkan semula kata laluan untuk '${staff ? staff.name : id}' kepada default 'password123'?`,
      () => {
        window.toast.success('Kata laluan berjaya di-reset ke "password123".');
      },
      'Reset Password',
      'Batal',
      'warning'
    );
  }

  deleteStaff(id) {
    const item = window.db.getItem('Staff', id);
    window.toast.confirm(
      'Padam Staff',
      `Adakah anda pasti untuk memadam staff '${item ? item.name : id}'?`,
      () => {
        window.db.deleteItem('Staff', id);
        window.toast.info('Rekod staff dipadam.');
        window.app.renderActiveView();
      }
    );
  }
}

const staffModule = new StaffModule();
window.staffModule = staffModule;
