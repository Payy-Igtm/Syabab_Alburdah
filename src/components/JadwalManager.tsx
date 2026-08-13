"use client";

import { useMemo, useState } from "react";
import type { Jadwal, StatusJadwal } from "@/lib/types";

type FormState = Omit<Jadwal, "id" | "created_at" | "updated_at"> & { id?: number };

const emptyForm: FormState = {
  hari_ke: 1,
  tanggal: new Date().toISOString().slice(0, 10),
  waktu: "",
  tuan_rumah: "",
  alamat: "",
  catatan: "",
  status: "" as StatusJadwal,
};

const statusLabel: Record<string, string> = {
  "": "Jadwal Kosong",
  terjadwal: "Terjadwal",
  berlangsung: "Berlangsung",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

export default function JadwalManager({ initialJadwal }: { initialJadwal: Jadwal[] }) {
  const [jadwal, setJadwal] = useState<Jadwal[]>(initialJadwal);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...jadwal].sort((a, b) => {
      if (a.hari_ke !== b.hari_ke) return a.hari_ke - b.hari_ke;
      return (a.waktu || "").localeCompare(b.waktu || "");
    });
    if (!q) return sorted;
    return sorted.filter(
      (j) =>
        j.tuan_rumah.toLowerCase().includes(q) ||
        j.alamat.toLowerCase().includes(q) ||
        String(j.hari_ke).includes(q) ||
        j.tanggal.includes(q)
    );
  }, [jadwal, search]);

  function openEdit(j: Jadwal) {
    setForm({ ...j });
    setError("");
    setModalOpen(true);
  }

  function openCreate() {
    const lastHari = jadwal.length > 0 ? jadwal[jadwal.length - 1].hari_ke : 1;
    setForm({ ...emptyForm, hari_ke: lastHari });
    setError("");
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const isEdit = Boolean(form.id);
      const url = isEdit ? `/api/jadwal/${form.id}` : "/api/jadwal";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan jadwal.");
        setSaving(false);
        return;
      }
      if (isEdit) {
        setJadwal((prev) => prev.map((j) => (j.id === data.jadwal.id ? data.jadwal : j)));
      } else {
        setJadwal((prev) => [...prev, data.jadwal]);
      }
      setModalOpen(false);
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus jadwal ini? Tindakan tidak dapat dibatalkan.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/jadwal/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJadwal((prev) => prev.filter((j) => j.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="relative min-h-screen text-emerald-100 overflow-hidden">
      
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <input
            className="input max-w-sm"
            placeholder="Cari hari, pengundang, atau alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={openCreate} className="btn btn-primary shadow-sm">
            + Tambah Jadwal / Sesi Baru
          </button>
        </div>

        <div className="mt-6 overflow-x-auto rounded-3xl border border-emerald-800/80 bg-emerald-950/40 backdrop-blur-md shadow-xl">
          <table className="w-full min-w-[900px] text-left text-sm text-emerald-100">
            <thead className="bg-[#011b15] text-xs uppercase tracking-wider text-emerald-300/70 border-b border-emerald-800/80">
              <tr>
                <th className="px-6 py-4">Hari</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Pengundang</th>
                <th className="px-6 py-4">Alamat</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/60">
              {filtered.map((j) => {
                const isKosong = !j.tuan_rumah || (j.status as string) === "";

                return (
                  <tr key={j.id} className="transition-colors hover:bg-emerald-900/30">
                    <td className="px-6 py-4 font-bold text-white">Ke-{j.hari_ke}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-emerald-300/70">
                      {new Date(j.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-emerald-200 font-medium">
                      {j.tuan_rumah && j.waktu ? `${j.waktu} WIB` : <span className="text-emerald-700">-</span>}
                    </td>
                    <td className="px-6 py-4 text-white font-semibold">{j.tuan_rumah || <span className="text-emerald-700 font-normal">-</span>}</td>
                    <td className="px-6 py-4 text-emerald-300/70 max-w-[200px] truncate">{j.alamat || <span className="text-emerald-700">-</span>}</td>
                    <td className="px-6 py-4 font-medium">
                      <span className={`badge px-3 py-1 text-xs font-semibold ${isKosong ? "bg-emerald-900/50 text-emerald-300 border border-emerald-800/80" : "bg-amber-400/20 text-amber-400 border border-amber-400/30"}`}>
                        {isKosong ? "Jadwal Kosong" : (statusLabel[j.status] || j.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(j)} className="btn btn-secondary !px-3 !py-1.5 text-xs">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(j.id)}
                          disabled={deletingId === j.id}
                          className="btn btn-danger !px-3 !py-1.5 text-xs shadow-sm"
                        >
                          {deletingId === j.id ? "..." : "Hapus"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-emerald-700">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2.5rem] border border-emerald-800/80 bg-emerald-950 p-8 shadow-2xl text-emerald-100">
              <h3 className="font-display text-xl font-bold text-white">
                {form.id ? `Edit Jadwal Hari ke-${form.hari_ke}` : "Tambah Jadwal / Sesi Baru"}
              </h3>
              <p className="text-xs text-emerald-300/70 mt-0.5">
                Anda dapat membuat beberapa jadwal pada hari yang sama (misal: Hari ke-1 diatur dua kali untuk sesi berbeda).
              </p>

              <form onSubmit={handleSave} className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Hari ke-</label>
                    <input
                      type="number"
                      min={1}
                      className="input"
                      value={form.hari_ke}
                      onChange={(e) => setForm({ ...form, hari_ke: Number(e.target.value) })}
                      required
                    />
                    <span className="text-[10px] text-emerald-400/80 mt-1 block">Bisa disamakan jika ada 2 jadwal dalam 1 hari.</span>
                  </div>
                  <div>
                    <label className="label">Status</label>
                    <select
                      className="input"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as StatusJadwal })}
                    >
                      <option value="" className="bg-emerald-950 text-white">Jadwal Kosong</option>
                      <option value="terjadwal" className="bg-emerald-950 text-white">Terjadwal</option>
                      <option value="berlangsung" className="bg-emerald-950 text-white">Berlangsung</option>
                      <option value="selesai" className="bg-emerald-950 text-white">Selesai</option>
                      <option value="dibatalkan" className="bg-emerald-950 text-white">Dibatalkan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Tanggal</label>
                    <input
                      type="date"
                      className="input"
                      value={form.tanggal}
                      onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Waktu (Format 24 Jam)</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Contoh: 20:00"
                        maxLength={5}
                        className="input pr-12 font-mono"
                        value={form.waktu}
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^0-9:]/g, '');
                          if (val.length === 2 && !val.includes(':')) {
                            val += ':';
                          }
                          setForm({ ...form, waktu: val });
                        }}
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs font-bold text-emerald-400">
                        WIB
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label">Pengundang</label>
                  <input
                    className="input"
                    value={form.tuan_rumah}
                    onChange={(e) => setForm({ ...form, tuan_rumah: e.target.value })}
                    placeholder="Nama pengundang / lokasi majelis"
                  />
                </div>

                <div>
                  <label className="label">Alamat</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={form.alamat}
                    onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                    placeholder="Alamat lengkap lokasi majelis"
                  />
                </div>

                <div>
                  <label className="label">Catatan (opsional)</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={form.catatan}
                    onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                    placeholder="Catatan tambahan..."
                  />
                </div>

                {error && <p className="rounded-2xl bg-red-950/80 px-4 py-3 text-sm text-red-300 border border-red-800">{error}</p>}

                <div className="flex justify-end gap-3 pt-4 border-t border-emerald-800/80">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                    Batal
                  </button>
                  <button type="submit" disabled={saving} className="btn btn-primary shadow-sm">
                    {saving ? "Menyimpan..." : "Simpan Jadwal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}