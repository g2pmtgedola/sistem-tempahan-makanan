/**
 * Interactive System User Manual (Manual Pengguna Sistem Step-by-Step)
 * Politeknik METrO Tasek Gelugor - Sistem Tempahan Makanan
 */

class ManualModule {
  constructor() {
    this.activeStep = 1;
  }

  render() {
    return `
      <div class="animate-fade-in" style="max-width: 1100px; margin: 0 auto;">
        <!-- Header Banner -->
        <div class="glass-card" style="padding: 28px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; background: linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(15,23,42,0.05) 100%);">
          <div style="display: flex; align-items: center; gap: 16px;">
            <img src="assets/logo.png" style="height: 55px; max-width: 200px; object-fit: contain; background: #fff; padding: 6px 12px; border-radius: 8px;" alt="PMTG">
            <div>
              <h2 style="font-weight: 800; font-size: 1.5rem; color: var(--primary);">📖 Manual Pengguna Sistem Step-by-Step</h2>
              <p style="color: var(--text-muted); font-size: 0.9rem;">Panduan lengkap penggunaan Sistem Tempahan Makanan Politeknik METrO Tasek Gelugor.</p>
            </div>
          </div>
          <div style="display: flex; gap: 10px;">
            <a href="MANUAL_PENGGUNA.html" target="_blank" class="btn btn-primary" style="padding: 10px 18px;">
              📄 Buka Dokumentasi Cetakan (HTML)
            </a>
            <button class="btn btn-secondary" onclick="window.print()">
              🖨️ Cetak Manual
            </button>
          </div>
        </div>

        <!-- Step Navigation Tabs -->
        <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 24px;">
          ${[
            { num: 1, label: '🔑 1. Log Masuk' },
            { num: 2, label: '🍱 2. Pengurusan Menu & Gambar' },
            { num: 3, label: '🛒 3. POS & Tempahan' },
            { num: 4, label: '👨‍🍳 4. Paparan Dapur (KDS)' },
            { num: 5, label: '🧾 5. Cetakan Resit & PDF' },
            { num: 6, label: '📊 6. Laporan & Eksport CSV' },
            { num: 7, label: '🤖 7. Pembantu AI' }
          ].map(tab => `
            <button class="btn ${this.activeStep === tab.num ? 'btn-primary' : 'btn-secondary'} btn-sm" 
                    onclick="window.manualModule.setStep(${tab.num})">
              ${tab.label}
            </button>
          `).join('')}
        </div>

        <!-- Step Content Area -->
        <div id="manual-step-content" class="glass-card" style="padding: 32px;">
          ${this.renderStepContent()}
        </div>
      </div>
    `;
  }

  setStep(stepNum) {
    this.activeStep = stepNum;
    window.app.renderActiveView();
  }

  renderStepContent() {
    switch (this.activeStep) {
      case 1:
        return `
          <div class="animate-fade-in">
            <h3 style="color: var(--primary); margin-bottom: 12px;">🔑 Langkah 1: Log Masuk & Peranan Pengguna</h3>
            <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
              Sistem menyokong 4 jenis peranan pengguna rasmi. Setiap peranan mempunyai kebenaran akses tersendiri untuk memastikan kelancaran operasi kafeteria.
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
              <div style="background: rgba(37,99,235,0.06); border: 1px solid var(--primary); padding: 16px; border-radius: var(--radius-md);">
                <h4 style="color: var(--primary);">👑 Admin (Pengurus)</h4>
                <small>Username: <strong>admin</strong> | Pass: <strong>password123</strong></small>
                <p style="font-size: 0.82rem; margin-top: 8px; color: var(--text-muted);">Akses penuh ke Dashboard, Pengurusan Menu, Staff, Tetapan, Laporan, dan Audit Logs.</p>
              </div>

              <div style="background: rgba(34,197,94,0.06); border: 1px solid var(--success); padding: 16px; border-radius: var(--radius-md);">
                <h4 style="color: var(--success);">💼 Cashier (Juruwang)</h4>
                <small>Username: <strong>cashier</strong> | Pass: <strong>password123</strong></small>
                <p style="font-size: 0.82rem; margin-top: 8px; color: var(--text-muted);">Akses ke modul Troli POS, pendaftaran tempahan, penerimaan bayaran, dan cetakan resit.</p>
              </div>

              <div style="background: rgba(236,72,153,0.06); border: 1px solid #ec4899; padding: 16px; border-radius: var(--radius-md);">
                <h4 style="color: #ec4899;">👨‍🍳 Chef (Petugas Dapur)</h4>
                <small>Username: <strong>chef</strong> | Pass: <strong>password123</strong></small>
                <p style="font-size: 0.82rem; margin-top: 8px; color: var(--text-muted);">Akses ke Paparan Dapur (KDS) untuk melihat tempahan masuk, memasak, dan menanda pesanan siap.</p>
              </div>

              <div style="background: rgba(245,158,11,0.06); border: 1px solid var(--warning); padding: 16px; border-radius: var(--radius-md);">
                <h4 style="color: var(--warning);">👤 Customer (Pelanggan)</h4>
                <small>Username: <strong>customer</strong> | Pass: <strong>password123</strong></small>
                <p style="font-size: 0.82rem; margin-top: 8px; color: var(--text-muted);">Melihat menu hidangan, memilih makanan, membuat pesanan kendiri, dan menyemak resit.</p>
              </div>
            </div>

            <div style="background: rgba(15,23,42,0.03); padding: 16px; border-radius: var(--radius-md); border-left: 4px solid var(--primary);">
              💡 <strong>Petua Ujian Pantas (Quick Switch)</strong>: Pada halaman Log Masuk, anda boleh menekan butang <em>Quick Switch</em> di bahagian bawah untuk bertukar peranan dengan satu klik tanpa perlu menaip password.
            </div>
          </div>
        `;

      case 2:
        return `
          <div class="animate-fade-in">
            <h3 style="color: var(--primary); margin-bottom: 12px;">🍱 Langkah 2: Pengurusan Menu & Muat Naik Gambar</h3>
            <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
              Admin boleh menambah menu baharu atau mengemas kini menu sedia ada. Sistem menyokong muat naik fail gambar tempatan terus dari komputer atau telefon pintar anda!
            </p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
              <div style="line-height: 1.6; font-size: 0.9rem;">
                <h4 style="margin-bottom: 10px;">Langkah-Langkah Mengemas Kini Menu & Gambar:</h4>
                <ol style="padding-left: 20px; display: flex; flex-direction: column; gap: 10px;">
                  <li>Pergi ke modul <strong>Pengurusan Menu</strong> daripada Sidebar.</li>
                  <li>Tekan butang <strong>➕ Tambah Menu Baharu</strong> atau tekan <strong>✏️ Edit</strong> pada mana-mana menu sedia ada (contoh: <em>NASI KERABU</em>).</li>
                  <li>Di bahagian <strong>🖼️ Gambar Menu</strong>, anda mempunyai 3 pilihan:
                    <ul style="padding-left: 20px; margin-top: 4px;">
                      <li><strong>Muat Naik Fail</strong>: Pilih fail gambar dari peranti anda (`.jpg`, `.png`, `.webp`). Enjin `FileReader` akan membaca dan menunjukkan previu gambar secara *live*.</li>
                      <li><strong>URL Gambar Web</strong>: Masukkan pautan URL gambar dari internet.</li>
                      <li><strong>Galeri Preset</strong>: Pilih gambar sampel dari galeri hidangan yang disediakan.</li>
                    </ul>
                  </li>
                  <li>Isi harga, harga promosi, anggaran masa penyediaan, dan penerangan menu.</li>
                  <li>Tekan <strong>💾 Simpan Menu</strong> untuk mengemas kini pangkalan data.</li>
                </ol>
              </div>

              <div>
                <img src="assets/dashboard_guide.jpg" style="width: 100%; border-radius: var(--radius-md); border: var(--card-border); box-shadow: var(--shadow-sm);" alt="Menu Management Guide">
                <small style="color: var(--text-muted); display: block; text-align: center; margin-top: 6px;">Paparan Antaramuka Modul Pengurusan Menu & Dashboard</small>
              </div>
            </div>
          </div>
        `;

      case 3:
        return `
          <div class="animate-fade-in">
            <h3 style="color: var(--primary); margin-bottom: 12px;">🛒 Langkah 3: Troli POS, Nota Pelanggan & Checkout</h3>
            <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
              Pengurusan pesanan jualan tunai (Point of Sale) dan tempahan dalam talian dengan nota peribadi pelanggan.
            </p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
              <div>
                <img src="assets/pos_guide.jpg" style="width: 100%; border-radius: var(--radius-md); border: var(--card-border); box-shadow: var(--shadow-sm);" alt="POS & Receipt Guide">
                <small style="color: var(--text-muted); display: block; text-align: center; margin-top: 6px;">Antaramuka POS, Checkout DuitNow QR & Resit Cetakan</small>
              </div>

              <div style="line-height: 1.6; font-size: 0.9rem;">
                <h4 style="margin-bottom: 10px;">Aliran Kerja Membuat Pesanan:</h4>
                <ol style="padding-left: 20px; display: flex; flex-direction: column; gap: 10px;">
                  <li>Pilih modul <strong>Menu Pelanggan</strong> atau <strong>Troli & POS</strong>.</li>
                  <li>Tekan butang <strong>🛒 Tambah</strong> pada item hidangan. Tetingkap nota khas akan muncul.</li>
                  <li>Pilih nota popular (contoh: <em>Kurang pedas</em>, <em>Tambah telur</em>, <em>Tak mahu bawang</em>, <em>Kurang ais</em>) atau taip nota tersendiri.</li>
                  <li>Di panel Troli, semak subtotal, kuantiti, dan kadar SST.</li>
                  <li>Tekan <strong>🚀 Halaman Pembayaran (Checkout)</strong>.</li>
                  <li>Pilih Jenis Tempahan:
                    <ul style="padding-left: 20px; margin-top: 4px;">
                      <li><strong>🍽️ Dine In</strong>: Pilih Nombor Meja.</li>
                      <li><strong>🥡 Take Away</strong>: Bungkus bawa pulang.</li>
                      <li><strong>🚚 Delivery</strong>: Masukkan Alamat Penghantaran.</li>
                    </ul>
                  </li>
                  <li>Pilih Kaedah Bayaran (DuitNow QR, Tunai, Kad Kredit, Touch n Go, GrabPay) dan tekan <strong>✅ Hantar & Bayar Tempahan</strong>.</li>
                </ol>
              </div>
            </div>
          </div>
        `;

      case 4:
        return `
          <div class="animate-fade-in">
            <h3 style="color: var(--primary); margin-bottom: 12px;">👨‍🍳 Langkah 4: Paparan Dapur Masa Nyata (Kitchen Display System)</h3>
            <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
              Modul KDS memberikan maklumat pesanan masa nyata kepada Chef dan Petugas Dapur tanpa memerlukan kertas pesanan manual.
            </p>

            <div style="background: rgba(15,23,42,0.03); border: var(--card-border); padding: 20px; border-radius: var(--radius-md); margin-bottom: 20px;">
              <h4 style="margin-bottom: 12px;">Aliran Status Tempahan di Dapur:</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
                <div style="background: #fff; padding: 14px; border-radius: 8px; border-top: 3px solid var(--primary);">
                  <strong>1. Status: BARU</strong>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Pesanan diterima dari kaunter atau pelanggan. Kad berwarna biru.</p>
                </div>
                <div style="background: #fff; padding: 14px; border-radius: 8px; border-top: 3px solid #ec4899;">
                  <strong>2. MULA MEMASAK</strong>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Chef tekan butang 🔥 <em>Mula Memasak</em>. Kad bertukar merah jambu (Sedang Dimasak).</p>
                </div>
                <div style="background: #fff; padding: 14px; border-radius: 8px; border-top: 3px solid var(--success);">
                  <strong>3. SIAP & HANTAR</strong>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Chef tekan ✅ <em>Siap & Hantar</em>. Pesanan sedia disajikan atau dihantar.</p>
                </div>
              </div>
            </div>

            <p style="font-size: 0.85rem; color: var(--text-muted);">
              ⚠️ Nota khas pelanggan seperti <em>"Kurang pedas"</em> atau <em>"Sambal asing"</em> akan dipaparkan dengan warna merah beramaran pada setiap kad KDS untuk perhatian tukang masak.
            </p>
          </div>
        `;

      case 5:
        return `
          <div class="animate-fade-in">
            <h3 style="color: var(--primary); margin-bottom: 12px;">🧾 Langkah 5: Cetakan Resit Rasmi (A4, 80mm, 58mm) & PDF</h3>
            <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
              Sistem menyediakan modul penjana resit profesional dengan logo rasmi Politeknik METrO Tasek Gelugor, alamat rasmi, dan format cetakan terma.
            </p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
              <div style="line-height: 1.6; font-size: 0.9rem;">
                <h4 style="margin-bottom: 10px;">Panduan Cetakan & PDF:</h4>
                <ol style="padding-left: 20px; display: flex; flex-direction: column; gap: 10px;">
                  <li>Selepas pembeli membuat bayaran, tetingkap Resit Rasmi akan muncul secara automatik (atau tekan <strong>🧾 Resit</strong> di modul Tempahan).</li>
                  <li>Di bahagian atas toolbar resit, pilih Format Cetakan yang dikehendaki:
                    <ul style="padding-left: 20px; margin-top: 4px;">
                      <li><strong>📄 A4 Document</strong>: Cetakan dokumen bersaiz penuh A4.</li>
                      <li><strong>🖨️ Thermal 80mm</strong>: Untuk pencetak terma resit 80mm.</li>
                      <li><strong>🖨️ Thermal 58mm</strong>: Untuk pencetak terma resit 58mm.</li>
                    </ul>
                  </li>
                  <li>Tekan <strong>🖨️ Cetak Resit</strong> untuk mencetak secara terus tanpa sebarang pemotongan atau `clipping`.</li>
                  <li>Tekan <strong>📥 Muat Turun PDF</strong> untuk menyimpan fail `.pdf` resit ke dalam peranti anda.</li>
                </ol>
              </div>

              <div style="background: rgba(37,99,235,0.04); border: var(--card-border); padding: 20px; border-radius: var(--radius-md);">
                <h4 style="color: var(--primary); margin-bottom: 10px;">Ciri Header Resit PMTG:</h4>
                <ul style="font-size: 0.85rem; line-height: 1.6; display: flex; flex-direction: column; gap: 6px;">
                  <li>✅ Logo Rasmi Politeknik METrO Tasek Gelugor (`assets/logo.png`)</li>
                  <li>✅ Alamat Rasmi: <strong>Tasek Gelugor, Penang</strong></li>
                  <li>✅ No. Telefon: <strong>04-573 2000</strong></li>
                  <li>✅ Email: <strong>info@pmtg.edu.my</strong></li>
                  <li>✅ Pecahan Item, Nota, SST (0%), dan Jumlah Keseluruhan</li>
                </ul>
              </div>
            </div>
          </div>
        `;

      case 6:
        return `
          <div class="animate-fade-in">
            <h3 style="color: var(--primary); margin-bottom: 12px;">📊 Langkah 6: Laporan Analitis Jualan & Eksport Excel (CSV)</h3>
            <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
              Analisis prestasi jualan perniagaan dengan keupayaan mengeksport laporan ke format Microsoft Excel.
            </p>

            <div style="line-height: 1.6; font-size: 0.9rem;">
              <h4 style="margin-bottom: 10px;">Langkah Menjana & Mengeksport Laporan:</h4>
              <ol style="padding-left: 20px; display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                <li>Pilih modul <strong>Laporan Jualan</strong> daripada Sidebar.</li>
                <li>Gunakan menu drop-down untuk memilih tempoh laporan: <em>Laporan Harian</em>, <em>Laporan Mingguan</em>, <em>Laporan Bulanan</em>, atau <em>Laporan Tahunan</em>.</li>
                <li>Semak metrik KPI seperti Jumlah Pendapatan (RM), Bilangan Tempahan, Purata Nilai Pesanan, dan Menu Paling Laris.</li>
                <li>Tekan <strong>📥 Eksport Excel (CSV)</strong> untuk memuat turun fail `.csv` yang boleh dibuka menggunakan Microsoft Excel, Google Sheets, atau LibreOffice.</li>
                <li>Tekan <strong>🖨️ Cetak Laporan</strong> untuk mencetak salinan fizikal laporan jualan.</li>
              </ol>
            </div>
          </div>
        `;

      case 7:
        return `
          <div class="animate-fade-in">
            <h3 style="color: var(--primary); margin-bottom: 12px;">🤖 Langkah 7: Interaksi Pembantu AI (AI Data Assistant)</h3>
            <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
              Pembantu AI terbina dalam sistem bersambung secara terus ke pangkalan data untuk menjawab soalan perniagaan anda secara automatik.
            </p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div style="line-height: 1.6; font-size: 0.9rem;">
                <h4 style="margin-bottom: 10px;">Cara Membuka & Menggunakan AI Assistant:</h4>
                <ol style="padding-left: 20px; display: flex; flex-direction: column; gap: 8px;">
                  <li>Tekan butang ikon robot <strong>🤖</strong> di penjuru atas kanan header atau di tetingkap terapung bottom-right.</li>
                  <li>Tetingkap perbualan AI akan terbuka.</li>
                  <li>Anda boleh menekan soalan praset seperti:
                    <ul style="padding-left: 20px; margin-top: 4px;">
                      <li><em>"Apakah menu paling laris minggu ini?"</em></li>
                      <li><em>"Berapakah jualan hari ini?"</em></li>
                      <li><em>"Cadangkan menu untuk bajet RM25."</em></li>
                    </ul>
                  </li>
                  <li>Atau taip soalan tersendiri dalam Bahasa Melayu. AI akan menganalisis data pesanan semasa dan memberikan jawapan berasaskan rekod sebenar database!</li>
                </ol>
              </div>

              <div style="background: rgba(37,99,235,0.05); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--primary);">
                <h5 style="color: var(--primary); margin-bottom: 8px;">💬 Contoh Jawapan AI:</h5>
                <div style="background: #fff; padding: 12px; border-radius: 8px; font-size: 0.85rem; line-height: 1.4; color: #000;">
                  🤖 <strong>Menu Paling Laris</strong>: <strong>Nasi Lemak Ayam Goreng Berempah</strong> dengan jumlah terjual 142 unit! Mengikuti rapat di tempat kedua ialah <strong>Char Kuey Teow Basah Udang</strong> (185 unit).
                </div>
              </div>
            </div>
          </div>
        `;

      default:
        return `<p>Pilih langkah dari tab di atas.</p>`;
    }
  }
}

const manualModule = new ManualModule();
window.manualModule = manualModule;
