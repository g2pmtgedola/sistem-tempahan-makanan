/**
 * Customer Directory Management
 */

class CustomersModule {
  constructor() {
    this.searchQuery = '';
  }

  render() {
    const customers = window.db.getTable('Customers');

    let filtered = customers.filter(c => 
      c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    return `
      <div class="animate-fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div style="flex: 1; max-width: 450px;">
            <input type="text" class="btn btn-secondary" style="width:100%; text-align:left;" 
                   placeholder="🔍 Carian Nama / Telefon / Email Pelanggan..." value="${this.searchQuery}"
                   oninput="window.customersModule.handleSearch(this.value)">
          </div>

          <button class="btn btn-primary" onclick="window.customersModule.openModal()">
            ➕ Tambah Pelanggan
          </button>
        </div>

        <div class="modern-table-wrap glass-card">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Nama Pelanggan</th>
                <th>No. Telefon</th>
                <th>Email</th>
                <th>Jumlah Tempahan</th>
                <th>Jumlah Pembelian (RM)</th>
                <th>Tarikh Terakhir</th>
                <th style="text-align: right;">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(c => `
                <tr>
                  <td><strong>${c.name}</strong></td>
                  <td>${c.phone}</td>
                  <td>${c.email}</td>
                  <td><span class="status-badge badge-baru">${c.totalOrders || 0} pesanan</span></td>
                  <td><strong style="color: var(--success);">RM ${(c.totalSpent || 0).toFixed(2)}</strong></td>
                  <td>${c.lastOrderDate || '-'}</td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm" onclick="window.customersModule.openModal('${c.id}')">✏️ Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="window.customersModule.deleteCustomer('${c.id}')">🗑️</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  handleSearch(q) {
    this.searchQuery = q;
    window.app.renderActiveView();
  }

  openModal(id = null) {
    const item = id ? window.db.getItem('Customers', id) : null;

    const modalHtml = `
      <div id="cust-modal" class="modal-overlay glass-backdrop animate-fade-in">
        <div class="modal-card glass-card animate-pop" style="max-width: 480px;">
          <div class="modal-header">
            <h3>${item ? '✏️ Edit Pelanggan' : '➕ Tambah Pelanggan Baharu'}</h3>
            <button class="modal-close" onclick="document.getElementById('cust-modal').remove()">&times;</button>
          </div>
          <form onsubmit="window.customersModule.saveCustomer(event, '${item ? item.id : ''}')">
            <div style="margin-bottom: 14px;">
              <label style="font-size: 0.85rem; font-weight: 600;">Nama Pelanggan *</label>
              <input type="text" id="fc-cust-name" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${item ? item.name : ''}">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">No. Telefon *</label>
                <input type="tel" id="fc-cust-phone" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${item ? item.phone : ''}">
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Email *</label>
                <input type="email" id="fc-cust-email" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${item ? item.email : ''}">
              </div>
            </div>

            <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:12px;">
              <button type="button" class="btn btn-secondary" onclick="document.getElementById('cust-modal').remove()">Batal</button>
              <button type="submit" class="btn btn-primary">Simpan Pelanggan</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  saveCustomer(e, id) {
    e.preventDefault();
    const payload = {
      name: document.getElementById('fc-cust-name').value.trim(),
      phone: document.getElementById('fc-cust-phone').value.trim(),
      email: document.getElementById('fc-cust-email').value.trim(),
      totalOrders: 0,
      totalSpent: 0.0,
      lastOrderDate: new Date().toISOString().split('T')[0]
    };

    if (id) {
      window.db.updateItem('Customers', id, payload);
      window.toast.success('Rekod pelanggan dikemaskini!');
    } else {
      window.db.addItem('Customers', payload);
      window.toast.success('Pelanggan baharu berjaya ditambah!');
    }

    document.getElementById('cust-modal').remove();
    window.app.renderActiveView();
  }

  deleteCustomer(id) {
    const item = window.db.getItem('Customers', id);
    window.toast.confirm(
      'Padam Pelanggan',
      `Adakah anda pasti untuk memadam pelanggan '${item ? item.name : id}'?`,
      () => {
        window.db.deleteItem('Customers', id);
        window.toast.info('Pelanggan dipadam.');
        window.app.renderActiveView();
      }
    );
  }
}

const customersModule = new CustomersModule();
window.customersModule = customersModule;
