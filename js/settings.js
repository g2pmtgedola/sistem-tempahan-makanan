/**
 * Restaurant Settings Module - Politeknik METrO Tasek Gelugor
 */

class SettingsModule {
  render() {
    const s = window.db.getSettings();

    return `
      <div class="animate-fade-in" style="max-width: 820px; margin: 0 auto;">
        <div class="glass-card" style="padding: 28px;">
          <h3 style="margin-bottom: 20px;">⚙️ Tetapan Premis & Logo Rasmi</h3>

          <!-- Current Logo Preview Box -->
          <div style="background: rgba(15,23,42,0.03); border: var(--card-border); padding: 18px; border-radius: var(--radius-md); margin-bottom: 20px; display: flex; align-items: center; gap: 20px;">
            <img src="${s.logoUrl || 'assets/logo.png'}" id="settings-logo-preview" style="height: 65px; max-width: 240px; object-fit: contain; background: #fff; padding: 6px 12px; border-radius: 8px; border: 1px solid var(--card-border);" alt="Logo">
            <div>
              <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--primary);">${s.name}</h4>
              <p style="font-size: 0.85rem; color: var(--text-muted);">Logo rasmi kini aktif pada Sidebar, Login, dan Resit Cetakan.</p>
            </div>
          </div>

          <form onsubmit="window.settingsModule.save(event)">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Nama Premis / Institusi *</label>
                <input type="text" id="set-name" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${s.name}">
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Pautan / Path Logo *</label>
                <input type="text" id="set-logo-url" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${s.logoUrl || 'assets/logo.png'}" oninput="document.getElementById('settings-logo-preview').src = this.value">
              </div>
            </div>

            <div style="margin-bottom: 14px;">
              <label style="font-size: 0.85rem; font-weight: 600;">Alamat Premis *</label>
              <input type="text" id="set-address" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${s.address}">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">No. Telefon *</label>
                <input type="tel" id="set-phone" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${s.phone}">
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Email Rasmi *</label>
                <input type="email" id="set-email" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${s.email}">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 14px;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Kadar SST (%) *</label>
                <input type="number" step="0.5" id="set-sst" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${s.sstPercent}">
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Caj Delivery (RM) *</label>
                <input type="number" step="0.5" id="set-del" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${s.deliveryFee}">
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Waktu Operasi *</label>
                <input type="text" id="set-hours" class="btn btn-secondary" style="width:100%; text-align:left;" required value="${s.operatingHours}">
              </div>
            </div>

            <h5 style="margin: 20px 0 10px 0; border-top: var(--card-border); padding-top: 16px;">🌐 Pautan Media Sosial</h5>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Facebook</label>
                <input type="text" id="set-fb" class="btn btn-secondary" style="width:100%; text-align:left;" value="${s.facebook}">
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">Instagram</label>
                <input type="text" id="set-ig" class="btn btn-secondary" style="width:100%; text-align:left;" value="${s.instagram}">
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 600;">TikTok</label>
                <input type="text" id="set-tt" class="btn btn-secondary" style="width:100%; text-align:left;" value="${s.tiktok}">
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px;">
              <button type="button" class="btn btn-danger" onclick="window.db.resetToDefault(); window.toast.success('Pangkalan data di-reset ke tetapan asal!'); window.app.renderActiveView();">
                🔄 Reset Pangkalan Data
              </button>
              <button type="submit" class="btn btn-primary" style="padding: 12px 24px;">
                💾 Simpan Tetapan
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  save(e) {
    e.preventDefault();
    const updated = {
      name: document.getElementById('set-name').value.trim(),
      logoUrl: document.getElementById('set-logo-url').value.trim(),
      address: document.getElementById('set-address').value.trim(),
      phone: document.getElementById('set-phone').value.trim(),
      email: document.getElementById('set-email').value.trim(),
      sstPercent: parseFloat(document.getElementById('set-sst').value) || 0,
      deliveryFee: parseFloat(document.getElementById('set-del').value) || 3,
      operatingHours: document.getElementById('set-hours').value.trim(),
      facebook: document.getElementById('set-fb').value.trim(),
      instagram: document.getElementById('set-ig').value.trim(),
      tiktok: document.getElementById('set-tt').value.trim()
    };

    window.db.updateSettings(updated);
    window.toast.success('Tetapan premis & logo berjaya dikemaskini!');
    window.app.renderActiveView();
  }
}

const settingsModule = new SettingsModule();
window.settingsModule = settingsModule;
