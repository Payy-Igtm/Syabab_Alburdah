import { db } from "@/lib/db";
import type { Jadwal } from "@/lib/types";
import JadwalManager from "@/components/JadwalManager";

export const dynamic = "force-dynamic";

async function getJadwal(): Promise<Jadwal[]> {
  const result = await db.execute("SELECT * FROM jadwal ORDER BY hari_ke ASC");
  return (result.rows as unknown as Jadwal[]) || [];
}

export default async function AdminJadwalPage() {
  const jadwal = await getJadwal();

  return (
    <div className="space-y-6 text-emerald-100">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Kelola Jadwal</h1>
        <p className="mt-1 text-sm text-emerald-300/70">
          Isi tuan rumah, alamat, dan waktu untuk setiap hari. Perubahan langsung terlihat oleh
          jamaah di halaman Jadwal.
        </p>
      </div>
      <div>
        <JadwalManager initialJadwal={jadwal} />
      </div>
    </div>
  );
}