/**
 * Menu Management & Customer Ordering View Module
 * Upgraded with Local File Upload (Base64 Reader), Live Image Preview & Preset Gallery.
 */

class MenuModule {
  constructor() {
    this.selectedCatId = 'ALL';
    this.searchQuery = '';
  }

  // Render Admin Menu Management
  renderAdmin() {
    const menus = window.db.getTable('Menus');
    const categories = window.db.getTable('Categories');

    let filtered = menus.filter(m => {
      const matchCat = this.selectedCatId === 'ALL' || m.categoryId === this.selectedCatId;
      const matchSearch = m.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          m.code.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    return `
      <div class="animate-fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div style="display: flex; gap: 12px; align-items: center; flex: 1; max-width: 550px;">
            <input type="text" id="menu-search-input" class="btn btn-secondary" style="width: 100%; text-align: left;" 
                   placeholder="🔍 Carian Kod / Nama Menu..." value="${this.searchQuery}" 
                   oninput="window.menuModule.handleSearch(this.value)">
            <select class="btn btn-secondary" onchange="window.menuModule.handleCatFilter(this.value)">
              <option value="ALL">Semua Kategori</option>
              ${categories.map(c => `<option value="${c.id}" ${this.selectedCatId === c.id ? 'selected' : ''}>${c.icon} ${c.name}</option>`).join('')}
            </select>
          </div>
          <button class="btn btn-primary" onclick="window.menuModule.openModal()">
            ➕ Tambah Menu Baharu
          </button>
        </div>

        <div class="menu-grid">
          ${filtered.map(item => {
            const cat = categories.find(c => c.id === item.categoryId);
            return `
              <div class="glass-card menu-card">
                <div class="menu-img-wrap">
                  <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'">
                  <span class="menu-badge">${cat ? cat.name : 'Umum'}</span>
                </div>
                <div class="menu-content">
                  <span style="font-size: 0.75rem; color: var(--primary); font-weight: 700;">${item.code}</span>
                  <h4 class="menu-title">${item.name}</h4>
                  <p class="menu-desc">${item.description}</p>
                  <div class="menu-price-row">
                    <div class="price-box">
                      <span class="price-main">RM ${(item.promoPrice > 0 ? item.promoPrice : item.price).toFixed(2)}</span>
                      ${item.promoPrice > 0 ? `<span class="price-old">RM ${item.price.toFixed(2)}</span>` : ''}
                    </div>
                    <div style="display: flex; gap: 6px;">
                      <button class="btn btn-secondary btn-sm" onclick="window.menuModule.openModal('${item.id}')">✏️ Edit</button>
                      <button class="btn btn-danger btn-sm" onclick="window.menuModule.deleteMenu('${item.id}')">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Render Customer Ordering Menu Grid
  renderCustomer() {
    const menus = window.db.getTable('Menus').filter(m => m.status === 'Tersedia');
    const categories = window.db.getTable('Categories');

    let filtered = menus.filter(m => {
      const matchCat = this.selectedCatId === 'ALL' || m.categoryId === this.selectedCatId;
      const matchSearch = m.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    return `
      <div class="animate-fade-in">
        <!-- Category Filter Pills -->
        <div style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 24px;">
          <button class="btn ${this.selectedCatId === 'ALL' ? 'btn-primary' : 'btn-secondary'}" 
                  onclick="window.menuModule.handleCatFilter('ALL')">
            ✨ Semua (${menus.length})
          </button>
          ${categories.map(c => `
            <button class="btn ${this.selectedCatId === c.id ? 'btn-primary' : 'btn-secondary'}" 
                    onclick="window.menuModule.handleCatFilter('${c.id}')">
              ${c.icon} ${c.name}
            </button>
          `).join('')}
        </div>

        <div class="menu-grid">
          ${filtered.map(item => `
            <div class="glass-card menu-card animate-pop">
              <div class="menu-img-wrap">
                <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'">
                <span class="menu-badge">⭐ ${item.rating || 4.8}</span>
              </div>
              <div class="menu-content">
                <h4 class="menu-title">${item.name}</h4>
                <p class="menu-desc">${item.description}</p>
                <div class="menu-price-row">
                  <div class="price-box">
                    <span class="price-main">RM ${(item.promoPrice > 0 ? item.promoPrice : item.price).toFixed(2)}</span>
                    ${item.promoPrice > 0 ? `<span class="price-old">RM ${item.price.toFixed(2)}</span>` : ''}
                  </div>
                  <button class="btn btn-primary btn-sm" onclick="window.cartModule.openNotePrompt('${item.id}')">
                    🛒 Tambah
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  handleSearch(query) {
    this.searchQuery = query;
    window.app.renderActiveView();
  }

  handleCatFilter(catId) {
    this.selectedCatId = catId;
    window.app.renderActiveView();
  }

  openModal(menuId = null) {
    const item = menuId ? window.db.getItem('Menus', menuId) : null;
    const categories = window.db.getTable('Categories');

    const defaultImg = item ? item.imageUrl : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';

    const presets = [
      { name: 'Nasi Lemak', url: 'https://images.unsplash.com/photo-1626509653294-233416d77c2a?w=600&auto=format&fit=crop&q=80' },
      { name: 'Nasi Goreng', url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80' },
      { name: 'Char Kuey Teow', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80' },
      { name: 'Chicken Chop', url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80' },
      { name: 'Ribeye Steak', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80' },
      { name: 'Cendol Durian', url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80' },
      { name: 'Teh Tarik', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80' },
      { name: 'Jus Mangga', url: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80' }
    ];

    const modalHtml = `
      <div id="menu-form-modal" class="modal-overlay glass-backdrop animate-fade-in">
        <div class="modal-card glass-card animate-pop" style="max-width: 620px;">
          <div class="modal-header">
            <h3>${item ? '✏️ Edit Menu & Tukar Gambar' : '➕ Tambah Menu Baharu'}</h3>
            <button class="modal-close" onclick="document.getElementById('menu-form-modal').remove()">&times;</button>
          </div>
          <form id="menu-crud-form" onsubmit="window.menuModule.saveMenu(event, '${item ? item.id : ''}')">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Kod Menu *</label>
                <input type="text" id="f-code" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${item ? item.code : 'MNU-' + Math.floor(100+Math.random()*900)}">
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Kategori *</label>
                <select id="f-category" class="btn btn-secondary" style="width:100%; text-align:left;" required>
                  ${categories.map(c => `<option value="${c.id}" ${item && item.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <div style="margin-bottom: 14px;">
              <label style="font-size: 0.85rem; font-weight: 600;">Nama Menu *</label>
              <input type="text" id="f-name" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${item ? item.name : ''}">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 14px;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Harga (RM) *</label>
                <input type="number" step="0.10" id="f-price" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${item ? item.price : ''}">
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Harga Promosi (RM)</label>
                <input type="number" step="0.10" id="f-promoPrice" class="btn btn-secondary" style="width:100%; text-align:left;" value="${item ? item.promoPrice || '' : ''}">
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Masa Penyediaan (Minit)</label>
                <input type="number" id="f-prepTime" class="btn btn-secondary" style="width:100%; text-align:left;" value="${item ? item.prepTimeMinutes : 12}">
              </div>
            </div>

            <!-- Image Upload & Preview Section -->
            <div style="background: rgba(15,23,42,0.03); border: var(--card-border); padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px;">
              <label style="font-size: 0.9rem; font-weight: 700; color: var(--primary); margin-bottom: 8px; display: block;">
                🖼️ Gambar Menu (Upload / URL / Preset)
              </label>

              <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center; margin-bottom: 12px;">
                <!-- Live Image Preview Box -->
                <div style="width: 120px; height: 100px; border-radius: 10px; overflow: hidden; border: 2px dashed var(--primary); background: #000; position: relative;">
                  <img id="f-image-preview" src="${defaultImg}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'">
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                  <div>
                    <label style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">1. Muat Naik Fail Gambar Dari Komputer/Telefon:</label>
                    <input type="file" id="f-image-file" accept="image/*" class="btn btn-secondary" style="width: 100%; text-align: left; padding: 6px; font-size: 0.8rem;">
                  </div>
                  <div>
                    <label style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">2. Atau Masukkan URL Gambar Web:</label>
                    <input type="text" id="f-image" class="btn btn-secondary" style="width: 100%; text-align: left; font-size: 0.82rem;" value="${defaultImg}" placeholder="https://...">
                  </div>
                </div>
              </div>

              <!-- Preset Sample Images -->
              <div>
                <label style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">3. Atau Pilih Dari Galeri Preset Gambar:</label>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                  ${presets.map(p => `
                    <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 4px 8px;" 
                            onclick="window.menuModule.applyPresetImage('${p.url}')">
                      🖼️ ${p.name}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <label style="font-size: 0.85rem; font-weight: 600;">Penerangan *</label>
              <textarea id="f-desc" class="btn btn-secondary" style="width:100%; text-align:left; height: 80px;" required>${item ? item.description : ''}</textarea>
            </div>

            <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:12px;">
              <button type="button" class="btn btn-secondary" onclick="document.getElementById('menu-form-modal').remove()">Batal</button>
              <button type="submit" class="btn btn-primary">💾 Simpan Menu</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Setup Local File Upload listener (FileReader converts to Base64 Data URL)
    const fileInput = document.getElementById('f-image-file');
    const urlInput = document.getElementById('f-image');
    const previewImg = document.getElementById('f-image-preview');

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          window.toast.warning('Saiz gambar terlalu besar (Maksimum 5MB)');
          return;
        }
        const reader = new FileReader();
        reader.onload = function(evt) {
          const dataUrl = evt.target.result;
          urlInput.value = dataUrl;
          previewImg.src = dataUrl;
          window.toast.info('Gambar tempatan berjaya di-muat naik!');
        };
        reader.readAsDataURL(file);
      }
    });

    urlInput.addEventListener('input', (e) => {
      previewImg.src = e.target.value.trim();
    });
  }

  applyPresetImage(url) {
    const urlInput = document.getElementById('f-image');
    const previewImg = document.getElementById('f-image-preview');
    if (urlInput && previewImg) {
      urlInput.value = url;
      previewImg.src = url;
    }
  }

  saveMenu(e, id) {
    e.preventDefault();
    const payload = {
      code: document.getElementById('f-code').value.trim(),
      name: document.getElementById('f-name').value.trim(),
      categoryId: document.getElementById('f-category').value,
      price: parseFloat(document.getElementById('f-price').value),
      promoPrice: parseFloat(document.getElementById('f-promoPrice').value) || 0,
      prepTimeMinutes: parseInt(document.getElementById('f-prepTime').value) || 10,
      imageUrl: document.getElementById('f-image').value.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      description: document.getElementById('f-desc').value.trim(),
      status: 'Tersedia',
      rating: 4.8
    };

    if (id) {
      window.db.updateItem('Menus', id, payload);
      window.toast.success('Menu & gambar berjaya dikemaskini!');
    } else {
      window.db.addItem('Menus', payload);
      window.toast.success('Menu baharu berjaya ditambah!');
    }

    document.getElementById('menu-form-modal').remove();
    window.app.renderActiveView();
  }

  deleteMenu(id) {
    const item = window.db.getItem('Menus', id);
    window.toast.confirm(
      'Padam Menu',
      `Adakah anda pasti untuk memadam menu '${item ? item.name : id}'?`,
      () => {
        window.db.deleteItem('Menus', id);
        window.toast.info('Menu berjaya dipadam.');
        window.app.renderActiveView();
      }
    );
  }
}

const menuModule = new MenuModule();
window.menuModule = menuModule;
