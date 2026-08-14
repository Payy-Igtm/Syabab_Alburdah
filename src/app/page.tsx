import Link from "next/link";
import { db } from "@/lib/db";
import type { Pengaturan, Jadwal } from "@/lib/types";
import IslamicParticles from "@/components/IslamicParticles";
import IslamicOrnaments from "@/components/IslamicOrnaments";
import CountUp from "@/components/CountUp";

export const dynamic = "force-dynamic"; 
export const fetchCache = "default-cache";
export const revalidate = 10; // Dioptimalkan agar halaman terbuka instan namun tetap sinkron

async function getPengaturan(): Promise<Pengaturan> {
  const result = await db.execute("SELECT * FROM pengaturan WHERE id = 1");
  return (result.rows[0] as unknown as Pengaturan) || ({} as Pengaturan);
}

async function getRingkasanJadwal() {
  const total = 40; // Total hari program selalu ditetapkan 40 hari

  // Menghitung jumlah hari unik (hari_ke) yang sudah terisi tuan rumahnya
  const terisiRes = await db.execute(
    "SELECT DISTINCT hari_ke FROM jadwal WHERE tuan_rumah <> '' AND tuan_rumah IS NOT NULL"
  );
  const terisi = terisiRes.rows.length;

  const berikutnyaRes = await db.execute(
    "SELECT * FROM jadwal WHERE date(tanggal) >= date('now') ORDER BY date(tanggal) ASC LIMIT 1"
  );
  const berikutnya = (berikutnyaRes.rows[0] as unknown as Jadwal) || undefined;

  return { total, terisi, berikutnya };
}

export default async function HomePage() {
  const p = await getPengaturan();
  const misi: string[] = JSON.parse(p.misi || "[]");
  const { total, terisi, berikutnya } = await getRingkasanJadwal();

  const mulai = p.tanggal_mulai_program ? new Date(p.tanggal_mulai_program) : new Date();
  const hariIni = new Date();
  const selisihHari = Math.floor(
    (new Date(hariIni.toDateString()).getTime() - new Date(mulai.toDateString()).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const hariKeSekarang = selisihHari + 1;
  const sedangBerlangsung = hariKeSekarang >= 1 && hariKeSekarang <= 40;

  return (
    <div className="pattern-bg relative min-h-screen overflow-hidden">
      
      {/* LAPISAN CAHAYA AMBIENT (BACKGROUND) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 right-0 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute -bottom-32 -left-20 h-[500px] w-[500px] rounded-full bg-emerald-600/15 blur-[120px]" />
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-32">
        {/* Logo Latar Belakang */}
        <img
          src="/logo.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 rounded-full object-cover opacity-[0.03] md:block"
        />
        
        <IslamicParticles />
        <IslamicOrnaments />
        
        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:items-center md:px-6">
          
          {/* Kolom Kiri: Teks & Tombol */}
          <div>
            <p className="section-eyebrow">{p.nama_grup}</p>
            <h1 className="section-title mt-4 text-4xl md:text-5xl lg:text-6xl">
              {p.tagline || "Menghidupkan Cinta Rasulullah Melalui Lantunan Burdah"}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-emerald-100/80 font-medium">
              Ikuti penjadwalan Maulid Burdah selama 40 hari secara real-time. Jamaah dapat melihat
              lokasi, waktu, dan penanggung jawab majelis setiap harinya tanpa perlu mendaftar.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/jadwal" className="btn btn-gold px-8 py-3.5 text-base">
                Lihat Jadwal 40 Hari
              </Link>
              <Link href="/info" className="btn btn-secondary px-8 py-3.5 text-base">
                Informasi Lengkap
              </Link>
            </div>

            {sedangBerlangsung && (
              <div className="mt-10 inline-flex items-center gap-3 rounded-full bg-emerald-950/50 border border-amber-500/30 px-5 py-2.5 text-sm shadow-lg backdrop-blur-md">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                <span className="text-white font-medium">
                  Saat ini program Maulid Burdah memasuki{" "}
                  <span className="font-extrabold text-amber-400">Hari ke-{hariKeSekarang} dari 40</span>
                </span>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Kotak Ringkasan */}
          <div className="rounded-[2.5rem] border border-emerald-800/50 bg-emerald-950/40 p-7 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/30 transition-colors">
            <div className="absolute -right-10 -top-10 h-32 w-32 bg-amber-500/10 rounded-full blur-2xl"></div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-300/80">Ringkasan Program</p>
            
            <div className="mt-5 grid grid-cols-2 gap-4">
              <StatBox label="Total Hari" numeric={40} />
              <StatBox label="Jadwal Terisi" value={`${terisi}/${total}`} />
              <StatBox
                label="Hari Berjalan"
                numeric={sedangBerlangsung ? hariKeSekarang : undefined}
                value={sedangBerlangsung ? undefined : hariKeSekarang > 40 ? "Selesai" : "Belum Mulai"}
              />
              <StatBox label="Mulai Program" value={mulai.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })} />
            </div>

            {berikutnya && (
              <div className="mt-6 rounded-2xl border border-emerald-800/60 bg-[#011b15]/80 p-5 text-white shadow-inner relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-emerald-900/40 to-transparent"></div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Jadwal Terdekat</p>
                <p className="mt-2 font-display text-xl font-bold leading-tight relative z-10 text-white">
                  Hari ke-{berikutnya.hari_ke} &middot;{" "}
                  {new Date(berikutnya.tanggal).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                  })}
                </p>
                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-100/90 relative z-10">
                  <span className="text-amber-400">📍</span>
                  <span className="font-medium">{berikutnya.tuan_rumah || "Tuan rumah belum ditentukan"}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-emerald-100/90 relative z-10">
                  <span className="text-amber-400">⏰</span>
                  <span className="font-medium">Pukul {berikutnya.waktu} WIB</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TENTANG MAULID BURDAH */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <p className="section-eyebrow">Mengenal Tradisi</p>
            <h2 className="section-title mt-4">Apa itu Maulid Burdah?</h2>
            <p className="mt-4 text-lg leading-relaxed text-emerald-100/80">{p.tentang_burdah}</p>
          </div>
          <div>
            <p className="section-eyebrow">Sejarah Singkat</p>
            <h2 className="section-title mt-4">Asal Usul Qasidah Burdah</h2>
            <p className="mt-4 text-lg leading-relaxed text-emerald-100/80">{p.asal_usul}</p>
          </div>
        </div>
      </section>

      {/* VISI MISI */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center">
            <p className="section-eyebrow">Komitmen Kami</p>
            <h2 className="section-title mt-4">Visi &amp; Misi {p.nama_grup}</h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-5">
            <div className="rounded-3xl border border-emerald-800/60 bg-emerald-950/40 p-8 shadow-xl backdrop-blur-md md:col-span-2 hover:border-amber-500/40 transition-colors">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 text-2xl border border-amber-500/20 shadow-inner">
                ✦
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Visi</h3>
              <p className="mt-4 text-lg leading-relaxed text-emerald-100/80">{p.visi}</p>
            </div>

            <div className="rounded-3xl border border-emerald-800/60 bg-emerald-950/40 p-8 shadow-xl backdrop-blur-md md:col-span-3 hover:border-amber-500/40 transition-colors">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-900/60 text-amber-400 text-2xl font-bold border border-emerald-700/60 shadow-inner">
                ✓
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Misi</h3>
              <ul className="mt-4 space-y-4">
                {misi.map((m, i) => (
                  <li key={i} className="flex gap-4 text-emerald-100/80 items-start text-lg">
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-400 border border-amber-500/20">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-emerald-950/60 backdrop-blur-xl border border-emerald-800/80 px-8 py-16 text-center text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-[#011b15]/80 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-bold md:text-4xl text-white">
              Pantau Jadwal Majelis Setiap Hari
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100/80 leading-relaxed">
              Jadwal diperbarui langsung oleh panitia. Jamaah cukup membuka halaman jadwal untuk
              melihat lokasi dan waktu majelis terkini — tanpa perlu registrasi.
            </p>
            <Link href="/jadwal" className="btn btn-gold mt-8 px-8 py-4 text-base shadow-lg shadow-amber-500/20">
              Buka Halaman Jadwal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatBox({ label, value, numeric }: { label: string; value?: string; numeric?: number }) {
  return (
    <div className="rounded-2xl border border-emerald-800/60 bg-[#011b15]/80 p-4 transition-all hover:border-amber-500/50 hover:bg-[#011b15]">
      <p className="text-xs font-bold text-emerald-400/80">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-amber-400 drop-shadow-sm">
        {numeric !== undefined ? <CountUp value={numeric} /> : value}
      </p>
    </div>
  );
}