/**
 * Comprehensive Analytical Reports & Export Engine
 */

class ReportsModule {
  constructor() {
    this.period = 'Bulanan'; // 'Harian', 'Mingguan', 'Bulanan', 'Tahunan'
  }

  render() {
    const orders = window.db.getTable('Orders');
    const menus = window.db.getTable('Menus');
    const categories = window.db.getTable('Categories');

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

    const topMenu = [...menus].sort((a,b) => (b.salesCount || 0) - (a.salesCount || 0))[0] || { name: 'Nasi Lemak Ayam' };

    return `
      <div class="animate-fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <h3>📊 Laporan & Analisis Perniagaan</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Ringkasan prestasi jualan, menu paling laris dan pecahan bayaran.</p>
          </div>

          <div style="display: flex; gap: 10px;">
            <select class="btn btn-secondary" onchange="window.reportsModule.setPeriod(this.value)">
              <option value="Harian" ${this.period === 'Harian' ? 'selected' : ''}>Laporan Harian</option>
              <option value="Mingguan" ${this.period === 'Mingguan' ? 'selected' : ''}>Laporan Mingguan</option>
              <option value="Bulanan" ${this.period === 'Bulanan' ? 'selected' : ''}>Laporan Bulanan</option>
              <option value="Tahunan" ${this.period === 'Tahunan' ? 'selected' : ''}>Laporan Tahunan</option>
            </select>

            <button class="btn btn-primary" onclick="window.reportsModule.exportCSV()">
              📥 Eksport Excel (CSV)
            </button>
            <button class="btn btn-secondary" onclick="window.print()">
              🖨️ Cetak Laporan
            </button>
          </div>
        </div>

        <!-- KPI Summary Cards -->
        <div class="kpi-grid" style="margin-bottom: 24px;">
          <div class="glass-card kpi-card kpi-success">
            <div class="kpi-info">
              <p>Jumlah Pendapatan (${this.period})</p>
              <h3>RM ${totalRevenue.toFixed(2)}</h3>
            </div>
            <div class="kpi-icon-box" style="background: var(--success-light); color: var(--success);">💰</div>
          </div>

          <div class="glass-card kpi-card">
            <div class="kpi-info">
              <p>Bilangan Tempahan</p>
              <h3>${totalOrders} Pesanan</h3>
            </div>
            <div class="kpi-icon-box">📋</div>
          </div>

          <div class="glass-card kpi-card">
            <div class="kpi-info">
              <p>Purata Nilai Pesanan</p>
              <h3>RM ${avgOrderValue.toFixed(2)}</h3>
            </div>
            <div class="kpi-icon-box">📊</div>
          </div>

          <div class="glass-card kpi-card kpi-warning">
            <div class="kpi-info">
              <p>Menu Paling Laris</p>
              <h3 style="font-size: 1.1rem; line-height: 1.2;">${topMenu.name}</h3>
            </div>
            <div class="kpi-icon-box" style="background: var(--warning-light); color: var(--warning);">⭐</div>
          </div>
        </div>

        <!-- Detailed Breakdown Table -->
        <div class="modern-table-wrap glass-card" style="margin-bottom: 28px;">
          <div style="padding: 20px 24px 0 24px;">
            <h4>📋 Ringkasan Transaksi Tempahan</h4>
          </div>
          <table class="modern-table">
            <thead>
              <tr>
                <th>No. Tempahan</th>
                <th>Tarikh</th>
                <th>Pelanggan</th>
                <th>Jenis Tempahan</th>
                <th>Kaedah Bayaran</th>
                <th>Jumlah (RM)</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(o => `
                <tr>
                  <td><strong>${o.orderNo}</strong></td>
                  <td>${o.date} ${o.time}</td>
                  <td>${o.customerName}</td>
                  <td>${o.orderType}</td>
                  <td><span class="status-badge btn-secondary">${o.paymentMethod}</span></td>
                  <td><strong style="color: var(--primary);">RM ${(o.grandTotal || 0).toFixed(2)}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  setPeriod(p) {
    this.period = p;
    window.app.renderActiveView();
  }

  exportCSV() {
    const orders = window.db.getTable('Orders');
    let csv = 'No Tempahan,Tarikh,Masa,Pelanggan,Telefon,Jenis,Kaedah Bayaran,Status Bayaran,Grand Total (RM)\n';

    orders.forEach(o => {
      csv += `"${o.orderNo}","${o.date}","${o.time}","${o.customerName}","${o.customerPhone}","${o.orderType}","${o.paymentMethod}","${o.paymentStatus}","${(o.grandTotal || 0).toFixed(2)}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Jualan_${this.period}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.toast.success(`Laporan_Jualan_${this.period}_2026.csv berjaya dimuat turun!`);
  }
}

const reportsModule = new ReportsModule();
window.reportsModule = reportsModule;
