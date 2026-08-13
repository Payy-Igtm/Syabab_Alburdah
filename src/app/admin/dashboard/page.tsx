import Link from "next/link";
import { db } from "@/lib/db";
import type { Jadwal } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const totalJadwalRes = await db.execute("SELECT COUNT(*) as c FROM jadwal");
  const totalJadwal = Number(totalJadwalRes.rows[0]?.c || 0);

  const terisiRes = await db.execute("SELECT COUNT(*) as c FROM jadwal WHERE tuan_rumah <> ''");
  const terisi = Number(terisiRes.rows[0]?.c || 0);

  const belumTerisi = totalJadwal - terisi;

  const totalGaleriRes = await db.execute("SELECT COUNT(*) as c FROM galeri");
  const totalGaleri = Number(totalGaleriRes.rows[0]?.c || 0);

  const mendatangRes = await db.execute(
    "SELECT * FROM jadwal WHERE date(tanggal) >= date('now') ORDER BY date(tanggal) ASC LIMIT 5"
  );
  const mendatang = (mendatangRes.rows as unknown as Jadwal[]) || [];

  return (
    <div className="space-y-8 text-emerald-100">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Ringkasan</h1>
        <p className="mt-1 text-sm text-emerald-300/70">
          Kelola jadwal, galeri, dan konten situs Maulid Burdah dari sini.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Hari Jadwal" value={totalJadwal} color="amber" />
        <StatCard label="Jadwal Terisi" value={terisi} color="amber" />
        <StatCard label="Belum Diisi" value={belumTerisi} color="red" />
        <StatCard label="Foto Galeri" value={totalGaleri} color="amber" />
      </div>

      <div className="rounded-3xl border border-emerald-800/80 bg-emerald-950/40 p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">Jadwal Mendatang</h2>
          <Link href="/admin/dashboard/jadwal" className="text-sm font-medium text-amber-400 hover:underline">
            Kelola semua &rarr;
          </Link>
        </div>

        {mendatang.length === 0 ? (
          <p className="mt-4 text-sm text-emerald-300/70">Tidak ada jadwal mendatang.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm text-emerald-100">
              <thead>
                <tr className="border-b border-emerald-800/80 text-xs uppercase text-emerald-300/70">
                  <th className="py-3 pr-4">Hari</th>
                  <th className="py-3 pr-4">Tanggal</th>
                  <th className="py-3 pr-4">Tuan Rumah</th>
                  <th className="py-3 pr-4">Alamat</th>
                  <th className="py-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/60">
                {mendatang.map((j) => (
                  <tr key={j.id} className="transition-colors hover:bg-emerald-900/30">
                    <td className="py-3.5 pr-4 font-bold text-white">Ke-{j.hari_ke}</td>
                    <td className="py-3.5 pr-4 text-emerald-300/70 text-xs whitespace-nowrap">
                      {new Date(j.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 pr-4 text-white font-semibold">{j.tuan_rumah || <em className="text-emerald-700 font-normal">Belum diisi</em>}</td>
                    <td className="py-3.5 pr-4 text-emerald-300/70 text-xs">{j.alamat || <em className="text-emerald-700">-</em>}</td>
                    <td className="py-3.5 pr-4 capitalize">
                      <span className="badge badge-terjadwal">{j.status || "Kosong"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <QuickLink href="/admin/dashboard/jadwal" title="Input & Edit Jadwal" desc="Atur tuan rumah, alamat, dan waktu setiap hari." />
        <QuickLink href="/admin/dashboard/galeri" title="Unggah Galeri" desc="Tambah dokumentasi foto kegiatan terbaru." />
        <QuickLink href="/admin/dashboard/pengaturan" title="Edit Konten Web" desc="Ubah profil, visi misi, dan kontak." />
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: "amber" | "red" }) {
  const colorClass = color === "amber" ? "text-amber-400" : "text-red-400";
  return (
    <div className="rounded-3xl border border-emerald-800/80 bg-emerald-950/40 p-5 shadow-xl backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-widest text-emerald-300/70 font-bold">{label}</p>
      <p className={`mt-1 font-display text-3xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

function QuickLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="group rounded-3xl border border-emerald-800/80 bg-emerald-950/40 p-5 shadow-xl backdrop-blur-md transition-all hover:-translate-y-1 hover:border-amber-500/50">
      <p className="font-display font-bold text-white group-hover:text-amber-400 transition-colors">{title}</p>
      <p className="mt-1 text-xs text-emerald-300/70 leading-relaxed">{desc}</p>
    </Link>
  );
}