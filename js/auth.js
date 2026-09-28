/**
 * Authentication & Security Manager for SISTEM TEMPAHAN MAKANAN
 */

class AuthManager {
  login(username, password) {
    const users = window.db.getTable('Users');
    const user = users.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );

    if (user) {
      if (user.status !== 'aktif') {
        window.toast.error('Akaun anda telah dinyahaktifkan. Sila hubungi Admin.');
        return false;
      }

      window.state.setCurrentUser(user);
      window.db.addAuditLog('Login', `Pengguna ${user.name} (${user.role}) berjaya log masuk`);
      window.toast.success(`Selamat datang, ${user.name}!`, 'Log Masuk Berjaya');
      return true;
    } else {
      window.toast.error('Username atau password tidak sah!', 'Gagal Log Masuk');
      return false;
    }
  }

  quickSwitchRole(role) {
    const users = window.db.getTable('Users');
    const user = users.find(u => u.role === role);
    if (user) {
      window.state.setCurrentUser(user);
      window.toast.info(`Tukar peranan kepada: ${user.role.toUpperCase()} (${user.name})`);
      window.app.renderActiveView();
    }
  }

  logout() {
    window.toast.confirm(
      'Log Keluar',
      'Adakah anda pasti untuk log keluar dari sistem?',
      () => {
        const user = window.state.currentUser;
        if (user) {
          window.db.addAuditLog('Logout', `Pengguna ${user.name} log keluar`);
        }
        window.state.setCurrentUser(null);
        window.toast.info('Anda telah log keluar.');
        window.app.renderActiveView();
      },
      'Log Keluar',
      'Batal',
      'warning'
    );
  }

  checkPermission(requiredRole) {
    const current = window.state.currentUser;
    if (!current) return false;
    if (current.role === 'admin') return true; // Admin has full access
    return current.role === requiredRole;
  }
}

const auth = new AuthManager();
window.auth = auth;
