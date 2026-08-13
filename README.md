# Syabab Al-Burdah — Sistem Informasi Penjadwalan Maulid Burdah

Website resmi untuk penjadwalan kegiatan **Maulid Burdah** selama 40 hari, dikelola oleh
**Syabab Al-Burdah**. Dibangun dengan **Next.js (TypeScript)** dan database **SQLite (SQL murni,
tanpa ORM)** — sehingga ringan, cepat, dan tidak butuh server database terpisah.

## ✨ Fitur

**Untuk pengunjung/jamaah (publik, tanpa login):**
- Beranda: pengenalan apa itu Maulid Burdah, asal usul Qasidah Burdah, visi & misi grup
- Halaman **Jadwal 40 Hari** yang update **real-time** (jam berjalan, hitung mundur ke jadwal
  berikutnya, dan auto-refresh data setiap 30 detik)
- Galeri kegiatan (foto-foto dokumentasi)
- Halaman Informasi (info tambahan & kontak sekretariat)
- **Tidak ada form pendaftaran publik** — sesuai permintaan, hanya admin yang boleh mengisi data
  jadwal (alamat, tuan rumah, dll)

**Untuk admin (login diperlukan):**
- Login aman (password di-hash dengan bcrypt, sesi memakai JWT httpOnly cookie)
- Kelola Jadwal: tambah/edit/hapus jadwal 40 hari (tanggal, waktu, tuan rumah, alamat,
  penanggung jawab, status)
- Kelola Galeri: unggah/hapus foto kegiatan
- Pengaturan Web: edit teks "Apa itu Maulid Burdah", asal usul, visi, misi, info tambahan,
  dan kontak — tanpa perlu mengubah kode
- Ganti password admin

## 🧱 Teknologi

- **Next.js 14** (App Router) + **TypeScript**
- **better-sqlite3** — database SQLite dengan **SQL murni** (tanpa ORM)
- **Tailwind CSS** — tampilan islami, hijau-emas, responsif
- **jose** (JWT) + **bcryptjs** — otentikasi admin

---

## 🚀 Cara Menjalankan (Instalasi)

### 1. Prasyarat
- Node.js versi **18 atau lebih baru** (disarankan Node 20/22) — unduh di https://nodejs.org
- NPM (sudah termasuk saat instal Node.js)

### 2. Ekstrak & masuk ke folder proyek
```bash
cd syabab-al-burdah
```

### 3. Salin file environment
Salin `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Lalu buka file `.env` dan **ganti** nilai berikut sebelum dipakai secara serius:
- `JWT_SECRET` — isi dengan teks acak yang panjang & rahasia (untuk enkripsi sesi login)
- `ADMIN_USERNAME` & `ADMIN_PASSWORD` — username & password admin default (hanya dipakai saat
  database dibuat pertama kali / belum ada data admin sama sekali)

### 4. Instal dependensi
```bash
npm install
```
Database SQLite beserta seluruh tabel, akun admin default, dan 40 baris jadwal template akan
**otomatis dibuat** saat aplikasi pertama kali dijalankan (tidak perlu perintah migrasi manual).

### 5. Jalankan mode pengembangan (development)
```bash
npm run dev
```
Buka **http://localhost:3000** di browser.

### 6. Jalankan untuk produksi (hosting)
```bash
npm run build
npm run start
```
Secara default aplikasi berjalan di port 3000. Untuk mengganti port:
```bash
npm run start -- -p 8080
```

---

## 🔐 Login Admin

Setelah `npm install`/`npm run dev` pertama kali dijalankan, cek terminal — akan muncul log seperti:
```
[SEED] Akun admin dibuat -> username: admin | password: Burdah@2026
```
Gunakan kredensial tersebut (atau sesuai `.env` Anda) untuk login di:
```
http://localhost:3000/admin/login
```

**⚠️ PENTING:** Segera ganti password default melalui menu **Pengaturan Web → Ganti Password
Admin** setelah login pertama kali, terutama sebelum website di-hosting untuk umum.

Halaman `/admin/dashboard` **otomatis terkunci** — pengunjung yang belum login akan dialihkan ke
halaman login. Jamaah publik tidak memerlukan akun sama sekali untuk melihat jadwal.

---

## 🗂️ Struktur Proyek Singkat

```
src/
  app/                 -> Semua halaman & API (Next.js App Router)
    page.tsx           -> Beranda
    jadwal/             -> Halaman jadwal publik (real-time)
    galeri/             -> Halaman galeri publik
    info/               -> Halaman informasi publik
    admin/login/         -> Login admin
    admin/dashboard/     -> Panel admin (dilindungi middleware)
    api/                -> Route handler (jadwal, galeri, pengaturan, auth, upload)
  components/          -> Komponen React (Navbar, Footer, JadwalRealtime, dsb)
  lib/
    db.ts               -> Koneksi SQLite + skema SQL + auto-seed data awal
    auth.ts              -> Util JWT & sesi admin
    types.ts             -> Tipe TypeScript
  middleware.ts        -> Proteksi rute /admin/dashboard
data/                  -> File database SQLite (dibuat otomatis, jangan dihapus manual)
public/uploads/        -> Tempat penyimpanan foto galeri yang diunggah admin
```

## 🗄️ Tentang Database

Database memakai **SQLite** (`better-sqlite3`) dengan **SQL mentah** — bukan ORM — sehingga
mudah dipahami dan diaudit. File database tersimpan di `data/syabab-albudah.db` dan dibuat
otomatis saat aplikasi pertama kali start. Tabel yang dipakai:

- `admin` — akun pengelola web
- `jadwal` — 40 hari jadwal Maulid Burdah (tanggal, waktu, tuan rumah, alamat, status, dst)
- `galeri` — dokumentasi foto kegiatan
- `pengaturan` — konten dinamis situs (tentang, asal usul, visi misi, kontak)

Jika ingin memindahkan data lama saat migrasi hosting, cukup salin folder `data/` dan
`public/uploads/` ke server baru.

## 🌐 Menghosting Website

Aplikasi ini adalah aplikasi **Node.js** biasa (bukan static site), sehingga bisa dihosting di
layanan yang mendukung Node.js seperti VPS, atau layanan Node hosting. Langkah umum di server:

```bash
npm install
cp .env.example .env   # lalu isi JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD
npm run build
npm run start
```
Gunakan process manager seperti **PM2** agar aplikasi tetap berjalan di background:
```bash
npm install -g pm2
pm2 start npm --name "syabab-albudah" -- start
pm2 save
```
Lalu arahkan domain Anda ke port aplikasi (biasanya lewat reverse proxy Nginx).

## 🛠️ Kustomisasi Cepat

- Semua teks (Apa itu Maulid Burdah, asal usul, visi, misi, info tambahan, kontak) bisa diedit
  langsung dari **Panel Admin → Pengaturan Web**, tanpa menyentuh kode.
- Tanggal mulai program (Hari ke-1 dari 40 hari) juga diatur di halaman yang sama.
- Warna tema islami (hijau & emas) dapat diubah di `tailwind.config.ts`.

---

Dibuat untuk **Syabab Al-Burdah** — semoga menjadi sarana kebaikan dan syiar cinta kepada
Rasulullah shallallahu 'alaihi wasallam. 🤍
