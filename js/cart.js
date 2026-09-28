/**
 * Shopping Cart & POS Module
 */

class CartModule {
  renderPOS() {
    const menus = window.db.getTable('Menus').filter(m => m.status === 'Tersedia');
    const categories = window.db.getTable('Categories');
    const cartItems = window.state.getCart();
    const totals = window.state.getCartTotals();

    return `
      <div class="animate-fade-in pos-layout">
        <!-- Left: Menu Selector -->
        <div>
          <!-- Categories Filter Bar -->
          <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px;">
            <button class="btn btn-primary btn-sm" onclick="window.menuModule.handleCatFilter('ALL')">Semua</button>
            ${categories.map(c => `
              <button class="btn btn-secondary btn-sm" onclick="window.menuModule.handleCatFilter('${c.id}')">
                ${c.icon} ${c.name}
              </button>
            `).join('')}
          </div>

          <div class="menu-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
            ${menus.map(item => `
              <div class="glass-card menu-card" style="cursor: pointer;" onclick="window.cartModule.openNotePrompt('${item.id}')">
                <div class="menu-img-wrap" style="height: 120px;">
                  <img src="${item.imageUrl}" alt="${item.name}">
                </div>
                <div class="menu-content" style="padding: 12px;">
                  <h5 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 4px;">${item.name}</h5>
                  <div class="menu-price-row">
                    <span class="price-main" style="font-size: 1rem;">RM ${(item.promoPrice > 0 ? item.promoPrice : item.price).toFixed(2)}</span>
                    <button class="btn btn-primary btn-sm" style="padding: 4px 8px;">+ Tambah</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: Cart & Checkout Panel -->
        <div class="glass-card cart-panel">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: var(--card-border); padding-bottom: 14px;">
            <h4>🛒 Troli Tempahan (${totals.itemCount})</h4>
            ${cartItems.length > 0 ? `<button class="btn btn-danger btn-sm" onclick="window.state.clearCart()">Kosongkan</button>` : ''}
          </div>

          <div class="cart-items-list">
            ${cartItems.length === 0 ? `
              <div style="text-align: center; color: var(--text-muted); margin: 40px 0;">
                <div style="font-size: 2.5rem; margin-bottom: 8px;">🛍️</div>
                <p>Troli anda masih kosong.</p>
                <small>Pilih menu dari panel untuk mula menambah.</small>
              </div>
            ` : cartItems.map(item => `
              <div class="cart-item">
                <img src="${item.imageUrl}" class="cart-item-img">
                <div class="cart-item-info">
                  <div class="cart-item-title">${item.name}</div>
                  ${item.notes ? `<small style="color: var(--warning); font-weight: 600;">📝 ${item.notes}</small>` : ''}
                  <div class="cart-item-price">RM ${item.subtotal.toFixed(2)}</div>
                </div>
                <div class="cart-qty-controls">
                  <button class="cart-qty-btn" onclick="window.state.updateCartQty('${item.id}', -1)">-</button>
                  <span style="font-weight: 700; font-size: 0.85rem;">${item.quantity}</span>
                  <button class="cart-qty-btn" onclick="window.state.updateCartQty('${item.id}', 1)">+</button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Totals Breakdown -->
          <div style="border-top: var(--card-border); padding-top: 14px; margin-top: auto;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.9rem;">
              <span>Subtotal:</span>
              <strong>RM ${totals.subtotal.toFixed(2)}</strong>
            </div>
            ${totals.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.9rem; color: var(--success);">
                <span>Diskaun:</span>
                <strong>- RM ${totals.discount.toFixed(2)}</strong>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.9rem;">
              <span>SST (6%):</span>
              <span>RM ${totals.sst.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 18px; font-size: 1.2rem; font-weight: 800; color: var(--primary);">
              <span>Jumlah Keseluruhan:</span>
              <span>RM ${totals.grandTotal.toFixed(2)}</span>
            </div>

            <button class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 1.05rem;" 
                    ${cartItems.length === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : 'onclick="window.checkoutModule.openModal()"'} >
              🚀 Halaman Pembayaran (Checkout)
            </button>
          </div>
        </div>
      </div>
    `;
  }

  openNotePrompt(menuId) {
    const item = window.db.getItem('Menus', menuId);
    if (!item) return;

    const presetNotes = [
      'Kurang pedas', 'Pedas lebih', 'Tambah telur', 'Tak mahu bawang', 'Kurang ais', 'Ais asing', 'Sos asing'
    ];

    const modalHtml = `
      <div id="note-modal" class="modal-overlay glass-backdrop animate-fade-in">
        <div class="modal-card glass-card animate-pop" style="max-width:460px;">
          <div class="modal-header">
            <h3>📝 Nota Pelanggan - ${item.name}</h3>
            <button class="modal-close" onclick="document.getElementById('note-modal').remove()">&times;</button>
          </div>
          <div style="margin-bottom: 16px;">
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">Pilih nota popular atau taip nota tersendiri:</p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px;">
              ${presetNotes.map(n => `
                <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('custom-note-input').value = '${n}'">
                  ${n}
                </button>
              `).join('')}
            </div>
            <input type="text" id="custom-note-input" class="btn btn-secondary" style="width: 100%; text-align: left;" placeholder="Contoh: Kurang ais / Sambal asing...">
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <label style="font-weight: 600;">Kuantiti:</label>
            <div class="cart-qty-controls" style="padding: 4px 14px;">
              <button class="cart-qty-btn" onclick="let q = parseInt(document.getElementById('note-qty').innerText); if(q>1) document.getElementById('note-qty').innerText = q-1;">-</button>
              <span id="note-qty" style="font-weight: 800; font-size: 1rem; margin: 0 10px;">1</span>
              <button class="cart-qty-btn" onclick="let q = parseInt(document.getElementById('note-qty').innerText); document.getElementById('note-qty').innerText = q+1;">+</button>
            </div>
          </div>
          <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:12px;">
            <button class="btn btn-secondary" onclick="document.getElementById('note-modal').remove()">Batal</button>
            <button class="btn btn-primary" onclick="
              const qty = parseInt(document.getElementById('note-qty').innerText);
              const note = document.getElementById('custom-note-input').value.trim();
              window.state.addToCart(window.db.getItem('Menus', '${item.id}'), qty, note);
              document.getElementById('note-modal').remove();
            ">➕ Tambah Ke Cart</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
}

const cartModule = new CartModule();
window.cartModule = cartModule;
