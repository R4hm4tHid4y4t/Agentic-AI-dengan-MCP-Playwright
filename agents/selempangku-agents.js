/**
 * AGENT: Agentic AI Test Suite untuk SelempangKu
 * ================================================
 * File ini berisi koleksi PROMPT siap pakai untuk Claude
 * yang menggunakan MCP Playwright sebagai browser agent.
 *
 * Cara Pakai:
 *   1. Buka Claude Code di VS Code (Ctrl+Shift+P → "Claude: Open Chat")
 *   2. Salin salah satu prompt di bawah
 *   3. Paste ke chat Claude dan tekan Enter
 *   4. Tonton Claude bekerja secara otomatis!
 *
 * Target: https://r4hid2307.alwaysdata.net/
 */

// =============================================================
// AGENT 1: EKSPLORASI & DOKUMENTASI
// =============================================================
const AGENT_EXPLORE = `
Kamu adalah Web Analyst. Gunakan playwright untuk mengeksplorasi 
website SelempangKu di https://r4hid2307.alwaysdata.net/

Tugas kamu:
1. Buka halaman utama dan ambil screenshot
2. Identifikasi semua elemen navigasi (menu, tombol, link)
3. Kunjungi setiap halaman yang bisa diakses
4. Dokumentasikan setiap halaman: URL, judul, konten utama
5. Catat semua form input yang ditemukan (nama field, tipe, placeholder)
6. Buat laporan lengkap dalam format markdown

Format laporan:
## Halaman: [Nama Halaman]
- URL: ...
- Screenshot: [ada/tidak]
- Konten: ...
- Form fields: ...
`;

// =============================================================
// AGENT 2: FUNCTIONAL TESTING
// =============================================================
const AGENT_FUNCTIONAL_TEST = `
Kamu adalah QA Engineer. Gunakan playwright untuk melakukan 
functional testing pada website SelempangKu.

URL Target: https://r4hid2307.alwaysdata.net/

Test Suite yang harus dijalankan:

TEST-001: Homepage Load
- Buka halaman utama
- Verifikasi halaman berhasil dimuat
- Ambil screenshot sebagai bukti
- Status: PASS jika halaman tampil dalam 10 detik

TEST-002: Navigasi Menu
- Klik setiap item menu yang tersedia
- Verifikasi setiap halaman bisa diakses
- Catat URL setiap halaman
- Status: PASS jika semua link berfungsi

TEST-003: Form Pemesanan (jika ada)
- Temukan form pemesanan
- Coba submit form kosong → harus ada pesan validasi
- Isi form dengan data valid → harus ada konfirmasi
- Data test: nama="Test User", item="Selempang", qty=1

TEST-004: Responsive Mobile
- Set viewport ke 375x667 (iPhone SE)
- Screenshot halaman utama
- Verifikasi layout tidak rusak

Buat laporan hasil per test dengan status PASS/FAIL/SKIP.
`;

// =============================================================
// AGENT 3: PEMESANAN OTOMATIS
// =============================================================
const AGENT_ORDER = `
Kamu adalah asisten pemesanan. Gunakan playwright untuk melakukan
pemesanan selempang di https://r4hid2307.alwaysdata.net/

Data pesanan:
- Nama pemesan: Rahmat Hidayat
- Jenis selempang: Wisuda
- Warna: Merah
- Ukuran: L (Large)
- Jumlah: 1
- Catatan: Mohon dijahit dengan rapi dan presisi

Langkah-langkah:
1. Buka halaman utama dan tunggu loading selesai
2. Cari dan klik menu/tombol pemesanan
3. Isi semua field yang diperlukan sesuai data di atas
4. Ambil screenshot sebelum submit
5. Submit form pemesanan
6. Tangkap konfirmasi atau nomor pesanan
7. Ambil screenshot final sebagai bukti pemesanan

Jika ada halaman login sebelum memesan, coba:
- username: demo / password: demo
- username: admin / password: admin
- Atau cari opsi "Pesan tanpa akun"

Laporkan nomor pesanan dan status akhir.
`;

// =============================================================
// AGENT 4: DATA SYNC ke DATABASE
// =============================================================
const AGENT_DATA_SYNC = `
Kamu adalah Data Engineer. Jalankan pipeline berikut:

STEP 1 - Extract [playwright]:
  Buka https://r4hid2307.alwaysdata.net/
  Ambil semua data produk/katalog selempang yang tersedia
  (nama, harga, varian warna, ukuran, ketersediaan)
  Screenshot halaman katalog sebagai referensi

STEP 2 - Transform:
  Susun data dalam format JSON yang terstruktur:
  {
    "produk": [...],
    "total": N,
    "timestamp": "...",
    "sumber": "https://r4hid2307.alwaysdata.net/"
  }

STEP 3 - Load [mysql-store]:
  Buat tabel jika belum ada:
  CREATE TABLE IF NOT EXISTS selempang_catalog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_produk VARCHAR(255),
    harga DECIMAL(10,2),
    warna VARCHAR(100),
    ukuran VARCHAR(50),
    tersedia BOOLEAN DEFAULT true,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  Insert data yang sudah di-extract ke tabel tersebut.

STEP 4 - Verify [mysql-store]:
  SELECT COUNT(*), MIN(scraped_at), MAX(scraped_at) 
  FROM selempang_catalog;
  
  Tampilkan hasil sebagai laporan sinkronisasi.
`;

// =============================================================
// AGENT 5: MONITORING BERKALA
// =============================================================
const AGENT_MONITORING = `
Kamu adalah Site Reliability Engineer. Gunakan playwright untuk 
monitoring website SelempangKu.

URL: https://r4hid2307.alwaysdata.net/

Cek hal-hal berikut dan buat laporan dengan format traffic light:

🟢 OK / 🟡 WARNING / 🔴 DOWN

1. AVAILABILITY CHECK
   - Apakah website bisa diakses? 
   - Response code HTTP berapa?
   
2. PERFORMANCE CHECK
   - Waktu loading halaman utama
   - 🟢 < 3 detik | 🟡 3-5 detik | 🔴 > 5 detik
   
3. CONTENT CHECK
   - Apakah konten utama tampil dengan benar?
   - Ada error JavaScript di console? 
   - Link broken?
   
4. FORM CHECK
   - Form pemesanan masih berfungsi?
   
5. VISUAL CHECK
   - Ambil screenshot halaman utama
   - Ada layout yang rusak?

Format output:
## Monitoring Report - SelempangKu
Tanggal/Waktu: [auto]
Overall Status: [🟢/🟡/🔴]

| Check | Status | Detail |
|-------|--------|--------|
...
`;

// =============================================================
// AGENT 6: GITHUB + PLAYWRIGHT INTEGRATION
// =============================================================
const AGENT_GITHUB_REVIEW = `
Kamu adalah Code Reviewer & QA. Jalankan workflow:

PART 1 - Review kode GitHub:
  Lihat repository https://github.com/R4hm4tHid4y4t/PROYEK-SEMESTER-5
  Analisis struktur project di folder selempangku/
  Identifikasi: framework, dependencies, komponen utama

PART 2 - Testing deployed website dengan playwright:
  Buka https://r4hid2307.alwaysdata.net/
  Verifikasi bahwa website deployed sesuai dengan kode di GitHub
  
  Cek konsistensi:
  - Fitur yang ada di kode → apakah muncul di website?
  - Bug yang terlihat di UI → kemungkinan ada di file mana?
  
PART 3 - Buat laporan:
  ## Code Review + Live Testing Report
  
  ### Struktur Project
  ...
  
  ### Temuan dari Live Testing
  ...
  
  ### Rekomendasi Perbaikan
  ...
`;

module.exports = {
  AGENT_EXPLORE,
  AGENT_FUNCTIONAL_TEST,
  AGENT_ORDER,
  AGENT_DATA_SYNC,
  AGENT_MONITORING,
  AGENT_GITHUB_REVIEW
};