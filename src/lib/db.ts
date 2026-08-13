import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error("TURSO_DATABASE_URL is not defined");
}

export const db = createClient({
  url,
  authToken,
});

/* ------------------------------------------------------------------ */
/*  INISIALISASI & SEED DATABASE (Asinkron untuk Turso)               */
/* ------------------------------------------------------------------ */

export async function initializeDatabase() {
  // Skema Tabel Admin
  await db.execute(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      nama TEXT NOT NULL DEFAULT 'Admin',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Skema Tabel Jadwal
  await db.execute(`
    CREATE TABLE IF NOT EXISTS jadwal (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hari_ke INTEGER NOT NULL,
      tanggal TEXT NOT NULL,          -- format YYYY-MM-DD
      waktu TEXT NOT NULL DEFAULT '20:00', -- format HH:MM
      tuan_rumah TEXT NOT NULL DEFAULT '',
      alamat TEXT NOT NULL DEFAULT '',
      penanggung_jawab TEXT NOT NULL DEFAULT '',
      kontak_pj TEXT NOT NULL DEFAULT '',
      catatan TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'terjadwal', -- terjadwal | berlangsung | selesai | dibatalkan
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_jadwal_hari_ke ON jadwal(hari_ke);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_jadwal_tanggal ON jadwal(tanggal);`);

  // Skema Tabel Galeri
  await db.execute(`
    CREATE TABLE IF NOT EXISTS galeri (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      judul TEXT NOT NULL,
      deskripsi TEXT NOT NULL DEFAULT '',
      gambar_url TEXT NOT NULL,
      tanggal_kegiatan TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Skema Tabel Pengaturan
  await db.execute(`
    CREATE TABLE IF NOT EXISTS pengaturan (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      nama_grup TEXT NOT NULL DEFAULT 'Syabab Al-Burdah',
      tagline TEXT NOT NULL DEFAULT '',
      tentang_burdah TEXT NOT NULL DEFAULT '',
      asal_usul TEXT NOT NULL DEFAULT '',
      visi TEXT NOT NULL DEFAULT '',
      misi TEXT NOT NULL DEFAULT '[]',      -- JSON array string
      tanggal_mulai_program TEXT NOT NULL, -- YYYY-MM-DD, hari ke-1
      alamat_sekretariat TEXT NOT NULL DEFAULT '',
      no_whatsapp TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      instagram TEXT NOT NULL DEFAULT '',
      facebook TEXT NOT NULL DEFAULT '',
      info_tambahan TEXT NOT NULL DEFAULT '[]', -- JSON array of {judul, isi}
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Seed Admin
  const adminRes = await db.execute("SELECT COUNT(*) as c FROM admin");
  const adminCount = Number(adminRes.rows[0]?.c ?? 0);
  if (adminCount === 0) {
    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "Burdah@2026";
    const hash = bcrypt.hashSync(password, 10);
    await db.execute({
      sql: "INSERT INTO admin (username, password_hash, nama) VALUES (?, ?, ?)",
      args: [username, hash, "Administrator Syabab Al-Burdah"],
    });
    console.log(`[SEED] Akun admin dibuat -> username: ${username} | password: ${password}`);
  }

  // Seed Pengaturan
  const pengaturanRes = await db.execute("SELECT COUNT(*) as c FROM pengaturan");
  const pengaturanCount = Number(pengaturanRes.rows[0]?.c ?? 0);
  if (pengaturanCount === 0) {
    const today = new Date();
    const tanggalMulai = today.toISOString().slice(0, 10);

    const misi = JSON.stringify([
      "Menghidupkan dan melestarikan tradisi pembacaan Maulid Burdah di tengah masyarakat.",
      "Mempererat ukhuwah islamiyah antar jamaah melalui kegiatan rutin bermajelis.",
      "Menanamkan kecintaan kepada Rasulullah shallallahu 'alaihi wasallam sejak usia muda.",
      "Menyelenggarakan penjadwalan majelis yang tertib, transparan, dan mudah diakses jamaah.",
      "Membina generasi muda (syabab) agar aktif dalam syiar dan dakwah islamiyah.",
    ]);

    const infoTambahan = JSON.stringify([
      {
        judul: "Apa yang perlu dibawa jamaah?",
        isi: "Jamaah cukup membawa Kitab Burdah/blangko bacaan (jika punya) dan hadir dengan hati yang bersih. Panitia akan menyediakan teks bacaan bagi yang belum memiliki.",
      },
      {
        judul: "Ketentuan tuan rumah",
        isi: "Tuan rumah yang mendapat giliran cukup menyiapkan tempat yang layak. Konsumsi bersifat sunnah/sukarela dan tidak memberatkan.",
      },
      {
        judul: "Kontak Panitia",
        isi: "Untuk informasi lebih lanjut mengenai jadwal atau ingin bergabung dalam majelis, silakan hubungi kontak yang tertera pada halaman Informasi.",
      },
    ]);

    await db.execute({
      sql: `INSERT INTO pengaturan
        (id, nama_grup, tagline, tentang_burdah, asal_usul, visi, misi, tanggal_mulai_program, alamat_sekretariat, no_whatsapp, email, instagram, facebook, info_tambahan)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "Syabab Al-Burdah",
        "Menghidupkan Cinta Rasulullah Melalui Lantunan Burdah",
        "Maulid Burdah adalah tradisi pembacaan Qasidah Burdah, sebuah syair pujian agung kepada Nabi Muhammad shallallahu 'alaihi wasallam karya Imam Al-Bushiri...",
        "Qasidah Burdah digubah oleh Imam Syarafuddin Al-Bushiri pada abad ke-13 M di Mesir...",
        "Menjadi wadah silaturahmi dan syiar islam yang menghidupkan kecintaan kepada Rasulullah SAW...",
        misi,
        tanggalMulai,
        "Sekretariat Syabab Al-Burdah",
        "",
        "",
        "",
        "",
        infoTambahan,
      ],
    });
    console.log("[SEED] Data pengaturan awal berhasil dibuat.");
  }

  // Seed Jadwal (40 Hari)
  const jadwalRes = await db.execute("SELECT COUNT(*) as c FROM jadwal");
  const jadwalCount = Number(jadwalRes.rows[0]?.c ?? 0);
  if (jadwalCount === 0) {
    const pengaturanProg = await db.execute("SELECT tanggal_mulai_program FROM pengaturan WHERE id = 1");
    
    // BAGIAN YANG DIPERBAIKI: Menambahkan "unknown"
    const rowProg = pengaturanProg.rows[0] as unknown as { tanggal_mulai_program: string } | undefined;
    
    const start = rowProg ? new Date(rowProg.tanggal_mulai_program) : new Date();

    for (let i = 0; i < 40; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const tanggalStr = d.toISOString().slice(0, 10);
      await db.execute({
        sql: `INSERT INTO jadwal (hari_ke, tanggal, waktu, tuan_rumah, alamat, penanggung_jawab, kontak_pj, catatan, status)
              VALUES (?, ?, '20:00', '', '', '', '', '', 'terjadwal')`,
        args: [i + 1, tanggalStr],
      });
    }
    console.log("[SEED] 40 baris jadwal awal (template) berhasil dibuat.");
  }
}