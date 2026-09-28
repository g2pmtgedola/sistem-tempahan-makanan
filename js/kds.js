/**
 * Kitchen Display System (KDS - Paparan Dapur)
 */

class KDSModule {
  render() {
    const orders = window.db.getTable('Orders').filter(o => 
      ['Baru', 'Diproses', 'Sedang Dimasak'].includes(o.orderStatus)
    );

    const allOrderItems = window.db.getTable('OrderItems');

    return `
      <div class="animate-fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div>
            <h3>👨‍🍳 Paparan Dapur (Kitchen Display System)</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Paparan masa nyata untuk Chef & Petugas Dapur.</p>
          </div>
          <button class="btn btn-secondary" onclick="window.app.renderActiveView()">
            🔄 Muat Semula Dapur
          </button>
        </div>

        <div class="kds-grid">
          ${orders.length === 0 ? `
            <div class="glass-card" style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--text-muted);">
              <div style="font-size: 3rem; margin-bottom: 12px;">👩‍🍳</div>
              <h3>Tiada Tempahan Menunggu di Dapur</h3>
              <p>Semua pesanan telah disiapkan!</p>
            </div>
          ` : orders.map(o => {
            const items = allOrderItems.filter(i => i.orderId === o.id);
            const isCooking = o.orderStatus === 'Sedang Dimasak';

            return `
              <div class="glass-card kds-card ${isCooking ? 'kds-dimasak' : ''}">
                <div class="kds-header">
                  <div>
                    <h4 style="font-size: 1.15rem; font-weight: 800;">${o.orderNo}</h4>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${o.orderType} ${o.tableNo ? '• Meja ' + o.tableNo : ''}</span>
                  </div>
                  <span class="status-badge ${isCooking ? 'badge-dimasak' : 'badge-baru'}">
                    ${o.orderStatus}
                  </span>
                </div>

                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">
                  ⏱️ Masa Pesanan: ${o.time}
                </div>

                <div style="margin-bottom: 16px;">
                  ${items.map(i => `
                    <div class="kds-item-row">
                      <div>
                        <strong>${i.quantity}x ${i.menuName}</strong>
                        ${i.notes ? `<div style="font-size: 0.8rem; color: var(--danger); font-weight: 700;">⚠️ ${i.notes}</div>` : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  ${!isCooking ? `
                    <button class="btn btn-warning btn-sm" style="grid-column: 1/-1;" 
                            onclick="window.kdsModule.updateKDSStatus('${o.id}', 'Sedang Dimasak')">
                      🔥 Mula Memasak
                    </button>
                  ` : `
                    <button class="btn btn-success btn-sm" style="grid-column: 1/-1;" 
                            onclick="window.kdsModule.updateKDSStatus('${o.id}', 'Siap')">
                      ✅ Siap & Hantar
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  updateKDSStatus(orderId, newStatus) {
    window.db.updateItem('Orders', orderId, { orderStatus: newStatus });
    window.toast.success(`Pesanan dikemaskini kepada '${newStatus}'`);
    window.app.renderActiveView();
  }
}

const kdsModule = new KDSModule();
window.kdsModule = kdsModule;
