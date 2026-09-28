/**
 * Checkout & Payment Processing Module
 */

class CheckoutModule {
  constructor() {
    this.orderType = 'Dine In';
    this.paymentMethod = 'DuitNow QR';
  }

  openModal() {
    const totals = window.state.getCartTotals();
    if (totals.itemCount === 0) {
      window.toast.error('Troli anda kosong!');
      return;
    }

    const settings = window.db.getSettings();
    const currentUser = window.state.currentUser || {};

    const modalHtml = `
      <div id="checkout-modal" class="modal-overlay glass-backdrop animate-fade-in">
        <div class="modal-card glass-card animate-pop" style="max-width: 680px;">
          <div class="modal-header">
            <h3>💳 Halaman Pembayaran (Checkout)</h3>
            <button class="modal-close" onclick="document.getElementById('checkout-modal').remove()">&times;</button>
          </div>

          <form id="checkout-form" onsubmit="window.checkoutModule.processOrder(event)">
            <!-- Order Type Selector -->
            <div style="margin-bottom: 20px;">
              <label style="font-weight: 700; font-size: 0.9rem; margin-bottom: 8px; display: block;">Jenis Tempahan *</label>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                <button type="button" class="btn ${this.orderType === 'Dine In' ? 'btn-primary' : 'btn-secondary'}" 
                        onclick="window.checkoutModule.setOrderType('Dine In')">🍽️ Dine In</button>
                <button type="button" class="btn ${this.orderType === 'Take Away' ? 'btn-primary' : 'btn-secondary'}" 
                        onclick="window.checkoutModule.setOrderType('Take Away')">🥡 Take Away</button>
                <button type="button" class="btn ${this.orderType === 'Delivery' ? 'btn-primary' : 'btn-secondary'}" 
                        onclick="window.checkoutModule.setOrderType('Delivery')">🚚 Delivery</button>
              </div>
            </div>

            <!-- Customer Info Fields -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Nama Pelanggan *</label>
                <input type="text" id="chk-name" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${currentUser.name || 'Dato Ismail Sabri'}">
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">No. Telefon *</label>
                <input type="tel" id="chk-phone" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${currentUser.phone || '019-8877665'}">
              </div>
            </div>

            <!-- Dynamic Fields depending on Order Type -->
            <div id="dynamic-order-fields">
              ${this.renderDynamicFields(settings)}
            </div>

            <!-- Payment Method Selector -->
            <div style="margin-bottom: 20px;">
              <label style="font-weight: 700; font-size: 0.9rem; margin-bottom: 8px; display: block;">Kaedah Pembayaran *</label>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
                ${['DuitNow QR', 'Tunai', 'Kad Kredit', 'Kad Debit', 'Touch n Go', 'GrabPay', 'Online Banking'].map(m => `
                  <button type="button" class="btn ${this.paymentMethod === m ? 'btn-primary' : 'btn-secondary'} btn-sm" 
                          onclick="window.checkoutModule.setPaymentMethod('${m}')">
                    ${m === 'DuitNow QR' ? '📲' : m === 'Tunai' ? '💵' : m.includes('Kad') ? '💳' : '📱'} ${m}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- DuitNow QR Preview Box -->
            <div id="qr-preview-container" style="display: ${this.paymentMethod === 'DuitNow QR' ? 'block' : 'none'}; text-align: center; background: var(--primary-light); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
              <h5 style="color: var(--primary); margin-bottom: 6px;">📲 DuitNow QR Restoran</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">Imbas QR dibawah menggunakan aplikasi Perbankan atau E-Wallet anda.</p>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DuitNow-RasaNusantara-RM${totals.grandTotal.toFixed(2)}" style="border-radius: 8px; border: 3px solid var(--primary); padding: 4px; background: #fff;">
              <div style="font-size: 0.85rem; font-weight: 700; margin-top: 8px; color: var(--primary);">Jumlah: RM ${totals.grandTotal.toFixed(2)}</div>
            </div>

            <!-- Order Summary Header -->
            <div style="background: rgba(15,23,42,0.04); padding: 14px; border-radius: var(--radius-md); margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span>Subtotal:</span>
                <span>RM ${totals.subtotal.toFixed(2)}</span>
              </div>
              ${this.orderType === 'Delivery' ? `
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--warning);">
                  <span>Caj Delivery:</span>
                  <span>+ RM ${(settings.deliveryFee || 5).toFixed(2)}</span>
                </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span>SST (${settings.sstPercent}%):</span>
                <span>RM ${totals.sst.toFixed(2)}</span>
              </div>
              <hr style="margin: 8px 0; border: none; border-top: 1px dashed var(--card-border);">
              <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; color: var(--primary);">
                <span>Grand Total:</span>
                <span>RM ${(totals.grandTotal + (this.orderType === 'Delivery' ? (settings.deliveryFee || 5) : 0)).toFixed(2)}</span>
              </div>
            </div>

            <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:12px;">
              <button type="button" class="btn btn-secondary" onclick="document.getElementById('checkout-modal').remove()">Batal</button>
              <button type="submit" class="btn btn-primary" style="padding: 12px 24px;">
                ✅ Hantar & Bayar Tempahan
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  setOrderType(type) {
    this.orderType = type;
    const settings = window.db.getSettings();
    document.getElementById('dynamic-order-fields').innerHTML = this.renderDynamicFields(settings);
    // Refresh modal buttons state
    const buttons = document.querySelectorAll('#checkout-modal button');
    this.openModal();
    document.getElementById('checkout-modal').remove(); // replace smoothly
  }

  setPaymentMethod(method) {
    this.paymentMethod = method;
    const qrBox = document.getElementById('qr-preview-container');
    if (qrBox) {
      qrBox.style.display = method === 'DuitNow QR' ? 'block' : 'none';
    }
  }

  renderDynamicFields(settings) {
    if (this.orderType === 'Dine In') {
      return `
        <div style="margin-bottom: 14px;">
          <label style="font-size: 0.85rem; font-weight: 600;">Nombor Meja *</label>
          <select id="chk-table" class="btn btn-secondary" style="width:100%; text-align:left;" required>
            ${[1,2,3,4,5,6,7,8,9,10,11,12,15,20].map(n => `<option value="${n < 10 ? '0'+n : n}">Meja ${n}</option>`).join('')}
          </select>
        </div>
      `;
    } else if (this.orderType === 'Delivery') {
      return `
        <div style="margin-bottom: 14px;">
          <label style="font-size: 0.85rem; font-weight: 600;">Alamat Penghantaran *</label>
          <input type="text" id="chk-address" class="btn btn-secondary" style="width:100%; text-align:left;" required placeholder="No Rumah, Jalan, Taman / Menara" value="No 28, Jalan Ampang Utama">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px;">
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Bandar *</label>
            <input type="text" id="chk-city" class="btn btn-secondary" style="width:100%; text-align:left;" required value="Kuala Lumpur">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600;">Poskod *</label>
            <input type="text" id="chk-postcode" class="btn btn-secondary" style="width:100%; text-align:left;" required value="50450">
          </div>
        </div>
      `;
    }
    return '';
  }

  processOrder(e) {
    e.preventDefault();

    const totals = window.state.getCartTotals();
    const settings = window.db.getSettings();

    const deliveryFee = this.orderType === 'Delivery' ? (settings.deliveryFee || 5) : 0;
    const finalGrandTotal = totals.grandTotal + deliveryFee;

    const orderNo = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNo,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerId: 'cust-1',
      customerName: document.getElementById('chk-name').value.trim(),
      customerPhone: document.getElementById('chk-phone').value.trim(),
      orderType: this.orderType,
      tableNo: this.orderType === 'Dine In' ? document.getElementById('chk-table').value : '',
      address: this.orderType === 'Delivery' ? document.getElementById('chk-address').value : '',
      city: this.orderType === 'Delivery' ? document.getElementById('chk-city').value : '',
      postcode: this.orderType === 'Delivery' ? document.getElementById('chk-postcode').value : '',
      deliveryFee,
      subtotal: totals.subtotal,
      discount: totals.discount,
      sstAmount: totals.sst,
      grandTotal: finalGrandTotal,
      paymentMethod: this.paymentMethod,
      paymentStatus: 'Sudah Bayar',
      orderStatus: 'Baru',
      notes: 'Tempahan dibuat menerusi sistem web'
    };

    // Save Order
    window.db.addItem('Orders', newOrder);

    // Save OrderItems
    const cartItems = window.state.getCart();
    cartItems.forEach(ci => {
      window.db.addItem('OrderItems', {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        orderId: newOrder.id,
        menuId: ci.menuId,
        menuName: ci.name,
        price: ci.price,
        quantity: ci.quantity,
        subtotal: ci.subtotal,
        notes: ci.notes
      });
    });

    // Save Payment record
    window.db.addItem('Payments', {
      id: `pym-${Date.now()}`,
      orderId: newOrder.id,
      method: this.paymentMethod,
      status: 'Lulus',
      amount: finalGrandTotal,
      transactionRef: `${this.paymentMethod.substr(0, 3).toUpperCase()}-${Math.floor(100000+Math.random()*900000)}`,
      date: new Date().toLocaleString('sv-SE')
    });

    // Save Notification
    window.db.addNotification(
      'Tempahan Baru Received!',
      `Tempahan ${orderNo} (${this.orderType}) berjaya diterima dari ${newOrder.customerName}.`,
      'success'
    );

    // Clear Cart
    window.state.clearCart();

    document.getElementById('checkout-modal').remove();
    window.toast.success(`Tempahan ${orderNo} Berjaya Dicipta!`, 'Pembayaran Berjaya');

    // Trigger Receipt Modal directly
    if (window.receiptModule) {
      window.receiptModule.openReceiptModal(newOrder.id);
    }
  }
}

const checkoutModule = new CheckoutModule();
window.checkoutModule = checkoutModule;
