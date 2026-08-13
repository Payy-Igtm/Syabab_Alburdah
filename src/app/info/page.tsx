import { db } from "@/lib/db";
import type { Pengaturan, InfoTambahanItem } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getPengaturan(): Promise<Pengaturan> {
  const result = await db.execute("SELECT * FROM pengaturan WHERE id = 1");
  return (result.rows[0] as unknown as Pengaturan) || ({} as Pengaturan);
}

// Helper ikon disesuaikan menggunakan ID agar lebih akurat
const getIcon = (id: string) => {
  switch (id) {
    case "sekretariat":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.069-3.769-6.665-6.665l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      );
    case "email":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      );
    case "instagram":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      );
    case "facebook":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
        </svg>
      );
    default:
      return null;
  }
};

export default async function InfoPage() {
  const p = await getPengaturan();
  const infoTambahan: InfoTambahanItem[] = JSON.parse(p.info_tambahan || "[]");

  // Format nomor WA dari database, atau gunakan nomor Hilal sebagai default
  const waNumber = p.no_whatsapp || "0882 2940 1370";
  // Menghapus spasi dan mengubah awalan 0 menjadi 62 untuk link wa.me
  const waClean = waNumber.replace(/\D/g, "");
  const waLink = waClean.startsWith("0") ? `62${waClean.slice(1)}` : waClean;

  // Array kontak dengan penambahan URL link
  const kontak = [
    { 
      id: "sekretariat", 
      label: "Sekretariat", 
      value: p.alamat_sekretariat || "Sekretariat Syabab Al-Burdah", 
      href: null // Alamat tidak berupa link
    },
    { 
      id: "whatsapp", 
      label: "WhatsApp (Hilal)", 
      value: waNumber, 
      href: `https://wa.me/${waLink}` // Link menuju WA
    },
    { 
      id: "email", 
      label: "Email", 
      value: p.email, 
      href: p.email ? `mailto:${p.email}` : null 
    },
    { 
      id: "instagram", 
      label: "Instagram", 
      value: p.instagram, 
      href: p.instagram ? `https://instagram.com/${p.instagram.replace("@", "")}` : null 
    },
    { 
      id: "facebook", 
      label: "Facebook", 
      value: p.facebook, 
      href: p.facebook ? p.facebook : null 
    },
  ].filter((k) => k.value);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24 text-white">
      
      {/* HEADER SECTION */}
      <div className="text-center">
        <span className="section-eyebrow">
          Pusat Informasi
        </span>
        <h1 className="mt-6 font-display text-4xl font-extrabold text-white md:text-5xl">Informasi Lainnya</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-emerald-100/80">
          Hal-hal penting yang perlu diketahui jamaah seputar penyelenggaraan Maulid Burdah {p.nama_grup}.
        </p>
      </div>

      {/* INFO CARDS (FAQ STYLE) */}
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {infoTambahan.map((item, i) => (
          <div 
            key={i} 
            className="group relative overflow-hidden rounded-3xl border border-emerald-800/80 bg-emerald-950/40 p-8 shadow-xl backdrop-blur-md transition-all hover:-translate-y-1 hover:border-amber-500/40"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-white">{item.judul}</h3>
            <p className="mt-3 leading-relaxed text-emerald-100/80">{item.isi}</p>
          </div>
        ))}

        {infoTambahan.length === 0 && (
          <div className="md:col-span-2 rounded-3xl border border-dashed border-emerald-800/80 bg-emerald-950/40 p-12 text-center text-emerald-300/70">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-emerald-600 mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Belum ada informasi tambahan saat ini.
          </div>
        )}
      </div>

      {/* CONTACT SECTION (GLASSMORPHISM DARK) */}
      <div className="relative mt-20 overflow-hidden rounded-[2.5rem] bg-emerald-950/60 border border-emerald-800/80 px-6 py-16 shadow-2xl backdrop-blur-xl md:px-12 md:py-20">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/10 blur-[80px]"></div>
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-emerald-600/15 blur-[80px]"></div>
        <div className="pattern-bg absolute inset-0 opacity-10 mix-blend-overlay"></div>

        <div className="relative z-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">Hubungi Kami</p>
          <h2 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl">Kontak &amp; Sekretariat</h2>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-amber-500"></div>
        </div>

        <div className="relative z-10 mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
          {kontak.map((k) => {
            const CardWrapper = k.href ? "a" : "div";
            const linkProps = k.href ? { href: k.href, target: "_blank", rel: "noreferrer" } : {};

            return (
              <CardWrapper 
                key={k.id} 
                {...linkProps}
                className={`group flex items-center gap-5 rounded-2xl border border-emerald-800/80 bg-[#011b15]/80 p-5 backdrop-blur-md transition-all hover:border-amber-500/50 hover:bg-emerald-950 ${k.href ? 'cursor-pointer hover:-translate-y-1' : ''}`}
              >
                {/* Ikon Box */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 transition-transform duration-300 group-hover:scale-110">
                  {getIcon(k.id)}
                </div>
                
                {/* Teks Box */}
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/70">{k.label}</p>
                    {k.href && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
                        <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-white md:text-base leading-snug break-words">
                    {k.value}
                  </p>
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </div>

    </div>
  );
}