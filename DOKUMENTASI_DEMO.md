# DOKUMENTASI & PANDUAN BISNIS
## Sistem Pembukuan & Gudang (V2) — Multichannel Dropship & Profit Sharing

> **Tujuan Dokumen:** Panduan penjelasan operasional bisnis untuk calon client/owner. Dokumen ini berfokus 100% pada **alur kerja bisnis**, **efisiensi operasional**, dan **transparansi keuangan** tanpa istilah teknis software.

---

## 📌 1. Latar Belakang & Solusi Operasional Bisnis

Aplikasi ini dibangun untuk menggantikan pencatatan spreadsheet manual yang rumit menjadi **sistem otomatis yang rapi, cepat, dan presisi**. Sistem ini secara khusus menjawab 5 kebutuhan utama operasional jualan online:

### **1. Model Dropship & Stok Gudang Otomatis**
- Pada bisnis ini, modal awal tidak dihabiskan untuk membeli stok fisik. Barang baru dibeli dari supplier setelah ada order dari pembeli.
- **Bagaimana stok gudang terbentuk?** Stok gudang lahir dari orderan yang batal atau gagal kirim padahal barang sudah terlanjur dibeli dari supplier. Sistem secara otomatis mencatat dan mengalihkan barang tersebut menjadi stok gudang agar siap dijual kembali.

### **2. Kepastian Dua Angka Profit (Estimasi vs Realisasi)**
- **Profit Estimasi (Saat Order Masuk):**  
  $$\text{Profit Estimasi} = \text{Harga Jual} - \text{Harga Beli}$$  
  Menjadi acuan awal keuntungan saat transaksi baru terjadi.
- **Profit Realisasi (Saat Pencairan Marketplace):**  
  $$\text{Profit Realisasi} = \text{Nominal Pencairan Masuk} - \text{Harga Beli}$$  
  Merupakan keuntungan nyata yang diterima di rekening setelah dipotong biaya penanganan marketplace. Nilai ini yang menjadi dasar utama pembagian hasil.

### **3. Pencairan Lintas Bulan (Gabungan Bulan)**
- Transaksi order yang terjadi di akhir bulan (misalnya bulan Juni) sering kali baru dicairkan oleh marketplace di awal bulan berikutnya (bulan Juli). Dalam sistem ini, pencairan tersebut otomatis dihitung masuk ke **Bagi Hasil pada bulan pencairan masuk**, meniru persis lembar *"Orderan Juni Cair Gabung Juli"* pada pencatatan manual.

### **4. Transparansi Bagi Hasil Customer Service (CS)**
- Perhitungan bagi hasil tiap pekerja/CS dihitung murni dari **Profit Realisasi** yang dikurangi 4 kategori pengeluaran operasional CS:
  1. **Biaya Gudang**
  2. **Biaya Iklan**
  3. **Biaya Kode Flip**
  4. **Biaya Admin BCA**
- Sistem secara otomatis menghitung laba bersih CS, mengecek pencapaian target bulanan, dan menampilkan angka hak bagi hasil yang siap ditransfer oleh Owner.

### **5. Kontrol Internal Berbasis Role Pekerja**
- **Owner (Pemilik Rekening Pusat):** Memiliki akses penuh untuk melihat seluruh data, melakukan koreksi, dan mengonfirmasi transfer bagi hasil.
- **Supervisor:** Memiliki akses pengawasan untuk memantau kinerja seluruh CS secara real-time tanpa opsi mengubah data.
- **Customer Service (CS):** Hanya dapat menginput dan melihat transaksi miliknya sendiri untuk menjaga privasi antar pekerja.

---

## 🖥️ 2. Panduan Alur Kerja 4 Layar Utama

---

### 📊 Layar 1 — Dashboard Utama
Layar kontrol utama bagi Owner dan Supervisor untuk memantau kesehatan bisnis harian:

- **Kartu Ringkasan Kinerja:**
  - **Omzet Order Bulan Ini:** Total penjualan berjalan beserta pembanding % naik/turun vs bulan sebelumnya.
  - **Profit Realisasi (Kartu Utama):** Total keuntungan nyata yang sudah cair di rekening bank.
  - **Dana Belum Cair:** Total uang pembeli yang masih tertahan di marketplace beserta jumlah transaksi yang menunggu pencairan.
  - **Perlu Perhatian:** Jumlah transaksi batal atau komplain beserta nominal refund yang perlu ditindaklanjuti.
- **Grafik Tren Omzet vs Pencairan (30 Hari):**
  - Memvisualkan perbandingan antara omzet penjualan yang masuk dengan arus kas pencairan nyata yang diterima harian.
- **Analisis Produk Terlaris & Kinerja CS:**
  - Menampilkan 5 produk terlaris berdasarkan omzet dan unit terjual.
  - Menampilkan ringkasan pencapaian profit realisasi dan status progress target bagi hasil masing-masing CS.

---

### 🛒 Layar 2 — Penjualan Marketplace
Layar kerja harian CS untuk menginput transaksi baru dan memperbarui status order:

- **Pencatatan Penjualan Cepat:**
  - **Pencarian Produk Cepat:** Cukup mengetik kode SKU atau nama barang untuk memilih produk.
  - **Pemisahan Jumlah (Qty):** Jumlah barang yang dibeli dipisah sebagai kolom angka khusus sehingga harga jual dan harga beli total terhitung otomatis.
  - **Kanal Pembayaran:** Mendukung pilihan pencatatan via BCA, Flip (dilengkapi Kode Flip), atau Transfer Owner.
  - **Ringkasan Profit Otomatis:** Menampilkan harga jual, harga beli (merah minus), dan perkiraan profit secara langsung sebelum transaksi disimpan.
- **Manajemen Siklus Status Transaksi (Menu Titik Tiga):**
  - **Catat Pencairan Marketplace:** Mencatat tanggal cair dan nominal bersih yang masuk ke rekening, sehingga Profit Realisasi langsung terhitung.
  - **Tandai Gagal Kirim → Masuk Stok:** Mengubah status order gagal dan **secara otomatis memasukkan barang ke daftar stok gudang**.
  - **Tandai Retur → Masuk Stok:** Mengembalikan barang retur menjadi stok fisik yang siap dijual kembali.
  - **Tandai Dibayar / Batal (Refund) / Komplain.**

---

### 📦 Layar 3 — Gudang & Stok
Layar pemantauan inventaris fisik barang yang tersimpan di gudang:

- **Ringkasan Gudang:** Menampilkan total unit dan jumlah jenis barang yang tersimpan di Gudang Utama Magelang dan Gudang Semarang.
- **Informasi Asal Stok:** Setiap barang di dalam tabel dilengkapi dengan label penanda asal stok, seperti `Gagal Kirim (3)` atau `Retur (1)`, lengkap dengan tanggal transaksi asalnya saat diarahkan oleh kursor.
- **Peringatan Stok Menipis:** Barang dengan jumlah unit sedikit ($\le$ 3 unit) otomatis diberi warna penanda agar pengelola dapat memprioritaskan penjualannya.
- **Interaksi Stok:** Menyediakan tombol untuk mencatat penjualan langsung dari stok atau mencatat mutasi pemindahan barang antar gudang.

---

### 🎯 Layar 4 — Target & Bagi Hasil CS
Layar khusus perhitungan profit sharing dan transparansi komisi pekerja:

- **Rincian Perhitungan Laba Bersih & Bagi Hasil:**
  - Menampilkan Profit Realisasi CS dikurangi rincian 4 pengeluaran (`Gudang`, `Iklan`, `Kode Flip`, `Admin BCA`) untuk mendapatkan **Laba Bersih CS**.
  - Membandingkan Laba Bersih CS terhadap target bulanan (apabila ada target).
  - Menampilkan **Nominal Hak Bagi Hasil (Warna Hijau, Ukuran Besar)** sesuai persentase skema yang berlaku.
- **Status Transfer Owner:**
  - Menampilkan penanda apakah komisi bulan tersebut `Sudah Ditransfer` beserta tanggal transfernya, atau menyediakan tombol konfirmasi transfer bagi Owner.
- **Pencairan Lintas Bulan:**
  - Menyajikan tabel khusus transaksi bulan sebelumnya yang baru cair di bulan ini, memastikan tidak ada komisi CS yang terlewat.
- **Tabel Skema Bagi Hasil:**
  - Menampilkan aturan jenjang persentase komisi dan target bulanan yang berlaku untuk setiap CS.

---

## 🔒 3. Tahap Pengembangan Selanjutnya (Roadmap)

Untuk menjaga fokus operasional pada 4 layar utama di atas, menu pendukung lainnya telah disiapkan di sidebar sebagai roadmap tahap berikutnya:

1. **Produk Dropship & Gudang** (Katalog produk & supplier acuan)
2. **Daftar Supplier** (Kontak & histori pembelian supplier)
3. **Penjualan Gudang & Stok** (Pencatatan khusus penjualan dari stok batal)
4. **Mutasi Stok** (Histori kepindahan barang antar gudang)
5. **Pembukuan** (Jurnal umum & kas)
6. **Hutang / Piutang** (Pencatatan tagihan tertunda)
7. **Laba Rugi** (Laporan keuangan lengkap bisnis)
8. **Laporan** (Cetak & analisis periodik)
