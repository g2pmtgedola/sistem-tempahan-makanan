# PANDUAN DEPLOYMENT & HOSTING DOMAIN: pmtg.edu.my
## SISTEM TEMPAHAN MAKANAN - POLITEKNIK METRO TASEK GELUGOR

Dokumen ini memberikan panduan langkah-demi-langkah bagi Pegawai Teknologi Maklumat (IT) atau Pentadbir Sistem untuk memasukkan (deploy) **Sistem Tempahan Makanan** ke domain rasmi **pmtg.edu.my** (contoh: `https://tempahan.pmtg.edu.my` atau `https://kafeteria.pmtg.edu.my`).

---

### 📌 REKA BENTUK ARCHITECTURE SISTEM
- **Teknologi**: Pure HTML5, JavaScript Modular (ES6+), Vanilla CSS (Glassmorphism), Chart.js, HTML2PDF.
- **Pangkalan Data**: Browser Database Persistence (LocalStorage & IndexedDB Engine).
- **Format Fail**: Bersifat *Client-Side Static Web App* (Tidak memerlukan MySQL/PHP server berasingan, sangat pantas, selamat, dan tidak mudah digodam menerusi SQL Injection).

---

### 🌐 PILIHAN 1: DEPLOYMENT PADA SUBDOMAIN (REKOMENDASI UTAMA)
Disyorkan untuk menggunakan subdomain seperti **`tempahan.pmtg.edu.my`** atau **`kafeteria.pmtg.edu.my`** supaya tidak mengganggu laman web utama Politeknik.

#### Langkah 1: Tetapan DNS (Domain Name Server)
1. Log masuk ke Panel Kawalan Domain / DNS Manager `pmtg.edu.my`.
2. Tambahkan satu rekod **DNS A Record** atau **CNAME Record**:
   - **Type**: `A`
   - **Name/Host**: `tempahan` (atau `kafeteria`)
   - **IPv4 Address**: `[Masukkan IP Server Hosting anda]`
   - **TTL**: `Auto / 3600`

---

### 🖥️ PILIHAN 2: HOSTING MENGGUNAKAN cPanel / DirectAdmin / Web Hosting (Apache/Nginx)

1. Log masuk ke **cPanel** atau **Control Panel Hosting** domain `pmtg.edu.my`.
2. Pergi ke **Subdomains** -> Cipta subdomain `tempahan.pmtg.edu.my` (Folder sasaran: `public_html/tempahan`).
3. Pergi ke **File Manager** -> Buka folder `public_html/tempahan`.
4. Muat naik (*Upload*) **SEMUA** fail & folder dari direktori projek ini:
   ```
   C:\antigravity\sistem tempahan makanan\
   ├── index.html
   ├── MANUAL_PENGGUNA.html
   ├── PANDUAN_HOSTING.md
   ├── assets/
   │   ├── logo.png
   │   ├── dashboard_guide.jpg
   │   └── pos_guide.jpg
   ├── css/
   │   ├── style.css
   │   ├── receipt.css
   │   └── responsive.css
   └── js/
       ├── db.js
       ├── state.js
       ├── toast.js
       ├── auth.js
       ├── dashboard.js
       ├── menu.js
       ├── category.js
       ├── cart.js
       ├── checkout.js
       ├── orders.js
       ├── kds.js
       ├── receipt.js
       ├── customers.js
       ├── staff.js
       ├── promotions.js
       ├── reports.js
       ├── settings.js
       ├── manual.js
       ├── ai-assistant.js
       └── app.js
   ```
5. Aktifkan **SSL Certificate (HTTPS)** menerusi *Let's Encrypt* atau *AutoSSL* di cPanel supaya pautan bermula dengan `https://tempahan.pmtg.edu.my`.

---

### 🖥️ PILIHAN 3: DEPLOYMENT PADA WINDOWS SERVER (IIS - Internet Information Services)
Jika Politeknik METrO Tasek Gelugor menggunakan Pelayan Windows Server dalam persekitaran rangkaian dalaman (Intranet/LAN) atau Cloud:

1. Buka **IIS Manager** di pelayan Windows Server.
2. Pada panel kiri, klik kanan pada **Sites** -> Pilih **Add Website**.
3. Isi maklumat berikut:
   - **Site name**: `Sistem Tempahan Makanan PMTG`
   - **Physical path**: `C:\inetpub\wwwroot\tempahan` (Salin fail projek ke sini)
   - **Binding Type**: `http` / `https`
   - **Host name**: `tempahan.pmtg.edu.my`
4. Klik **OK**.
5. Pastikan kebenaran pembacaan (*Read Permissions*) diberikan kepada akaun `IUSR` atau `IIS_IUSRS`.

---

### 🐧 PILIHAN 4: DEPLOYMENT PADA LINUX SERVER (Nginx Web Server)

Konfigurasi fail `/etc/nginx/sites-available/tempahan.pmtg.edu.my`:

```nginx
server {
    listen 80;
    server_name tempahan.pmtg.edu.my;
    root /var/www/sistem-tempahan-makanan;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires max;
        log_not_found off;
    }
}
```

Kemudian aktifkan HTTPS percuma menggunakan Certbot:
```bash
sudo certbot --nginx -d tempahan.pmtg.edu.my
```

---

### 🔒 KESELAMATAN & PETUA PENGGUNAAN
1. **Penyimpanan Data**: Semua data menu, rekod tempahan, dan transaksi disimpan dengan selamat dalam storan pelayar tempatan (*Browser LocalStorage/IndexedDB*) pada setiap peranti yang digunakan.
2. **Kesesuaian Peranti**: Boleh diakses menerusi komputer Kaunter POS, iPad/Tablet Pelayan, Telefon Pintar Pelanggan, dan Skrin Dapur Chef.
3. **Domain SSL**: Pastikan protokol **HTTPS** diaktifkan supaya imbasan Kod QR DuitNow dan ciri penumpuan pelayar berjalan lancar.
