import { db } from "@/lib/db";
import type { Pengaturan } from "@/lib/types";
import PengaturanManager from "@/components/PengaturanManager";

export const dynamic = "force-dynamic";

async function getPengaturan(): Promise<Pengaturan> {
  const result = await db.execute("SELECT * FROM pengaturan WHERE id = 1");
  return (result.rows[0] as unknown as Pengaturan) || ({} as Pengaturan);
}

export default async function AdminPengaturanPage() {
  const pengaturan = await getPengaturan();

  return (
    <div className="space-y-6 text-emerald-100">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Pengaturan Web</h1>
        <p className="mt-1 text-sm text-emerald-300/70">
          Ubah profil grup, visi misi, asal usul, kontak, dan keamanan akun admin.
        </p>
      </div>
      <div className="mt-6">
        <PengaturanManager initial={pengaturan} />
      </div>
    </div>
  );
}