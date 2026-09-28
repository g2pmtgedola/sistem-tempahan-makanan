/**
 * Database Engine for SISTEM TEMPAHAN MAKANAN
 * Handles normalized tables, local storage persistence, seed data, and CRUD utilities.
 */

const DB_KEY = 'SISTEM_TEMPAHAN_MAKANAN_DB_V1';

// Initial Seed Data - Politeknik METrO Tasek Gelugor
const initialDatabase = {
  RestaurantSettings: {
    name: 'Politeknik METrO Tasek Gelugor',
    logoText: 'PMTG',
    logoUrl: 'assets/logo.png',
    tagline: 'Sistem Tempahan Makanan Kafeteria',
    address: 'Tasek Gelugor, Penang',
    phone: '04-573 2000',
    email: 'info@pmtg.edu.my',
    sstPercent: 0,
    deliveryFee: 3.00,
    operatingHours: '08:00 AM - 05:00 PM',
    facebook: 'facebook.com/pmtgofficial',
    instagram: '@pmtg_official',
    tiktok: '@pmtgofficial'
  },

  Users: [
    { id: 'usr-1', username: 'admin', password: 'password123', name: 'Ahmad Farhan (Pengurus Kafeteria)', role: 'admin', phone: '012-3456789', status: 'aktif' },
    { id: 'usr-2', username: 'cashier', password: 'password123', name: 'Siti Nurhaliza (Keluaran POS)', role: 'cashier', phone: '013-9876543', status: 'aktif' },
    { id: 'usr-3', username: 'chef', password: 'password123', name: 'Chef Ramli (Ketua Dapur)', role: 'chef', phone: '017-1122334', status: 'aktif' },
    { id: 'usr-4', username: 'customer', password: 'password123', name: 'Pelanggan Maya', role: 'customer', phone: '018-5544332', status: 'aktif' }
  ],

  Staff: [
    { id: 'stf-1', userId: 'usr-1', name: 'Ahmad Farhan', role: 'Admin', phone: '012-3456789', email: 'farhan@pmtg.edu.my', status: 'Aktif', joinedDate: '2025-01-10' },
    { id: 'stf-2', userId: 'usr-2', name: 'Siti Nurhaliza', role: 'Cashier', phone: '013-9876543', email: 'siti@pmtg.edu.my', status: 'Aktif', joinedDate: '2025-02-01' },
    { id: 'stf-3', userId: 'usr-3', name: 'Chef Ramli', role: 'Chef', phone: '017-1122334', email: 'ramli@pmtg.edu.my', status: 'Aktif', joinedDate: '2025-01-15' }
  ],

  Customers: [
    { id: 'cust-1', name: 'Pelajar Politeknik', phone: '019-8877665', email: 'student@pmtg.edu.my', totalOrders: 14, totalSpent: 180.50, lastOrderDate: '2026-08-18' },
    { id: 'cust-2', name: 'Pensyarah PMTG', phone: '012-4433221', email: 'lecturer@pmtg.edu.my', totalOrders: 8, totalSpent: 235.00, lastOrderDate: '2026-08-17' },
    { id: 'cust-3', name: 'Tan Sri Vincent', phone: '016-9988776', email: 'vincent@corporate.com', totalOrders: 21, totalSpent: 890.00, lastOrderDate: '2026-08-18' },
    { id: 'cust-4', name: 'Mei Ling', phone: '017-3344556', email: 'meiling@hotmail.com', totalOrders: 5, totalSpent: 120.00, lastOrderDate: '2026-08-16' },
    { id: 'cust-5', name: 'Ramasamy A/L Kumar', phone: '011-2233445', email: 'ramasamy@gmail.com', totalOrders: 11, totalSpent: 340.80, lastOrderDate: '2026-08-15' }
  ],

  Categories: [
    { id: 'cat-1', code: 'NASI', name: 'Nasi', icon: '🍚', status: 'aktif' },
    { id: 'cat-2', code: 'MEE', name: 'Mee', icon: '🍜', status: 'aktif' },
    { id: 'cat-3', code: 'WEST', name: 'Western', icon: '🥩', status: 'aktif' },
    { id: 'cat-4', code: 'DESS', name: 'Dessert', icon: '🍰', status: 'aktif' },
    { id: 'cat-5', code: 'MINU', name: 'Minuman', icon: '🧃', status: 'aktif' },
    { id: 'cat-6', code: 'COMB', name: 'Combo', icon: '🍱', status: 'aktif' },
    { id: 'cat-7', code: 'ALAC', name: 'Ala Carte', icon: '🍳', status: 'aktif' }
  ],

  Menus: [
    {
      id: 'mnu-1',
      code: 'NASI-01',
      name: 'Nasi Lemak Ayam Goreng Berempah',
      categoryId: 'cat-1',
      price: 13.50,
      promoPrice: 11.90,
      description: 'Nasi lemak wangi bersantan disajikan bersama ayam goreng berempah rangup, sambal tumis pedas manis, telur rebus, ikan bilis dan kacang.',
      status: 'Tersedia',
      prepTimeMinutes: 12,
      imageUrl: 'https://images.unsplash.com/photo-1626509653294-233416d77c2a?w=600&auto=format&fit=crop&q=80',
      rating: 4.9,
      salesCount: 142
    },
    {
      id: 'mnu-2',
      code: 'NASI-02',
      name: 'Nasi Goreng Kampung Udang Harimau',
      categoryId: 'cat-1',
      price: 15.00,
      promoPrice: 0,
      description: 'Nasi goreng berasaskan kangkung, ikan bilis tumbuk dan udang harimau segar pilihan chef.',
      status: 'Tersedia',
      prepTimeMinutes: 10,
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
      rating: 4.8,
      salesCount: 98
    },
    {
      id: 'mnu-3',
      code: 'MEE-01',
      name: 'Char Kuey Teow Basah Udang',
      categoryId: 'cat-2',
      price: 12.00,
      promoPrice: 10.50,
      description: 'Kuey teow digoreng dengan api tinggi bersama udang segar, kerang, taugeh dan telur basah bersos istimewa.',
      status: 'Tersedia',
      prepTimeMinutes: 8,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
      rating: 4.9,
      salesCount: 185
    },
    {
      id: 'mnu-4',
      code: 'MEE-02',
      name: 'Mee Goreng Mamak Special',
      categoryId: 'cat-2',
      price: 10.00,
      promoPrice: 0,
      description: 'Mee kuning digoreng pedas berasaskan kuah kacang, tauhu goreng, cucur dan cucuk cucur karipap.',
      status: 'Tersedia',
      prepTimeMinutes: 10,
      imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
      rating: 4.7,
      salesCount: 76
    },
    {
      id: 'mnu-5',
      code: 'WEST-01',
      name: 'Chicken Chop Blackpepper Crisp',
      categoryId: 'cat-3',
      price: 19.90,
      promoPrice: 17.90,
      description: 'Kepingan dada ayam digoreng tepung emas bersaus lada hitam berkrim, kentang goreng dan coleslaw segar.',
      status: 'Tersedia',
      prepTimeMinutes: 18,
      imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80',
      rating: 4.85,
      salesCount: 110
    },
    {
      id: 'mnu-6',
      code: 'WEST-02',
      name: 'Ribeye Steak Premium Sauce',
      categoryId: 'cat-3',
      price: 45.00,
      promoPrice: 39.90,
      description: 'Daging Ribeye New Zealand dipanggang mengikut cita rasa bersama kuah cendawan dan mashed potato.',
      status: 'Tersedia',
      prepTimeMinutes: 20,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      rating: 4.95,
      salesCount: 54
    },
    {
      id: 'mnu-7',
      code: 'DESS-01',
      name: 'Cendol Durian Musang King',
      categoryId: 'cat-4',
      price: 12.00,
      promoPrice: 0,
      description: 'Cendol santan pekat dengan gula melaka asli diserikan isi durian Musang King sejati.',
      status: 'Tersedia',
      prepTimeMinutes: 5,
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
      rating: 5.0,
      salesCount: 220
    },
    {
      id: 'mnu-8',
      code: 'MINU-01',
      name: 'Teh Tarik Kaw Pandan',
      categoryId: 'cat-5',
      price: 3.80,
      promoPrice: 0,
      description: 'Teh susu pekat dibuih halus berminyak wangi pandan asli.',
      status: 'Tersedia',
      prepTimeMinutes: 3,
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
      rating: 4.9,
      salesCount: 340
    },
    {
      id: 'mnu-9',
      code: 'MINU-02',
      name: 'Jus Mangga Royale Float',
      categoryId: 'cat-5',
      price: 8.50,
      promoPrice: 7.00,
      description: 'Jus mangga buatan asli dengan scoop ais krim vanila lembut di atas.',
      status: 'Tersedia',
      prepTimeMinutes: 4,
      imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80',
      rating: 4.8,
      salesCount: 165
    },
    {
      id: 'mnu-10',
      code: 'COMB-01',
      name: 'Set Combo Kenduri Family (4 Pax)',
      categoryId: 'cat-6',
      price: 79.90,
      promoPrice: 69.90,
      description: '4x Nasi Lemak Ayam Goreng, 4x Teh Tarik, 2x Cendol Durian dan Ayam Goreng Tambahan.',
      status: 'Tersedia',
      prepTimeMinutes: 25,
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
      rating: 4.95,
      salesCount: 42
    }
  ],

  Orders: [
    {
      id: 'ord-1001',
      orderNo: 'ORD-2026-0001',
      date: '2026-08-18',
      time: '12:30 PM',
      customerId: 'cust-1',
      customerName: 'Pelajar Politeknik',
      customerPhone: '019-8877665',
      orderType: 'Dine In',
      tableNo: '05',
      address: '',
      city: '',
      postcode: '',
      deliveryFee: 0,
      subtotal: 50.80,
      discount: 5.00,
      sstAmount: 0.00,
      grandTotal: 45.80,
      paymentMethod: 'DuitNow QR',
      paymentStatus: 'Sudah Bayar',
      orderStatus: 'Siap',
      notes: 'Kurang ais untuk minuman'
    }
  ],

  OrderItems: [
    { id: 'item-1', orderId: 'ord-1001', menuId: 'mnu-1', menuName: 'Nasi Lemak Ayam Goreng Berempah', price: 11.90, quantity: 2, subtotal: 23.80, notes: 'Tambah telur' },
    { id: 'item-2', orderId: 'ord-1001', menuId: 'mnu-3', menuName: 'Char Kuey Teow Basah Udang', price: 10.50, quantity: 1, subtotal: 10.50, notes: 'Pedas lebih' }
  ],

  Payments: [
    { id: 'pym-1', orderId: 'ord-1001', method: 'DuitNow QR', status: 'Lulus', amount: 45.80, transactionRef: 'DN-887766551', date: '2026-08-18 12:32:00' }
  ],

  Receipts: [
    { id: 'rcp-1', receiptNo: 'RCP-2026-0001', orderId: 'ord-1001', date: '2026-08-18 12:32:00', printFormat: 'Standard', printedCount: 2 }
  ],

  Promotions: [
    { id: 'prm-1', code: 'PMTG10', title: 'Diskaun Pelajar PMTG 10%', discountType: 'Peratus', discountValue: 10, minSpend: 15.00, validUntil: '2026-12-31', status: 'Aktif' }
  ],

  Notifications: [
    { id: 'ntf-1', title: 'Tempahan Baru', message: 'Tempahan ORD-2026-0001 diterima dari Meja 05.', type: 'info', timestamp: '2026-08-18 12:30:00', isRead: false }
  ],

  AuditLogs: [
    { id: 'log-1', userId: 'usr-1', userName: 'Ahmad Farhan', action: 'Kemaskini Alamat', details: 'Alamat premis dikemaskini kepada Tasek Gelugor, Penang', timestamp: '2026-08-18 22:39:00' }
  ]
};

class DBManager {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    const existing = localStorage.getItem(DB_KEY);
    if (!existing) {
      this.saveAll(initialDatabase);
    } else {
      try {
        const data = JSON.parse(existing);
        let updated = false;

        // Force update address & contact if still showing old KL address or old email
        if (!data.RestaurantSettings || 
            data.RestaurantSettings.address.includes('Sultan Ismail') || 
            data.RestaurantSettings.address.includes('Kuala Lumpur') ||
            data.RestaurantSettings.email.includes('rasanutantara')) {
          data.RestaurantSettings = {
            ...initialDatabase.RestaurantSettings,
            ...(data.RestaurantSettings || {}),
            name: 'Politeknik METrO Tasek Gelugor',
            address: 'Tasek Gelugor, Penang',
            phone: '04-573 2000',
            email: 'info@pmtg.edu.my',
            logoUrl: 'assets/logo.png'
          };
          updated = true;
        }

        if (updated) {
          this.saveAll(data);
        }
      } catch (e) {
        console.error('Error updating DB settings', e);
      }
    }
  }

  getAllData() {
    try {
      const data = localStorage.getItem(DB_KEY);
      return data ? JSON.parse(data) : initialDatabase;
    } catch (e) {
      console.error('Error reading localStorage DB', e);
      return initialDatabase;
    }
  }

  saveAll(data) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving localStorage DB', e);
    }
  }

  getTable(tableName) {
    const data = this.getAllData();
    return data[tableName] || [];
  }

  saveTable(tableName, items) {
    const data = this.getAllData();
    data[tableName] = items;
    this.saveAll(data);
  }

  getSettings() {
    const data = this.getAllData();
    const current = data.RestaurantSettings || {};
    
    // Override if address is still old KL address
    if (!current.address || current.address.includes('Sultan Ismail') || current.address.includes('Kuala Lumpur')) {
      current.address = 'Tasek Gelugor, Penang';
      current.phone = '04-573 2000';
      current.email = 'info@pmtg.edu.my';
      current.name = 'Politeknik METrO Tasek Gelugor';
      current.logoUrl = 'assets/logo.png';
      this.updateSettings(current);
    }
    
    return current;
  }

  updateSettings(newSettings) {
    const data = this.getAllData();
    data.RestaurantSettings = { ...data.RestaurantSettings, ...newSettings };
    this.saveAll(data);
    return data.RestaurantSettings;
  }

  // Generic CRUD
  getItem(tableName, id) {
    const table = this.getTable(tableName);
    return table.find(item => item.id === id);
  }

  addItem(tableName, item) {
    const table = this.getTable(tableName);
    if (!item.id) {
      item.id = `${tableName.toLowerCase().slice(0, 3)}-${Date.now()}`;
    }
    table.unshift(item);
    this.saveTable(tableName, table);
    this.addAuditLog('Tambah Data', `Menambah rekod baharu dalam ${tableName}: ${item.name || item.code || item.id}`);
    return item;
  }

  updateItem(tableName, id, updatedFields) {
    const table = this.getTable(tableName);
    const index = table.findIndex(item => item.id === id);
    if (index !== -1) {
      table[index] = { ...table[index], ...updatedFields };
      this.saveTable(tableName, table);
      this.addAuditLog('Kemaskini Data', `Kemaskini rekod dalam ${tableName} (ID: ${id})`);
      return table[index];
    }
    return null;
  }

  deleteItem(tableName, id) {
    let table = this.getTable(tableName);
    const item = table.find(i => i.id === id);
    table = table.filter(i => i.id !== id);
    this.saveTable(tableName, table);
    if (item) {
      this.addAuditLog('Padam Data', `Memadam rekod dari ${tableName}: ${item.name || item.code || item.id}`);
    }
    return true;
  }

  // Audit Logs & Notifications
  addAuditLog(action, details) {
    const logs = this.getTable('AuditLogs');
    const user = JSON.parse(sessionStorage.getItem('CURRENT_USER') || '{}');
    logs.unshift({
      id: `log-${Date.now()}`,
      userId: user.id || 'system',
      userName: user.name || 'Sistem Auto',
      action,
      details,
      timestamp: new Date().toLocaleString('sv-SE').replace(' ', ' ')
    });
    this.saveTable('AuditLogs', logs.slice(0, 100));
  }

  addNotification(title, message, type = 'info') {
    const notifications = this.getTable('Notifications');
    const newNotif = {
      id: `ntf-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleString('sv-SE').replace(' ', ' '),
      isRead: false
    };
    notifications.unshift(newNotif);
    this.saveTable('Notifications', notifications.slice(0, 50));
    return newNotif;
  }

  resetToDefault() {
    this.saveAll(initialDatabase);
  }
}

const db = new DBManager();
window.db = db;
