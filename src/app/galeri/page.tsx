import { db } from "@/lib/db";
import type { Galeri } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getGaleri(): Promise<Galeri[]> {
  const result = await db.execute("SELECT * FROM galeri ORDER BY created_at DESC");
  return (result.rows as unknown as Galeri[]) || [];
}

export default async function GaleriPage() {
  const galeri = await getGaleri();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24 text-white">
      <div className="text-center">
        <span className="section-eyebrow">Dokumentasi</span>
        <h1 className="section-title mt-4 text-white">Galeri Kegiatan</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-emerald-100/80">
          Kumpulan dokumentasi kegiatan Maulid Burdah yang telah dilaksanakan, diperbarui secara
          berkala oleh panitia.
        </p>
      </div>

      {galeri.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-emerald-800/80 bg-emerald-950/40 p-14 text-center text-emerald-300/70 backdrop-blur-md">
          Belum ada dokumentasi kegiatan yang ditambahkan.
        </div>
      ) : (
        <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {galeri.map((g) => (
            <div
              key={g.id}
              className="group mb-6 break-inside-avoid overflow-hidden rounded-3xl border border-emerald-800/80 bg-emerald-950/40 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.gambar_url} alt={g.judul} className="w-full object-cover bg-[#011b15] transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="p-5">
                <p className="font-display text-base font-bold text-white tracking-wide">{g.judul}</p>
                {g.tanggal_kegiatan && (
                  <p className="mt-1 text-xs text-amber-400 font-medium">
                    {new Date(g.tanggal_kegiatan).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
                {g.deskripsi && <p className="mt-2.5 text-sm text-emerald-100/80 leading-relaxed">{g.deskripsi}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}