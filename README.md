# Pembukuan & Gudang (V2) — Multichannel Sales & Dropship Inventory Tracker

![Angular Version](https://img.shields.io/badge/Angular-18.2.0-DD0031?style=flat-square&logo=angular)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=flat-square&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.0-3178C6?style=flat-square&logo=typescript)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4.0-FF6384?style=flat-square&logo=chartdotjs)

Aplikasi internal berbasis web (Frontend Mockup) untuk bisnis jualan online multichannel di Indonesia dengan model bisnis **Dropship**, **Pencairan Marketplace**, **Pengelolaan Stok Barang Batal/Retur**, dan **Kalkulasi Bagi Hasil Pekerja/CS**.

---

## 📌 Fitur Utama & Keunggulan Bisnis

1. **Model Dropship & Otomasi Stok Gudang:**
   - Stok fisik gudang tidak dibeli di awal, melainkan **lahir dari transaksi batal, gagal kirim, atau retur** di mana barang terlanjur dibeli dari supplier. Sistem secara otomatis mencatat dan mengalihkan barang ini menjadi stok gudang yang siap dijual ulang.
2. **Kalkulasi Dua Angka Profit (Estimasi vs Realisasi):**
   - **Profit Estimasi:** `Harga Jual Total - Harga Beli Total` (muncul saat order baru dibuat).
   - **Profit Realisasi:** `Besaran Pencairan Marketplace - Harga Beli Total` (baru dihitung saat pencairan dicatat; nilainya yang menjadi dasar utama pembagian hasil CS).
3. **Pencairan Lintas Bulan (*Orderan Juni Cair Gabung Juli*):**
   - Transaksi order bulan sebelumnya yang dana marketplace-nya baru dicairkan di bulan berjalan otomatis dihitung ke **Bagi Hasil pada bulan pencairan masuk**.
4. **Perhitungan Bagi Hasil CS Transparan:**
   - Laba Bersih CS dihitung murni dari Profit Realisasi dikurangi 4 pengeluaran CS (`Gudang`, `Iklan`, `Kode Flip`, `Admin BCA`), kemudian dihitung persentase & target bulanan per CS.
5. **Simulasi Hak Akses Role Switcher:**
   - Switcher role di header (`Owner`, `Supervisor`, `Customer Service Bayu`) yang secara langsung mengubah hak akses, filter data, dan tombol aksi di seluruh aplikasi.

---

## 🖥️ Ringkasan 4 Layar Utama

- **1. Dashboard Utama (`/dashboard`):** 4 Kartu KPI (Omzet, Profit Realisasi, Dana Belum Cair, Perlu Perhatian), Grafik Dual-Line Tren 30 Hari (Order vs Pencairan), Top 5 Produk Terlaris, dan Ringkasan Kinerja CS.
- **2. Penjualan Marketplace (`/penjualan`):** Form input penjualan cepat dengan **Autocomplete Produk**, **Qty Terpisah**, live profit summary, dan menu aksi status transaksi (Catat Pencairan, Gagal Kirim → Stok, Retur → Stok, Dibayar, Batal).
- **3. Gudang & Stok (`/gudang`):** Statistik 2 Gudang (Magelang & Semarang), chip penanda asal stok (`Gagal kirim`, `Retur`) + tooltip tanggal order, *Live Sync* dari layar penjualan, serta modal mutasi & jual dari stok.
- **4. Target & Bagi Hasil CS (`/target-cs`):** Perhitungan Laba Bersih CS, persentase komisi & target, status transfer Owner, tabel pencairan lintas bulan, dan master skema bagi hasil.
- **Menu Terkunci (`/segera-hadir`):** Halaman placeholder rapi untuk 8 menu roadmap tahap berikutnya.

---

## 💻 Tech Stack & Arsitektur

- **Framework:** Angular 18 (Standalone Components API, tanpa `NgModule`)
- **State Management:** Angular Signals (`signal`, `computed`) via `AppStateService`
- **Styling:** Tailwind CSS (Palet presisi: `#FAFAF8`, `#1A1D23`, aksen teal `#0F6E56`, merah `#B4231F`, amber `#B45309`)
- **Grafik:** Chart.js 4.x HTML5 Canvas Integration
- **Tipografi:** Inter Google Font (`font-variant-numeric: tabular-nums` untuk angka finansial)

---

## 🛠️ Petunjuk Penggunaan untuk Developer

### **1. Prasyarat Sistem**
- Node.js `v18.0.0` / `v20.0.0` / `v24.0.0`
- npm `v9.0.0` atau lebih baru

### **2. Instalasi Dependensi**
```bash
git clone https://github.com/npaujiana/sales-inventory-tracker.git
cd sales-inventory-tracker-v2
npm install
```

### **3. Jalankan Server Lokal (Development)**
```bash
npm start
```
*atau*
```bash
npx ng serve
```
Akses di browser melalui: `http://localhost:4200/`

### **4. Build untuk Produksi**
```bash
npm run build
```
*atau*
```bash
npx ng build
```
Hasil bundel static file akan berada di folder `dist/sales-inventory-tracker` dan siap di-deploy ke server Nginx, Vercel, atau Netlify.

---

## 📁 Struktur Direktori Utama

```
sales-inventory-tracker-v2/
├── src/
│   ├── app/
│   │   ├── components/       # Header, Sidebar
│   │   ├── data/             # Static Mock Data Generator (~350 Transaksi)
│   │   ├── models/           # TypeScript Models & Interfaces
│   │   ├── pages/            # Dashboard, Penjualan, Gudang, TargetCS, SegeraHadir
│   │   ├── services/         # AppStateService (Central Signal Store)
│   │   ├── utils/            # Formatters (Rupiah, Tanggal ID, Badge Colors)
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── index.html
│   └── styles.css            # Tailwind Directives & Custom Scrollbar
├── angular.json
├── DOKUMENTASI_DEMO.md       # Panduan Penjelasan Bisnis untuk Client
├── tailwind.config.js
└── README.md
```

---

## 📄 Dokumentasi Bisnis & Client
Untuk penjelasan operasional bisnis tanpa istilah teknis yang ditujukan bagi calon client atau owner bisnis, silakan merujuk pada file [DOKUMENTASI_DEMO.md](file:///c:/Users/USER/Documents/project-pribadi/sales-inventory-tracker-v2/DOKUMENTASI_DEMO.md).
