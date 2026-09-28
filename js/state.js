/**
 * State Management & Reactive Store for SISTEM TEMPAHAN MAKANAN
 */

class AppState {
  constructor() {
    this.currentUser = JSON.parse(sessionStorage.getItem('CURRENT_USER') || 'null');
    this.activeTab = 'dashboard';
    this.theme = localStorage.getItem('THEME') || 'light';
    this.cart = JSON.parse(localStorage.getItem('SHOPPING_CART') || '[]');
    this.searchQuery = '';
    this.selectedCategory = 'ALL';
    this.appliedVoucher = null;
    this.listeners = [];

    // Apply saved theme immediately
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      sessionStorage.setItem('CURRENT_USER', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('CURRENT_USER');
    }
    this.notify();
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('THEME', this.theme);
    document.documentElement.setAttribute('data-theme', this.theme);
    this.notify();
    return this.theme;
  }

  setActiveTab(tabName) {
    this.activeTab = tabName;
    this.notify();
  }

  // Cart Operations
  getCart() {
    return this.cart;
  }

  addToCart(menuItem, quantity = 1, notes = '') {
    const existingIndex = this.cart.findIndex(
      item => item.menuId === menuItem.id && item.notes === notes
    );

    const price = menuItem.promoPrice > 0 ? menuItem.promoPrice : menuItem.price;

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
      this.cart[existingIndex].subtotal = this.cart[existingIndex].quantity * price;
    } else {
      this.cart.push({
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        menuId: menuItem.id,
        name: menuItem.name,
        price: price,
        imageUrl: menuItem.imageUrl,
        quantity: quantity,
        notes: notes,
        subtotal: price * quantity
      });
    }

    this.saveCart();
    if (window.toast) {
      window.toast.success(`'${menuItem.name}' ditambah ke Cart!`);
    }
  }

  updateCartQty(cartItemId, delta) {
    const item = this.cart.find(i => i.id === cartItemId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeFromCart(cartItemId);
        return;
      }
      item.subtotal = item.quantity * item.price;
      this.saveCart();
    }
  }

  updateCartNotes(cartItemId, newNotes) {
    const item = this.cart.find(i => i.id === cartItemId);
    if (item) {
      item.notes = newNotes;
      this.saveCart();
    }
  }

  removeFromCart(cartItemId) {
    this.cart = this.cart.filter(i => i.id !== cartItemId);
    this.saveCart();
    if (window.toast) {
      window.toast.info('Item dipadam dari Cart.');
    }
  }

  clearCart() {
    this.cart = [];
    this.appliedVoucher = null;
    this.saveCart();
  }

  saveCart() {
    localStorage.setItem('SHOPPING_CART', JSON.stringify(this.cart));
    this.notify();
  }

  getCartTotals() {
    const settings = window.db ? window.db.getSettings() : { sstPercent: 6, deliveryFee: 5 };
    const subtotal = this.cart.reduce((sum, item) => sum + item.subtotal, 0);

    let discount = 0;
    if (this.appliedVoucher) {
      if (this.appliedVoucher.discountType === 'Peratus') {
        discount = (subtotal * this.appliedVoucher.discountValue) / 100;
      } else {
        discount = this.appliedVoucher.discountValue;
      }
    }

    const sst = Math.max(0, ((subtotal - discount) * (settings.sstPercent || 6)) / 100);
    const grandTotal = Math.max(0, subtotal - discount + sst);

    return {
      subtotal,
      discount,
      sst,
      grandTotal,
      itemCount: this.cart.reduce((sum, item) => sum + item.quantity, 0)
    };
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }
}

const state = new AppState();
window.state = state;
