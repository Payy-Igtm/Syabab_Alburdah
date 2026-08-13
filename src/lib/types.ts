export type StatusJadwal = "terjadwal" | "berlangsung" | "selesai" | "dibatalkan";

export interface Jadwal {
  id: number;
  hari_ke: number;
  tanggal: string; // YYYY-MM-DD
  waktu: string; // HH:MM
  tuan_rumah: string;
  alamat: string;
  penanggung_jawab?: string;
  kontak_pj?: string;
  catatan: string;
  status: StatusJadwal;
  created_at: string;
  updated_at: string;
}

export interface Galeri {
  id: number;
  judul: string;
  deskripsi: string;
  gambar_url: string;
  tanggal_kegiatan: string | null;
  created_at: string;
}

export interface InfoTambahanItem {
  judul: string;
  isi: string;
}

export interface Pengaturan {
  id: number;
  nama_grup: string;
  tagline: string;
  tentang_burdah: string;
  asal_usul: string;
  visi: string;
  misi: string; // JSON string array
  tanggal_mulai_program: string;
  alamat_sekretariat: string;
  no_whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  info_tambahan: string; // JSON string of InfoTambahanItem[]
  updated_at: string;
}

export interface AdminSession {
  id: number;
  username: string;
  nama: string;
}