/**
 * Food Category Management Module
 */

class CategoryModule {
  render() {
    const categories = window.db.getTable('Categories');

    return `
      <div class="animate-fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h3>📋 Senarai Kategori Makanan</h3>
          <button class="btn btn-primary" onclick="window.categoryModule.openModal()">
            ➕ Tambah Kategori
          </button>
        </div>

        <div class="modern-table-wrap glass-card">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Ikon</th>
                <th>Kod</th>
                <th>Nama Kategori</th>
                <th>Status</th>
                <th style="text-align: right;">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              ${categories.map(c => `
                <tr>
                  <td style="font-size: 1.4rem;">${c.icon}</td>
                  <td><strong>${c.code}</strong></td>
                  <td>${c.name}</td>
                  <td><span class="status-badge badge-siap">${c.status || 'aktif'}</span></td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm" onclick="window.categoryModule.openModal('${c.id}')">✏️ Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="window.categoryModule.deleteCategory('${c.id}')">🗑️</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  openModal(catId = null) {
    const item = catId ? window.db.getItem('Categories', catId) : null;

    const modalHtml = `
      <div id="cat-form-modal" class="modal-overlay glass-backdrop animate-fade-in">
        <div class="modal-card glass-card animate-pop" style="max-width:440px;">
          <div class="modal-header">
            <h3>${item ? '✏️ Edit Kategori' : '➕ Tambah Kategori Baharu'}</h3>
            <button class="modal-close" onclick="document.getElementById('cat-form-modal').remove()">&times;</button>
          </div>
          <form id="cat-crud-form" onsubmit="window.categoryModule.saveCategory(event, '${item ? item.id : ''}')">
            <div style="margin-bottom: 14px;">
              <label style="font-size: 0.85rem; font-weight: 600;">Kod Kategori *</label>
              <input type="text" id="fc-code" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${item ? item.code : 'CAT-' + Math.floor(10+Math.random()*90)}">
            </div>

            <div style="margin-bottom: 14px;">
              <label style="font-size: 0.85rem; font-weight: 600;">Nama Kategori *</label>
              <input type="text" id="fc-name" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${item ? item.name : ''}">
            </div>

            <div style="margin-bottom: 20px;">
              <label style="font-size: 0.85rem; font-weight: 600;">Ikon Emoji *</label>
              <input type="text" id="fc-icon" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${item ? item.icon : '🍛'}">
            </div>

            <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:12px;">
              <button type="button" class="btn btn-secondary" onclick="document.getElementById('cat-form-modal').remove()">Batal</button>
              <button type="submit" class="btn btn-primary">Simpan Kategori</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  saveCategory(e, id) {
    e.preventDefault();
    const payload = {
      code: document.getElementById('fc-code').value.trim().toUpperCase(),
      name: document.getElementById('fc-name').value.trim(),
      icon: document.getElementById('fc-icon').value.trim(),
      status: 'aktif'
    };

    if (id) {
      window.db.updateItem('Categories', id, payload);
      window.toast.success('Kategori berjaya dikemaskini!');
    } else {
      window.db.addItem('Categories', payload);
      window.toast.success('Kategori baharu berjaya ditambah!');
    }

    document.getElementById('cat-form-modal').remove();
    window.app.renderActiveView();
  }

  deleteCategory(id) {
    const item = window.db.getItem('Categories', id);
    window.toast.confirm(
      'Padam Kategori',
      `Adakah anda pasti untuk memadam kategori '${item ? item.name : id}'?`,
      () => {
        window.db.deleteItem('Categories', id);
        window.toast.info('Kategori dipadam.');
        window.app.renderActiveView();
      }
    );
  }
}

const categoryModule = new CategoryModule();
window.categoryModule = categoryModule;
