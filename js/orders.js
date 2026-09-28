/**
 * Order Management & Pipeline Module
 */

class OrdersModule {
  constructor() {
    this.statusFilter = 'ALL';
    this.searchQuery = '';
  }

  render() {
    const orders = window.db.getTable('Orders');

    let filtered = orders.filter(o => {
      const matchStatus = this.statusFilter === 'ALL' || o.orderStatus === this.statusFilter;
      const matchSearch = o.orderNo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });

    const statusOptions = ['Baru', 'Diproses', 'Sedang Dimasak', 'Siap', 'Dalam Penghantaran', 'Selesai', 'Dibatalkan'];

    return `
      <div class="animate-fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div style="display: flex; gap: 12px; align-items: center; flex: 1; max-width: 550px;">
            <input type="text" class="btn btn-secondary" style="width:100%; text-align:left;" 
                   placeholder="🔍 Carian No Tempahan / Nama Pelanggan..." value="${this.searchQuery}"
                   oninput="window.ordersModule.handleSearch(this.value)">
            <select class="btn btn-secondary" onchange="window.ordersModule.handleStatusFilter(this.value)">
              <option value="ALL">Semua Status (${orders.length})</option>
              ${statusOptions.map(s => `<option value="${s}" ${this.statusFilter === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>

          <button class="btn btn-primary" onclick="window.state.setActiveTab('cart')">
            ➕ Tempahan Baru (POS)
          </button>
        </div>

        <div class="modern-table-wrap glass-card">
          <table class="modern-table">
            <thead>
              <tr>
                <th>No. Tempahan</th>
                <th>Tarikh / Masa</th>
                <th>Pelanggan</th>
                <th>Jenis</th>
                <th>Jumlah (RM)</th>
                <th>Bayaran</th>
                <th>Status Tempahan</th>
                <th style="text-align: right;">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length === 0 ? `
                <tr>
                  <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 40px;">
                    Tiada rekod tempahan ditemui.
                  </td>
                </tr>
              ` : filtered.map(o => `
                <tr>
                  <td><strong>${o.orderNo}</strong></td>
                  <td><small>${o.date}<br>${o.time}</small></td>
                  <td>
                    <div><strong>${o.customerName}</strong></div>
                    <small style="color: var(--text-muted);">${o.customerPhone}</small>
                  </td>
                  <td>
                    <span class="status-badge btn-secondary" style="font-size:0.75rem;">
                      ${o.orderType === 'Dine In' ? '🍽️ Meja ' + o.tableNo : o.orderType === 'Delivery' ? '🚚 Delivery' : '🥡 Take Away'}
                    </span>
                  </td>
                  <td><strong style="color: var(--primary);">RM ${(o.grandTotal || 0).toFixed(2)}</strong></td>
                  <td>
                    <span class="status-badge ${o.paymentStatus === 'Sudah Bayar' ? 'badge-siap' : 'badge-dibatalkan'}">
                      ${o.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <select class="btn btn-secondary btn-sm" style="font-weight: 700;" onchange="window.ordersModule.changeStatus('${o.id}', this.value)">
                      ${statusOptions.map(s => `<option value="${s}" ${o.orderStatus === s ? 'selected' : ''}>${s}</option>`).join('')}
                    </select>
                  </td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm" onclick="window.ordersModule.openViewModal('${o.id}')" title="Lihat Detail">👁️</button>
                    <button class="btn btn-primary btn-sm" onclick="window.receiptModule.openReceiptModal('${o.id}')" title="Cetak Resit">🧾 Resit</button>
                    <button class="btn btn-danger btn-sm" onclick="window.ordersModule.deleteOrder('${o.id}')" title="Padam">🗑️</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  handleSearch(query) {
    this.searchQuery = query;
    window.app.renderActiveView();
  }

  handleStatusFilter(status) {
    this.statusFilter = status;
    window.app.renderActiveView();
  }

  changeStatus(orderId, newStatus) {
    window.db.updateItem('Orders', orderId, { orderStatus: newStatus });
    window.toast.success(`Status tempahan dikemaskini kepada '${newStatus}'`);
    window.app.renderActiveView();
  }

  openViewModal(orderId) {
    const order = window.db.getItem('Orders', orderId);
    if (!order) return;

    const items = window.db.getTable('OrderItems').filter(i => i.orderId === orderId);

    const modalHtml = `
      <div id="order-view-modal" class="modal-overlay glass-backdrop animate-fade-in">
        <div class="modal-card glass-card animate-pop" style="max-width: 620px;">
          <div class="modal-header">
            <h3>📋 Detail Tempahan ${order.orderNo}</h3>
            <button class="modal-close" onclick="document.getElementById('order-view-modal').remove()">&times;</button>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; font-size: 0.9rem;">
            <div>
              <p><strong>Nama:</strong> ${order.customerName}</p>
              <p><strong>Telefon:</strong> ${order.customerPhone}</p>
              <p><strong>Jenis:</strong> ${order.orderType} ${order.tableNo ? '(Meja ' + order.tableNo + ')' : ''}</p>
            </div>
            <div>
              <p><strong>Tarikh/Masa:</strong> ${order.date} ${order.time}</p>
              <p><strong>Bayaran:</strong> ${order.paymentMethod} (${order.paymentStatus})</p>
              <p><strong>Status Tempahan:</strong> <span class="status-badge badge-siap">${order.orderStatus}</span></p>
            </div>
          </div>

          <h5 style="margin-bottom: 10px;">Senarai Item</h5>
          <table class="modern-table" style="margin-bottom: 20px;">
            <thead>
              <tr>
                <th>Menu</th>
                <th>Harga</th>
                <th>Qty</th>
                <th style="text-align: right;">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(i => `
                <tr>
                  <td>
                    <div><strong>${i.menuName}</strong></div>
                    ${i.notes ? `<small style="color: var(--warning);">📝 ${i.notes}</small>` : ''}
                  </td>
                  <td>RM ${i.price.toFixed(2)}</td>
                  <td>${i.quantity}</td>
                  <td style="text-align: right;">RM ${i.subtotal.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="text-align: right; font-size: 1.15rem; font-weight: 800; color: var(--primary); margin-bottom: 20px;">
            Grand Total: RM ${(order.grandTotal || 0).toFixed(2)}
          </div>

          <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:12px;">
            <button class="btn btn-secondary" onclick="document.getElementById('order-view-modal').remove()">Tutup</button>
            <button class="btn btn-primary" onclick="document.getElementById('order-view-modal').remove(); window.receiptModule.openReceiptModal('${order.id}')">🧾 Cetak Resit</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  deleteOrder(orderId) {
    const order = window.db.getItem('Orders', orderId);
    window.toast.confirm(
      'Padam Tempahan',
      `Adakah anda pasti untuk memadam tempahan '${order ? order.orderNo : orderId}'?`,
      () => {
        window.db.deleteItem('Orders', orderId);
        window.toast.info('Tempahan dipadam.');
        window.app.renderActiveView();
      }
    );
  }
}

const ordersModule = new OrdersModule();
window.ordersModule = ordersModule;
