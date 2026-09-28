/**
 * Main Application Initializer & Router Controller
 * Integrated with Interactive User Manual Module.
 */

class AppController {
  constructor() {
    this.init();
  }

  init() {
    // Subscribe to state updates
    window.state.subscribe(() => this.renderActiveView());

    // Setup sidebar toggle
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        document.querySelector('.sidebar')?.classList.toggle('collapsed');
        document.getElementById('app')?.classList.toggle('sidebar-collapsed-main');
      };
    }

    // Render View on Load
    this.renderActiveView();
  }

  renderActiveView() {
    const currentUser = window.state.currentUser;
    const contentArea = document.getElementById('main-content-area');
    const pageTitle = document.getElementById('page-title-text');
    const userDisplay = document.getElementById('user-display-name');

    if (userDisplay) {
      userDisplay.innerText = currentUser ? `${currentUser.name} (${currentUser.role.toUpperCase()})` : 'Pelanggan Maya';
    }

    // 1. If not logged in -> Show Login View
    if (!currentUser) {
      if (pageTitle) pageTitle.innerText = 'Log Masuk Sistem';
      if (contentArea) contentArea.innerHTML = this.renderLoginView();
      return;
    }

    // Update Page Header Title & View Content
    const tab = window.state.activeTab;

    switch (tab) {
      case 'dashboard':
        if (pageTitle) pageTitle.innerText = 'Dashboard Utama & Analitik';
        contentArea.innerHTML = window.dashboardModule.render();
        window.dashboardModule.initCharts();
        break;

      case 'menu-admin':
        if (pageTitle) pageTitle.innerText = 'Pengurusan Menu Makanan';
        contentArea.innerHTML = window.menuModule.renderAdmin();
        break;

      case 'menu-customer':
        if (pageTitle) pageTitle.innerText = 'Halaman Menu Pelanggan';
        contentArea.innerHTML = window.menuModule.renderCustomer();
        break;

      case 'category':
        if (pageTitle) pageTitle.innerText = 'Pengurusan Kategori Makanan';
        contentArea.innerHTML = window.categoryModule.render();
        break;

      case 'cart':
        if (pageTitle) pageTitle.innerText = 'Shopping Cart & Sistem POS';
        contentArea.innerHTML = window.cartModule.renderPOS();
        break;

      case 'orders':
        if (pageTitle) pageTitle.innerText = 'Pengurusan Tempahan & Status Pipeline';
        contentArea.innerHTML = window.ordersModule.render();
        break;

      case 'kds':
        if (pageTitle) pageTitle.innerText = 'Paparan Dapur (Kitchen Display System)';
        contentArea.innerHTML = window.kdsModule.render();
        break;

      case 'manual':
        if (pageTitle) pageTitle.innerText = 'Manual Pengguna Sistem Step-by-Step';
        contentArea.innerHTML = window.manualModule.render();
        break;

      case 'customers':
        if (pageTitle) pageTitle.innerText = 'Pengurusan Rekod Pelanggan';
        contentArea.innerHTML = window.customersModule.render();
        break;

      case 'staff':
        if (pageTitle) pageTitle.innerText = 'Pengurusan Staff & Peranan';
        contentArea.innerHTML = window.staffModule.render();
        break;

      case 'promotions':
        if (pageTitle) pageTitle.innerText = 'Promosi, Baucer & Diskaun';
        contentArea.innerHTML = window.promotionsModule.render();
        break;

      case 'reports':
        if (pageTitle) pageTitle.innerText = 'Laporan Jualan & Analitis';
        contentArea.innerHTML = window.reportsModule.render();
        break;

      case 'settings':
        if (pageTitle) pageTitle.innerText = 'Tetapan Restoran & Sistem';
        contentArea.innerHTML = window.settingsModule.render();
        break;

      default:
        contentArea.innerHTML = window.dashboardModule.render();
        window.dashboardModule.initCharts();
    }

    this.updateActiveNavUI();
  }

  updateActiveNavUI() {
    const activeTab = window.state.activeTab;
    document.querySelectorAll('.nav-item').forEach(el => {
      if (el.getAttribute('data-tab') === activeTab) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Update Cart Badge Count
    const totals = window.state.getCartTotals();
    const cartBadge = document.getElementById('cart-badge-count');
    if (cartBadge) {
      cartBadge.innerText = totals.itemCount;
      cartBadge.style.display = totals.itemCount > 0 ? 'flex' : 'none';
    }
  }

  renderLoginView() {
    const settings = window.db.getSettings();
    return `
      <div class="animate-fade-in" style="display: flex; align-items: center; justify-content: center; min-height: 75vh;">
        <div class="glass-card" style="width: 100%; max-width: 450px; padding: 36px; text-align: center;">
          <div style="margin-bottom: 24px;">
            <img src="${settings.logoUrl || 'assets/logo.png'}" class="login-logo-img" alt="${settings.name}">
            <h2 style="font-weight: 800; font-size: 1.35rem; margin-bottom: 4px; color: var(--primary);">SISTEM TEMPAHAN MAKANAN</h2>
            <p style="color: var(--text-muted); font-size: 0.85rem;">${settings.name}</p>
          </div>

          <form onsubmit="window.app.handleLoginSubmit(event)">
            <div style="margin-bottom: 16px; text-align: left;">
              <label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; display: block;">Username *</label>
              <input type="text" id="login-username" class="btn btn-secondary" style="width: 100%; text-align: left;" required placeholder="admin / cashier / chef / customer" value="admin">
            </div>

            <div style="margin-bottom: 24px; text-align: left;">
              <label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; display: block;">Password *</label>
              <input type="password" id="login-password" class="btn btn-secondary" style="width: 100%; text-align: left;" required placeholder="🔑 password123" value="password123">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 1.05rem; margin-bottom: 20px;">
              🚀 Log Masuk
            </button>

            <!-- Quick Demo Login Switchers -->
            <div style="border-top: var(--card-border); padding-top: 18px; text-align: center;">
              <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 10px;">Atau Tukar Peranan Ujian (Quick Switch):</p>
              <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.auth.quickSwitchRole('admin')">👑 Admin</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.auth.quickSwitchRole('cashier')">💼 Cashier</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.auth.quickSwitchRole('chef')">👨‍🍳 Chef</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.auth.quickSwitchRole('customer')">👤 Customer</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  handleLoginSubmit(e) {
    e.preventDefault();
    const u = document.getElementById('login-username').value;
    const p = document.getElementById('login-password').value;
    if (window.auth.login(u, p)) {
      this.renderActiveView();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
