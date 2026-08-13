import { db } from "@/lib/db";
import type { Galeri } from "@/lib/types";
import GaleriManager from "@/components/GaleriManager";

export const dynamic = "force-dynamic";

async function getGaleri(): Promise<Galeri[]> {
  const result = await db.execute("SELECT * FROM galeri ORDER BY created_at DESC");
  return (result.rows as unknown as Galeri[]) || [];
}

export default async function AdminGaleriPage() {
  const galeri = await getGaleri();

  return (
    <div className="space-y-6 text-emerald-100">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Kelola Galeri</h1>
        <p className="mt-1 text-sm text-emerald-300/70">
          Unggah dokumentasi kegiatan agar tampil di halaman Galeri publik.
        </p>
      </div>
      <div className="mt-6">
        <GaleriManager initialGaleri={galeri} />
      </div>
    </div>
  );
}