import { db } from "@/lib/db";
import type { Jadwal } from "@/lib/types";
import JadwalRealtime from "@/components/JadwalRealtime";

// Memaksa Next.js untuk mematikan semua jenis cache di halaman ini
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

async function getJadwal(): Promise<Jadwal[]> {
  const result = await db.execute("SELECT * FROM jadwal ORDER BY hari_ke ASC");
  return (result.rows as unknown as Jadwal[]) || [];
}

export default async function JadwalPage() {
  const jadwal = await getJadwal();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
      <div className="text-center">
        <p className="section-eyebrow">Real-time</p>
        <h1 className="section-title mt-2 text-white">Jadwal Maulid Burdah 40 Hari</h1>
        <p className="mx-auto mt-3 max-w-2xl text-emerald-100/80 leading-relaxed">
          Jadwal berikut diperbarui langsung oleh panitia. Silakan periksa secara berkala — tidak
          diperlukan pendaftaran untuk melihat jadwal.
        </p>
      </div>

      <div className="mt-10">
        <JadwalRealtime initialJadwal={jadwal} />
      </div>
    </div>
  );
}