/**
 * Dashboard & Interactive Analytics Module
 */

class DashboardModule {
  constructor() {
    this.charts = {};
  }

  render() {
    const orders = window.db.getTable('Orders');
    const menus = window.db.getTable('Menus');
    const customers = window.db.getTable('Customers');

    const todayStr = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.date === todayStr);

    const todaySales = todayOrders
      .filter(o => o.paymentStatus === 'Sudah Bayar')
      .reduce((sum, o) => sum + (o.grandTotal || 0), 0);

    const countsByStatus = {
      Baru: orders.filter(o => o.orderStatus === 'Baru').length,
      Diproses: orders.filter(o => o.orderStatus === 'Diproses').length,
      Dimasak: orders.filter(o => o.orderStatus === 'Sedang Dimasak').length,
      Siap: orders.filter(o => o.orderStatus === 'Siap').length,
      Dibatalkan: orders.filter(o => o.orderStatus === 'Dibatalkan').length
    };

    return `
      <div class="animate-fade-in">
        <!-- KPI Cards Grid -->
        <div class="kpi-grid">
          <div class="glass-card kpi-card">
            <div class="kpi-info">
              <p>Tempahan Hari Ini</p>
              <h3>${todayOrders.length}</h3>
            </div>
            <div class="kpi-icon-box">📋</div>
          </div>

          <div class="glass-card kpi-card kpi-success">
            <div class="kpi-info">
              <p>Pendapatan Hari Ini</p>
              <h3>RM ${todaySales.toFixed(2)}</h3>
            </div>
            <div class="kpi-icon-box" style="background: var(--success-light); color: var(--success);">💰</div>
          </div>

          <div class="glass-card kpi-card">
            <div class="kpi-info">
              <p>Jumlah Pelanggan</p>
              <h3>${customers.length}</h3>
            </div>
            <div class="kpi-icon-box">👥</div>
          </div>

          <div class="glass-card kpi-card">
            <div class="kpi-info">
              <p>Jumlah Menu</p>
              <h3>${menus.length}</h3>
            </div>
            <div class="kpi-icon-box">🍱</div>
          </div>
        </div>

        <!-- Status Pipeline Bar -->
        <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));">
          <div class="glass-card kpi-card" style="padding: 14px 18px;">
            <div class="kpi-info">
              <p>Tempahan Baru</p>
              <h3 style="color: var(--primary);">${countsByStatus.Baru}</h3>
            </div>
          </div>
          <div class="glass-card kpi-card kpi-warning" style="padding: 14px 18px;">
            <div class="kpi-info">
              <p>Sedang Diproses</p>
              <h3 style="color: var(--warning);">${countsByStatus.Diproses}</h3>
            </div>
          </div>
          <div class="glass-card kpi-card" style="padding: 14px 18px;">
            <div class="kpi-info">
              <p>Sedang Dimasak</p>
              <h3 style="color: #ec4899;">${countsByStatus.Dimasak}</h3>
            </div>
          </div>
          <div class="glass-card kpi-card kpi-success" style="padding: 14px 18px;">
            <div class="kpi-info">
              <p>Siap</p>
              <h3 style="color: var(--success);">${countsByStatus.Siap}</h3>
            </div>
          </div>
          <div class="glass-card kpi-card kpi-danger" style="padding: 14px 18px;">
            <div class="kpi-info">
              <p>Dibatalkan</p>
              <h3 style="color: var(--danger);">${countsByStatus.Dibatalkan}</h3>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-grid">
          <div class="glass-card chart-card">
            <div class="chart-header">
              <h4>Carta Jualan Harian (RM)</h4>
            </div>
            <div class="chart-container">
              <canvas id="chart-daily-sales"></canvas>
            </div>
          </div>

          <div class="glass-card chart-card">
            <div class="chart-header">
              <h4>Menu Paling Laris</h4>
            </div>
            <div class="chart-container">
              <canvas id="chart-top-menus"></canvas>
            </div>
          </div>

          <div class="glass-card chart-card">
            <div class="chart-header">
              <h4>Pendapatan Bulanan (RM)</h4>
            </div>
            <div class="chart-container">
              <canvas id="chart-monthly-revenue"></canvas>
            </div>
          </div>

          <div class="glass-card chart-card">
            <div class="chart-header">
              <h4>Carta Kategori Makanan</h4>
            </div>
            <div class="chart-container">
              <canvas id="chart-categories"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  initCharts() {
    if (typeof Chart === 'undefined') return;

    // Destroy previous charts if existing
    Object.values(this.charts).forEach(chart => chart && chart.destroy());

    // 1. Daily Sales Chart
    const ctxDaily = document.getElementById('chart-daily-sales')?.getContext('2d');
    if (ctxDaily) {
      this.charts.daily = new Chart(ctxDaily, {
        type: 'line',
        data: {
          labels: ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad'],
          datasets: [{
            label: 'Jualan (RM)',
            data: [420, 680, 510, 890, 1250, 1890, 1450],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.15)',
            fill: true,
            tension: 0.4,
            borderWidth: 3
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    // 2. Top Selling Menus Chart
    const ctxTop = document.getElementById('chart-top-menus')?.getContext('2d');
    if (ctxTop) {
      const menus = window.db.getTable('Menus').slice(0, 5);
      this.charts.top = new Chart(ctxTop, {
        type: 'bar',
        data: {
          labels: menus.map(m => m.name.split(' ')[0] + ' ' + (m.name.split(' ')[1] || '')),
          datasets: [{
            label: 'Unit Terjual',
            data: menus.map(m => m.salesCount || 50),
            backgroundColor: ['#2563eb', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6'],
            borderRadius: 8
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    // 3. Monthly Revenue Chart
    const ctxMonthly = document.getElementById('chart-monthly-revenue')?.getContext('2d');
    if (ctxMonthly) {
      this.charts.monthly = new Chart(ctxMonthly, {
        type: 'bar',
        data: {
          labels: ['Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos'],
          datasets: [{
            label: 'Pendapatan (RM)',
            data: [12400, 15800, 14200, 18900, 21500, 24800],
            backgroundColor: '#22c55e',
            borderRadius: 8
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    // 4. Category Breakdown Donut Chart
    const ctxCat = document.getElementById('chart-categories')?.getContext('2d');
    if (ctxCat) {
      const categories = window.db.getTable('Categories');
      this.charts.cat = new Chart(ctxCat, {
        type: 'doughnut',
        data: {
          labels: categories.map(c => c.name),
          datasets: [{
            data: [35, 25, 20, 10, 10, 5, 5],
            backgroundColor: ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9', '#ec4899']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }
}

const dashboardModule = new DashboardModule();
window.dashboardModule = dashboardModule;
