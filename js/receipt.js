/**
 * Professional Thermal & A4 Receipt Generator Engine
 * Customized with Politeknik METrO Tasek Gelugor Official Branding & Logo.
 */

class ReceiptModule {
  constructor() {
    this.currentFormat = 'a4'; // '58mm', '80mm', 'a4'
  }

  openReceiptModal(orderId) {
    const order = window.db.getItem('Orders', orderId);
    if (!order) return;

    const items = window.db.getTable('OrderItems').filter(i => i.orderId === orderId);
    const settings = window.db.getSettings();

    // Increment receipt print count
    let receipts = window.db.getTable('Receipts');
    let receipt = receipts.find(r => r.orderId === orderId);
    if (!receipt) {
      receipt = {
        id: `rcp-${Date.now()}`,
        receiptNo: `RCP-2026-${Math.floor(1000+Math.random()*9000)}`,
        orderId: orderId,
        date: new Date().toLocaleString('sv-SE'),
        printFormat: this.currentFormat,
        printedCount: 1
      };
      window.db.addItem('Receipts', receipt);
    } else {
      window.db.updateItem('Receipts', receipt.id, { printedCount: (receipt.printedCount || 1) + 1 });
    }

    const modalHtml = `
      <div id="receipt-modal" class="modal-overlay glass-backdrop animate-fade-in">
        <div class="modal-card glass-card animate-pop" style="max-width: 820px; width: 95%;">
          <div class="modal-header">
            <h3>🧾 Resit Rasmi - ${receipt.receiptNo}</h3>
            <button class="modal-close" onclick="document.getElementById('receipt-modal').remove()">&times;</button>
          </div>

          <!-- Format Chooser Toolbar -->
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--primary-light); padding: 12px 18px; border-radius: var(--radius-md); margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; gap: 8px; align-items: center;">
              <span style="font-weight: 700; font-size: 0.85rem;">Pilih Format Cetakan:</span>
              <button type="button" class="btn ${this.currentFormat === 'a4' ? 'btn-primary' : 'btn-secondary'} btn-sm" 
                      onclick="window.receiptModule.setFormat('${orderId}', 'a4')">📄 A4 Document</button>
              <button type="button" class="btn ${this.currentFormat === '80mm' ? 'btn-primary' : 'btn-secondary'} btn-sm" 
                      onclick="window.receiptModule.setFormat('${orderId}', '80mm')">🖨️ Thermal 80mm</button>
              <button type="button" class="btn ${this.currentFormat === '58mm' ? 'btn-primary' : 'btn-secondary'} btn-sm" 
                      onclick="window.receiptModule.setFormat('${orderId}', '58mm')">🖨️ Thermal 58mm</button>
            </div>

            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary btn-sm" onclick="window.receiptModule.downloadPDF('${receipt.receiptNo}')">
                📥 Muat Turun PDF
              </button>
              <button class="btn btn-primary btn-sm" onclick="window.receiptModule.printReceipt()">
                🖨️ Cetak Resit
              </button>
            </div>
          </div>

          <!-- Printable Area Container -->
          <div id="printable-receipt-area" class="receipt-preview-wrap">
            <div class="receipt-box format-${this.currentFormat}">
              <div class="receipt-header">
                <img src="${settings.logoUrl || 'assets/logo.png'}" class="receipt-logo-img" alt="Logo PMTG">
                <h2>${settings.name}</h2>
                <p>${settings.address}</p>
                <p>Tel: ${settings.phone} | Email: ${settings.email}</p>
              </div>

              <div class="receipt-meta">
                <div class="receipt-row">
                  <span>No. Resit:</span>
                  <strong>${receipt.receiptNo}</strong>
                </div>
                <div class="receipt-row">
                  <span>No. Tempahan:</span>
                  <strong>${order.orderNo}</strong>
                </div>
                <div class="receipt-row">
                  <span>Tarikh & Masa:</span>
                  <span>${order.date} ${order.time}</span>
                </div>
                <div class="receipt-row">
                  <span>Pelanggan:</span>
                  <span>${order.customerName} (${order.customerPhone})</span>
                </div>
                <div class="receipt-row">
                  <span>Jenis Tempahan:</span>
                  <strong>${order.orderType} ${order.tableNo ? '(Meja ' + order.tableNo + ')' : ''}</strong>
                </div>
              </div>

              <!-- Item Breakdown Table -->
              <table class="receipt-items-table">
                <thead>
                  <tr>
                    <th>Menu</th>
                    <th style="text-align:center;">Qty</th>
                    <th style="text-align:right;">Harga</th>
                    <th style="text-align:right;">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map(i => `
                    <tr>
                      <td>
                        ${i.menuName}
                        ${i.notes ? `<div style="font-size:0.8em; font-style:italic; color:#555;">* ${i.notes}</div>` : ''}
                      </td>
                      <td style="text-align:center;">${i.quantity}</td>
                      <td style="text-align:right;">${i.price.toFixed(2)}</td>
                      <td style="text-align:right;">${i.subtotal.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <!-- Totals Section -->
              <div class="receipt-totals">
                <div class="receipt-row">
                  <span>Subtotal:</span>
                  <span>RM ${order.subtotal.toFixed(2)}</span>
                </div>
                ${order.discount > 0 ? `
                  <div class="receipt-row">
                    <span>Diskaun:</span>
                    <span>- RM ${order.discount.toFixed(2)}</span>
                  </div>
                ` : ''}
                ${order.deliveryFee > 0 ? `
                  <div class="receipt-row">
                    <span>Caj Delivery:</span>
                    <span>+ RM ${order.deliveryFee.toFixed(2)}</span>
                  </div>
                ` : ''}
                ${order.sstAmount > 0 ? `
                  <div class="receipt-row">
                    <span>SST (${settings.sstPercent}%):</span>
                    <span>RM ${order.sstAmount.toFixed(2)}</span>
                  </div>
                ` : ''}
                <div class="receipt-row" style="font-size: 1.15em; font-weight: 800; border-top: 1px solid #000; padding-top: 4px; margin-top: 4px;">
                  <span>Grand Total:</span>
                  <span>RM ${order.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <!-- Payment Status Meta -->
              <div style="margin-top: 10px; border-top: 1px dashed #000; padding-top: 8px;">
                <div class="receipt-row">
                  <span>Kaedah Bayaran:</span>
                  <strong>${order.paymentMethod}</strong>
                </div>
                <div class="receipt-row">
                  <span>Status Bayaran:</span>
                  <strong>${order.paymentStatus}</strong>
                </div>
              </div>

              <div class="receipt-footer">
                <p><strong>TERIMA KASIH & JUMPA LAGI!</strong></p>
                <p style="font-size: 0.8em; margin-top: 4px;">Tarikh Cetakan: ${new Date().toLocaleString('sv-SE')}</p>
                <p style="font-size: 0.75em; color: #666; margin-top: 4px;">Sistem Tempahan Makanan - PMTG</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('receipt-modal');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  setFormat(orderId, format) {
    this.currentFormat = format;
    this.openReceiptModal(orderId);
  }

  printReceipt() {
    const area = document.getElementById('printable-receipt-area');
    if (!area) return;

    // Clean up any existing dedicated print container
    let printContainer = document.getElementById('dedicated-print-container');
    if (printContainer) printContainer.remove();

    // Create a fresh dedicated container directly under <body>
    printContainer = document.createElement('div');
    printContainer.id = 'dedicated-print-container';
    printContainer.innerHTML = area.innerHTML;
    document.body.appendChild(printContainer);

    // Trigger Print
    window.print();

    // Clean up after print window completes
    setTimeout(() => {
      if (printContainer) printContainer.remove();
    }, 1200);
  }

  downloadPDF(receiptNo) {
    const element = document.getElementById('printable-receipt-area');
    if (!element) return;

    if (typeof html2pdf !== 'undefined') {
      const opt = {
        margin:       10,
        filename:     `${receiptNo}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
      window.toast.success(`Resit ${receiptNo}.pdf berjaya dimuat turun!`);
    } else {
      this.printReceipt();
    }
  }
}

const receiptModule = new ReceiptModule();
window.receiptModule = receiptModule;
