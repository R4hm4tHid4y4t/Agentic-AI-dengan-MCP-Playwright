# 🤖 Agentic AI dengan MCP Playwright
## Sistem Informasi Pemesanan Selempang (SelempangKu)

Panduan lengkap membangun **Agentic AI** yang mampu berinteraksi otomatis dengan website SelempangKu menggunakan **MCP Playwright** di VS Code dengan Claude.

> **Target Website:** https://r4hid2307.alwaysdata.net/  
> **Repository GitHub:** https://github.com/R4hm4tHid4y4t/PROYEK-SEMESTER-5  
> **Referensi Roadmap:** Programmer Zaman Now · roadmap.sh · Agentic Workflows

---

## 📋 Daftar Isi

1. [Apa itu MCP Playwright?](#apa-itu-mcp-playwright)
2. [Arsitektur Agentic AI](#arsitektur-agentic-ai)
3. [Prasyarat](#prasyarat)
4. [Instalasi & Konfigurasi](#instalasi--konfigurasi)
5. [Konfigurasi MCP Lengkap](#konfigurasi-mcp-lengkap)
6. [Contoh Prompt Agentic](#contoh-prompt-agentic)
7. [Skenario Otomasi SelempangKu](#skenario-otomasi-selempangku)
8. [Integrasi dengan GitHub](#integrasi-dengan-github)
9. [Troubleshooting](#troubleshooting)

---

## Apa itu MCP Playwright?

**MCP (Model Context Protocol)** adalah standar terbuka dari Anthropic yang memungkinkan AI Agent terhubung ke tools eksternal. **Playwright** adalah library browser automation dari Microsoft.

Kombinasi keduanya → **AI Agent yang bisa mengontrol browser seperti manusia**:

```
Claude (AI) ←→ MCP Playwright Server ←→ Browser (Chromium/Firefox/WebKit)
                                              ↕
                               https://r4hid2307.alwaysdata.net/
```

### Kemampuan Playwright MCP

| Aksi | Deskripsi | Contoh |
|------|-----------|--------|
| `navigate` | Buka URL | Buka halaman login SelempangKu |
| `screenshot` | Ambil tangkapan layar | Lihat tampilan halaman |
| `click` | Klik elemen | Klik tombol "Pesan Sekarang" |
| `fill` | Isi form | Input nama, alamat, jenis selempang |
| `select` | Pilih dropdown | Pilih jenis/warna selempang |
| `wait` | Tunggu elemen muncul | Tunggu konfirmasi pesanan |
| `evaluate` | Jalankan JavaScript | Ambil data dari DOM |
| `get_text` | Ambil teks elemen | Baca daftar produk |

---

## Arsitektur Agentic AI

```
┌─────────────────────────────────────────────────────────┐
│                    CLAUDE (AI Agent)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │  Reasoning  │  │  Planning   │  │    Tool Use     │ │
│  │  (ReAct)    │  │  Multi-step │  │  Function Call  │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
└──────────────────────────┬──────────────────────────────┘
                           │ MCP Protocol
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│   Playwright │  │  MySQL MCP   │  │   MongoDB MCP    │
│   MCP Server │  │   (northwind)│  │  (northwind)     │
│  (Browser)   │  │  Port 3306   │  │  172.29.88.203   │
└──────┬───────┘  └──────────────┘  └──────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│    https://r4hid2307.alwaysdata.net/ │
│         SelempangKu Website          │
│                                      │
│  [Login] [Katalog] [Pesan] [Status]  │
└──────────────────────────────────────┘
```

### ReAct Pattern (Reasoning + Acting)

```
User: "Pesan selempang wisuda ukuran L warna merah untuk Rahmat"

Claude berpikir (Reasoning):
  1. Perlu buka website SelempangKu
  2. Navigasi ke halaman pemesanan
  3. Isi form: nama, ukuran, warna
  4. Submit dan ambil nomor pesanan

Claude bertindak (Acting):
  → playwright: navigate("https://r4hid2307.alwaysdata.net/")
  → playwright: screenshot() [lihat halaman]
  → playwright: click("#btn-pesan")
  → playwright: fill("#nama", "Rahmat")
  → playwright: select("#ukuran", "L")
  → playwright: select("#warna", "merah")
  → playwright: click("#submit-order")
  → playwright: get_text("#order-confirmation")
```

---

## Prasyarat

### 1. Node.js & npm
```bash
node --version   # v18.0.0+ direkomendasikan
npm --version    # v9+
```
Download: https://nodejs.org

### 2. VS Code dengan Extension Claude
- Buka VS Code
- Install extension **"Claude Code"** dari Anthropic
- Atau gunakan Claude Code via terminal: `npm install -g @anthropic-ai/claude-code`

### 3. Playwright MCP Server
```bash
# Install Playwright MCP Server (Official dari Microsoft/Playwright team)
npm install -g @playwright/mcp

# Verifikasi instalasi
playwright-mcp --version

# Install browser dependencies
npx playwright install chromium
npx playwright install-deps chromium
```

### 4. Clone Repository SelempangKu
```bash
git clone https://github.com/R4hm4tHid4y4t/PROYEK-SEMESTER-5.git
cd PROYEK-SEMESTER-5
code .
```

---

## Instalasi & Konfigurasi

### Langkah 1 — Clone & Buka di VS Code
```bash
git clone https://github.com/R4hm4tHid4y4t/PROYEK-SEMESTER-5.git
cd PROYEK-SEMESTER-5
code .
```

### Langkah 2 — Install Semua Dependencies
```bash
# Install Playwright MCP
npm install -g @playwright/mcp

# Install browser engine
npx playwright install chromium

# Install dependencies project (jika ada)
cd selempangku
npm install
```

### Langkah 3 — Buat File Konfigurasi MCP
Buat file `.vscode/mcp.json` di root project (lihat bagian berikutnya).

### Langkah 4 — Buka Claude Code di VS Code
```
Ctrl+Shift+P → ketik "Claude: Open Chat" → Enter
```

### Langkah 5 — Mulai Berinteraksi dengan AI Agent!

---

## Konfigurasi MCP Lengkap

Buat file `.vscode/mcp.json` dengan konfigurasi berikut:

```json
{
  "servers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp", "--browser", "chromium"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "false"
      }
    },
    "playwright-headless": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "@playwright/mcp",
        "--browser", "chromium",
        "--headless"
      ]
    },
    "mongodb-store": {
      "type": "stdio",
      "command": "mongodb-mcp-server",
      "env": {
        "MDB_MCP_CONNECTION_STRING": "mongodb://172.29.88.203:27017/northwind"
      }
    },
    "mysql-store": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@benborla29/mcp-server-mysql"],
      "env": {
        "MYSQL_HOST": "127.0.0.1",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "root",
        "MYSQL_PASS": "",
        "MYSQL_DB": "northwind",
        "ALLOW_INSERT_OPERATION": "true",
        "ALLOW_UPDATE_OPERATION": "true",
        "ALLOW_DELETE_OPERATION": "true"
      }
    },
    "mysql-products": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@benborla29/mcp-server-mysql"],
      "env": {
        "MYSQL_HOST": "127.0.0.1",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "root",
        "MYSQL_PASS": "",
        "MYSQL_DB": "db_products",
        "ALLOW_INSERT_OPERATION": "true",
        "ALLOW_UPDATE_OPERATION": "true",
        "ALLOW_DELETE_OPERATION": "true"
      }
    },
    "mongodb-products": {
      "type": "stdio",
      "command": "mongodb-mcp-server",
      "env": {
        "MDB_MCP_CONNECTION_STRING": "mongodb://localhost:27017/northwind"
      }
    },
    "elasticsearch-products": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@elastic/mcp-server-elasticsearch"],
      "env": {
        "ELASTICSEARCH_URL": "http://172.29.88.203:9200",
        "ELASTICSEARCH_USERNAME": "elastic",
        "ELASTICSEARCH_PASSWORD": "elastic"
      }
    }
  }
}
```

### Penjelasan Konfigurasi Playwright

| Parameter | Nilai | Keterangan |
|-----------|-------|------------|
| `command` | `npx` | Jalankan via npx (auto-download) |
| `args[0]` | `@playwright/mcp` | Package Playwright MCP official |
| `--browser` | `chromium` | Engine browser yang digunakan |
| `--headless` | _(opsional)_ | Jalankan tanpa tampilan visual |
| `PLAYWRIGHT_HEADLESS` | `false` | Lihat browser bekerja (debug mode) |

> **Tips:** Gunakan `playwright` (bukan headless) saat development agar bisa melihat AI bekerja. Gunakan `playwright-headless` untuk otomasi production.

---

## Contoh Prompt Agentic

### 🔍 Eksplorasi Website

```
Gunakan playwright, buka https://r4hid2307.alwaysdata.net/ 
dan buat laporan lengkap tentang:
- Struktur halaman (header, menu, konten)
- Fitur yang tersedia
- Form input yang ada
- Tombol aksi yang bisa diklik
Ambil screenshot setiap halaman yang kamu kunjungi.
```

---

```
Gunakan playwright untuk menjelajahi seluruh navigasi di 
SelempangKu (r4hid2307.alwaysdata.net). Dokumentasikan 
semua URL halaman yang bisa diakses beserta fungsinya.
```

### 📝 Pengisian Form Pemesanan

```
Gunakan playwright untuk melakukan simulasi pemesanan selempang di 
https://r4hid2307.alwaysdata.net/ dengan data:
- Nama pemesan: "Rahmat Hidayat"
- Jenis: Selempang Wisuda
- Warna: Merah
- Ukuran: L
- Catatan: "Mohon dijahit rapi"
Ambil screenshot saat mengisi form dan setelah submit.
```

### 🧪 Testing Otomatis

```
Gunakan playwright, lakukan pengujian lengkap form pemesanan 
di SelempangKu dengan test case:
1. Test input valid → harapkan berhasil
2. Test input kosong → harapkan muncul pesan error
3. Test karakter spesial di nama → cek validasi
4. Test ukuran tidak dipilih → cek error handling
Buat laporan hasil testing dalam format tabel.
```

### 📊 Monitoring & Scraping Data

```
Gunakan playwright, ambil semua data produk selempang yang 
tersedia di https://r4hid2307.alwaysdata.net/ termasuk:
- Nama produk, harga, warna yang tersedia, ukuran
Lalu gunakan mysql-store untuk menyimpan data tersebut 
ke tabel "selempang_products" di database northwind.
```

### 🔄 Workflow Multi-Agent (Cross-Tool)

```
Jalankan workflow berikut menggunakan kombinasi MCP servers:
1. [playwright] Buka SelempangKu, ambil daftar pesanan terbaru
2. [mysql-store] Simpan data pesanan ke tabel orders di northwind
3. [playwright] Screenshot halaman konfirmasi
4. [mysql-store] Update status pesanan menjadi "diproses"
5. [playwright] Ambil screenshot final sebagai bukti
```

---

## Skenario Otomasi SelempangKu

### Skenario 1: Audit Website Otomatis

```
Kamu adalah QA Engineer. Gunakan playwright untuk melakukan 
audit lengkap website SelempangKu (r4hid2307.alwaysdata.net):

Audit Checklist:
□ Semua link dapat dibuka (tidak 404)
□ Form pemesanan memiliki validasi yang benar
□ Halaman responsive di viewport mobile (375px)
□ Pesan error user-friendly
□ Proses pemesanan berjalan end-to-end

Ambil screenshot untuk setiap item checklist.
Buat laporan audit dalam format markdown.
```

---

### Skenario 2: Regression Testing Setelah Deploy

```
Setelah push kode baru ke GitHub (R4hm4tHid4y4t/PROYEK-SEMESTER-5),
gunakan playwright untuk menjalankan regression test:

1. Buka https://r4hid2307.alwaysdata.net/
2. Verifikasi halaman utama load dengan benar (screenshot)
3. Coba fitur pemesanan dengan data dummy
4. Verifikasi konfirmasi muncul
5. Cek halaman riwayat pesanan

Jika ada error, tangkap screenshot dan catat pesan errornya.
Report: PASS/FAIL per fitur.
```

---

### Skenario 3: Monitoring Performa

```
Gunakan playwright, ukur performa website SelempangKu:
- Waktu loading halaman utama (ms)
- Waktu response setelah submit form
- Jumlah request HTTP yang dibuat
- Ukuran total halaman (KB)

Buat perbandingan dengan threshold yang baik:
- Load time < 3 detik: ✅ GOOD
- Load time 3-5 detik: ⚠️ WARNING  
- Load time > 5 detik: ❌ SLOW
```

---

### Skenario 4: Data Extraction + Database Sync

```
Pipeline otomatis dengan multi-MCP:

Step 1 [playwright]: 
  Buka SelempangKu, extract semua data produk selempang
  (nama, harga, warna tersedia, ukuran tersedia)

Step 2 [mysql-store]:
  Cek apakah tabel "products_selempang" sudah ada di northwind
  Jika belum, buat tabel dengan kolom yang sesuai
  
Step 3 [mysql-store]:
  Insert/Update data produk hasil scraping ke database
  
Step 4 [playwright]:
  Verifikasi data dengan kembali ke website
  Bandingkan dengan data di database
  
Step 5 [mysql-store]:
  Tampilkan laporan: total produk, produk baru, produk diupdate
```

---

## Integrasi dengan GitHub

### Setup Git untuk Project SelempangKu

```bash
# Clone repository
git clone https://github.com/R4hm4tHid4y4t/PROYEK-SEMESTER-5.git
cd PROYEK-SEMESTER-5

# Buat branch untuk fitur MCP Playwright
git checkout -b feature/mcp-playwright-integration

# Tambahkan file konfigurasi MCP
mkdir -p .vscode
# Salin mcp.json ke .vscode/
git add .vscode/mcp.json
git commit -m "feat: add MCP Playwright configuration for agentic AI"

# Push ke GitHub
git push origin feature/mcp-playwright-integration
```

### Prompt untuk Git via Claude Code

```
Gunakan git untuk:
1. Cek status semua perubahan di repository PROYEK-SEMESTER-5
2. Stage file-file yang sudah dimodifikasi
3. Buat commit dengan message yang mengikuti Conventional Commits:
   "feat(mcp): add playwright automation for selempangku testing"
4. Push ke branch feature/mcp-playwright
```

---

```
Buat GitHub Actions workflow (.github/workflows/playwright-test.yml)
yang menjalankan Playwright MCP testing otomatis setiap kali ada
push ke branch main. Test harus memverifikasi:
- Website SelempangKu dapat diakses
- Form pemesanan berfungsi
- Halaman utama load dalam < 5 detik
```

---

### Workflow CI/CD dengan Playwright

```yaml
# .github/workflows/playwright-test.yml
name: Playwright E2E Tests

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install Playwright
        run: |
          npm install -g @playwright/mcp
          npx playwright install chromium
          
      - name: Run E2E Tests
        run: npx playwright test tests/selempangku.spec.js
        env:
          BASE_URL: https://r4hid2307.alwaysdata.net/
          
      - name: Upload Screenshots
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-screenshots
          path: test-results/
```

---

## Ringkasan Konfigurasi MCP Servers

| Server | Tool | Host | Status |
|--------|------|------|--------|
| `playwright` | Browser automation | chromium | 🔴 Visual |
| `playwright-headless` | Browser automation | chromium | 🟢 Headless |
| `mongodb-store` | MongoDB | 172.29.88.203:27017 | Remote |
| `mysql-store` | MySQL/northwind | 127.0.0.1:3306 | Lokal |
| `mysql-products` | MySQL/db_products | 127.0.0.1:3306 | Lokal |
| `mongodb-products` | MongoDB | localhost:27017 | Lokal |
| `elasticsearch-products` | Elasticsearch | 172.29.88.203:9200 | Remote |

---

## Troubleshooting

### ❌ "Cannot find module @playwright/mcp"

```bash
# Solusi: Install ulang secara global
npm install -g @playwright/mcp

# Verifikasi
npx @playwright/mcp --version

# Jika masih gagal, gunakan path lengkap di mcp.json:
# "command": "node",
# "args": ["/usr/local/lib/node_modules/@playwright/mcp/dist/index.js"]
```

---

### ❌ "Browser not found" / "Executable doesn't exist"

```bash
# Install browser engines
npx playwright install chromium
npx playwright install-deps

# Untuk Linux (Ubuntu):
npx playwright install --with-deps chromium
```

---

### ❌ MCP Server tidak terdeteksi di Claude

**Langkah debug:**
1. Pastikan file ada di `.vscode/mcp.json` (bukan root)
2. Validasi JSON syntax di https://jsonlint.com
3. Restart VS Code sepenuhnya (`Ctrl+Shift+P` → "Reload Window")
4. Buka Output panel → pilih "Claude Code" untuk melihat log error

---

### ❌ Website tidak bisa diakses oleh Playwright

```bash
# Test akses manual
curl -I https://r4hid2307.alwaysdata.net/

# Jika timeout, cek koneksi internet
# Website alwaysdata.net mungkin sleep mode (free tier)
# Akses manual dulu via browser untuk "wake up" server
```

---

### ❌ Screenshot kosong / halaman putih

Website SelempangKu adalah React SPA — butuh JavaScript.

```json
// Tambahkan wait time di konfigurasi:
{
  "servers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "@playwright/mcp",
        "--browser", "chromium",
        "--viewport-size", "1280,720"
      ]
    }
  }
}
```

Prompt ke Claude:
```
Gunakan playwright, buka https://r4hid2307.alwaysdata.net/
tunggu sampai halaman selesai loading (tunggu elemen #root 
atau main content muncul), lalu ambil screenshot.
```

---

## Referensi

- [Playwright MCP Official](https://github.com/microsoft/playwright-mcp)
- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Claude Code Docs](https://docs.anthropic.com/en/docs/claude-code)
- [Playwright Official Docs](https://playwright.dev)
- [Repository SelempangKu](https://github.com/R4hm4tHid4y4t/PROYEK-SEMESTER-5)
- [Website SelempangKu](https://r4hid2307.alwaysdata.net/)