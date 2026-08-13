import Link from "next/link";

export default function Footer({
  namaGrup = "Syabab Alburdah",
  alamatSekretariat,
  noWhatsapp = "0882 2940 1370",
  email,
  instagram = "@syabab_alburdah",
}: {
  namaGrup?: string;
  alamatSekretariat?: string;
  noWhatsapp?: string;
  email?: string;
  instagram?: string;
}) {
  return (
    <footer className="pattern-bg relative mt-20 border-t border-emerald-800/80 bg-emerald-950 text-emerald-100">
      {/* Efek gradient shadow di bagian atas footer untuk kesan elegan */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-12 md:grid-cols-12">
          
          {/* Kolom 1: Info Grup (Lebih Lebar) */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-amber-400/30 bg-[#04100c] shadow-lg shadow-amber-500/10">
                <img src="/logo.jpg" alt={namaGrup} className="h-full w-full object-cover" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-white tracking-wide">{namaGrup}</h2>
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">Majelis Sholawat</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-emerald-200/80">
              Menghidupkan dan melestarikan tradisi Maulid Burdah sebagai wasilah cinta kepada
              Rasulullah shallallahu &apos;alaihi wasallam, sekaligus mempererat ukhuwah islamiyah
              antar jamaah.
            </p>
          </div>

          {/* Kolom 2: Tautan Cepat */}
          <div className="md:col-span-3 md:col-start-7">
            <h3 className="font-display text-lg font-bold text-white">Tautan Jelajah</h3>
            <div className="mt-4 h-1 w-12 rounded bg-amber-500"></div>
            <ul className="mt-5 space-y-3 text-sm text-emerald-200/80">
              {[
                { name: "Beranda", path: "/" },
                { name: "Jadwal 40 Hari", path: "/jadwal" },
                { name: "Galeri Kegiatan", path: "/galeri" },
                { name: "Informasi", path: "/info" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.path} 
                    className="group flex items-center gap-2 transition-colors hover:text-amber-400"
                  >
                    <span className="text-amber-400/0 transition-all group-hover:text-amber-400">▹</span>
                    <span className="-ml-3 transition-all group-hover:ml-0">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak & Sosmed */}
          <div className="md:col-span-3">
            <h3 className="font-display text-lg font-bold text-white">Hubungi Kami</h3>
            <div className="mt-4 h-1 w-12 rounded bg-amber-500"></div>
            <ul className="mt-5 space-y-4 text-sm text-emerald-200/80">
              
              {/* Alamat */}
              {alamatSekretariat && (
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="leading-relaxed">{alamatSekretariat}</span>
                </li>
              )}

              {/* WhatsApp Contact */}
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a 
                  href="https://wa.me/6288229401370" 
                  target="_blank" 
                  rel="noreferrer"
                  className="transition-colors hover:text-amber-400"
                >
                  +62 882-2940-1370 (Kang Hilal)
                </a>
              </li>

              {/* Instagram Contact */}
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <a 
                  href="https://instagram.com/syabab_alburdah" 
                  target="_blank" 
                  rel="noreferrer"
                  className="transition-colors hover:text-amber-400"
                >
                  @syabab_alburdah
                </a>
              </li>

            </ul>
          </div>
        </div>

        {/* Bagian Bawah / Copyright & Credits */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-emerald-800/60 pt-8 text-center md:flex-row md:text-left">
          <p className="text-xs text-emerald-300/70">
            &copy; {new Date().getFullYear()} {namaGrup}. Dibuat dengan penuh cinta untuk syiar Maulid Burdah. Supported by MUI Kel. Sukabungah dan seluruh jajaran Rukun Warga.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-300/70">
            <span>Presented by</span>
            <span className="font-semibold text-amber-400 tracking-wide">
              Tim Creative Adz Media
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}