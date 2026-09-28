/**
 * Promotion, Voucher & Discount Engine
 */

class PromotionsModule {
  render() {
    const promos = window.db.getTable('Promotions');

    return `
      <div class="animate-fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div>
            <h3>🎁 Pengurusan Promosi & Baucer</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Tetapkan kod baucer, Happy Hour, dan potongan harga automatik.</p>
          </div>
          <button class="btn btn-primary" onclick="window.promotionsModule.openModal()">
            ➕ Tambah Baucer Baharu
          </button>
        </div>

        <div class="modern-table-wrap glass-card">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Kod Promosi</th>
                <th>Tajuk / Penebusan</th>
                <th>Jenis Diskaun</th>
                <th>Nilai Diskaun</th>
                <th>Min Pembelian</th>
                <th>Sah Sehingga</th>
                <th>Status</th>
                <th style="text-align: right;">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              ${promos.map(p => `
                <tr>
                  <td><strong style="color: var(--primary); font-size: 1.05rem;">${p.code}</strong></td>
                  <td>${p.title}</td>
                  <td><span class="status-badge btn-secondary">${p.discountType}</span></td>
                  <td><strong>${p.discountType === 'Peratus' ? p.discountValue + '%' : 'RM ' + p.discountValue.toFixed(2)}</strong></td>
                  <td>RM ${(p.minSpend || 0).toFixed(2)}</td>
                  <td>${p.validUntil}</td>
                  <td><span class="status-badge badge-siap">${p.status}</span></td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm" onclick="window.promotionsModule.openModal('${p.id}')">✏️ Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="window.promotionsModule.deletePromo('${p.id}')">🗑️</button>
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
    const item = id ? window.db.getItem('Promotions', id) : null;

    const modalHtml = `
      <div id="prm-modal" class="modal-overlay glass-backdrop animate-fade-in">
        <div class="modal-card glass-card animate-pop" style="max-width: 500px;">
          <div class="modal-header">
            <h3>${item ? '✏️ Edit Baucer' : '➕ Tambah Baucer Baharu'}</h3>
            <button class="modal-close" onclick="document.getElementById('prm-modal').remove()">&times;</button>
          </div>
          <form onsubmit="window.promotionsModule.savePromo(event, '${item ? item.id : ''}')">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Kod Baucer *</label>
                <input type="text" id="fp-code" class="btn btn-secondary" style="width:100%; text-align:left; text-transform:uppercase;" required value="${item ? item.code : ''}" placeholder="Contoh: JIMAT10">
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Jenis Diskaun *</label>
                <select id="fp-type" class="btn btn-secondary" style="width:100%; text-align:left;" required>
                  <option value="Peratus" ${item && item.discountType === 'Peratus' ? 'selected' : ''}>Peratus (%)</option>
                  <option value="Tetap" ${item && item.discountType === 'Tetap' ? 'selected' : ''}>Nilai Tetap (RM)</option>
                </select>
              </div>
            </div>

            <div style="margin-bottom: 14px;">
              <label style="font-size: 0.85rem; font-weight: 600;">Tajuk Promosi *</label>
              <input type="text" id="fp-title" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${item ? item.title : ''}">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Nilai Diskaun *</label>
                <input type="number" step="0.10" id="fp-val" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${item ? item.discountValue : ''}">
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Min Spend (RM)</label>
                <input type="number" step="0.10" id="fp-min" class="btn btn-secondary" style="width:100%; text-align:left;" value="${item ? item.minSpend : 20}">
              </div>
            </div>

            <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:12px;">
              <button type="button" class="btn btn-secondary" onclick="document.getElementById('prm-modal').remove()">Batal</button>
              <button type="submit" class="btn btn-primary">Simpan Baucer</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  savePromo(e, id) {
    e.preventDefault();
    const payload = {
      code: document.getElementById('fp-code').value.trim().toUpperCase(),
      title: document.getElementById('fp-title').value.trim(),
      discountType: document.getElementById('fp-type').value,
      discountValue: parseFloat(document.getElementById('fp-val').value),
      minSpend: parseFloat(document.getElementById('fp-min').value) || 0,
      validUntil: '2026-12-31',
      status: 'Aktif'
    };

    if (id) {
      window.db.updateItem('Promotions', id, payload);
      window.toast.success('Promosi dikemaskini!');
    } else {
      window.db.addItem('Promotions', payload);
      window.toast.success('Promosi baharu ditambah!');
    }

    document.getElementById('prm-modal').remove();
    window.app.renderActiveView();
  }

  deletePromo(id) {
    const item = window.db.getItem('Promotions', id);
    window.toast.confirm(
      'Padam Baucer',
      `Adakah anda pasti untuk memadam baucer '${item ? item.code : id}'?`,
      () => {
        window.db.deleteItem('Promotions', id);
        window.toast.info('Baucer dipadam.');
        window.app.renderActiveView();
      }
    );
  }
}

const promotionsModule = new PromotionsModule();
window.promotionsModule = promotionsModule;
