"use client";

import { useState } from "react";
import type { InfoTambahanItem, Pengaturan } from "@/lib/types";

export default function PengaturanManager({ initial }: { initial: Pengaturan }) {
  const [form, setForm] = useState({
    nama_grup: initial.nama_grup,
    tagline: initial.tagline,
    tentang_burdah: initial.tentang_burdah,
    asal_usul: initial.asal_usul,
    visi: initial.visi,
    tanggal_mulai_program: initial.tanggal_mulai_program,
    alamat_sekretariat: initial.alamat_sekretariat,
    no_whatsapp: initial.no_whatsapp,
    email: initial.email,
    instagram: initial.instagram,
    facebook: initial.facebook,
  });
  const [misi, setMisi] = useState<string[]>(JSON.parse(initial.misi || "[]"));
  const [infoTambahan, setInfoTambahan] = useState<InfoTambahanItem[]>(
    JSON.parse(initial.info_tambahan || "[]")
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [pwLama, setPwLama] = useState("");
  const [pwBaru, setPwBaru] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");

  function updateMisi(i: number, value: string) {
    setMisi((prev) => prev.map((m, idx) => (idx === i ? value : m)));
  }
  function addMisi() {
    setMisi((prev) => [...prev, ""]);
  }
  function removeMisi(i: number) {
    setMisi((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateInfo(i: number, key: keyof InfoTambahanItem, value: string) {
    setInfoTambahan((prev) => prev.map((it, idx) => (idx === i ? { ...it, [key]: value } : it)));
  }
  function addInfo() {
    setInfoTambahan((prev) => [...prev, { judul: "", isi: "" }]);
  }
  function removeInfo(i: number) {
    setInfoTambahan((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/pengaturan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          misi,
          info_tambahan: infoTambahan,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan pengaturan.");
      } else {
        setMessage("Perubahan berhasil disimpan.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwSaving(true);
    setPwMsg("");
    setPwErr("");
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password_lama: pwLama, password_baru: pwBaru }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwErr(data.error || "Gagal mengganti password.");
      } else {
        setPwMsg("Password berhasil diganti.");
        setPwLama("");
        setPwBaru("");
      }
    } catch {
      setPwErr("Terjadi kesalahan jaringan.");
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <div className="space-y-8 text-emerald-100 w-full">
      
      {/* FORM PENGATURAN UTAMA */}
      <form onSubmit={handleSave} className="space-y-6 rounded-3xl border border-emerald-800/80 bg-emerald-950/40 p-8 shadow-xl backdrop-blur-md">
        <h3 className="font-display text-xl font-bold text-white border-b border-emerald-800/80 pb-3">Informasi &amp; Profil Program</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Nama Grup</label>
            <input className="input" value={form.nama_grup} onChange={(e) => setForm({ ...form, nama_grup: e.target.value })} />
          </div>
          <div>
            <label className="label">Tanggal Mulai Program (Hari ke-1)</label>
            <input
              type="date"
              className="input"
              value={form.tanggal_mulai_program}
              onChange={(e) => setForm({ ...form, tanggal_mulai_program: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label">Tagline</label>
          <input className="input" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
        </div>

        <div>
          <label className="label">Apa itu Maulid Burdah?</label>
          <textarea
            className="input"
            rows={4}
            value={form.tentang_burdah}
            onChange={(e) => setForm({ ...form, tentang_burdah: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Asal Usul</label>
          <textarea
            className="input"
            rows={5}
            value={form.asal_usul}
            onChange={(e) => setForm({ ...form, asal_usul: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Visi</label>
          <textarea className="input" rows={3} value={form.visi} onChange={(e) => setForm({ ...form, visi: e.target.value })} />
        </div>

        {/* MISI */}
        <div>
          <label className="label">Misi</label>
          <div className="space-y-3">
            {misi.map((m, i) => (
              <div key={i} className="flex gap-2">
                <input className="input" value={m} onChange={(e) => updateMisi(i, e.target.value)} />
                <button type="button" onClick={() => removeMisi(i)} className="btn btn-danger !px-3.5 shrink-0">
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addMisi} className="btn btn-secondary mt-3 text-xs">
            + Tambah Poin Misi
          </button>
        </div>

        {/* INFORMASI TAMBAHAN */}
        <div>
          <label className="label">Informasi Tambahan (Halaman Info)</label>
          <div className="space-y-3">
            {infoTambahan.map((item, i) => (
              <div key={i} className="rounded-2xl border border-emerald-800/80 bg-[#011b15] p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <input
                    className="input"
                    placeholder="Judul info"
                    value={item.judul}
                    onChange={(e) => updateInfo(i, "judul", e.target.value)}
                  />
                  <button type="button" onClick={() => removeInfo(i)} className="btn btn-danger !px-3.5 shrink-0">
                    ✕
                  </button>
                </div>
                <textarea
                  className="input"
                  rows={2}
                  placeholder="Isi informasi"
                  value={item.isi}
                  onChange={(e) => updateInfo(i, "isi", e.target.value)}
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={addInfo} className="btn btn-secondary mt-3 text-xs">
            + Tambah Info
          </button>
        </div>

        {/* KONTAK & SEKRETARIAT */}
        <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-emerald-800/80">
          <div>
            <label className="label">Alamat Sekretariat</label>
            <input
              className="input"
              value={form.alamat_sekretariat}
              onChange={(e) => setForm({ ...form, alamat_sekretariat: e.target.value })}
            />
          </div>
          <div>
            <label className="label">No. WhatsApp</label>
            <input className="input" value={form.no_whatsapp} onChange={(e) => setForm({ ...form, no_whatsapp: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Instagram</label>
            <input className="input" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          </div>
          <div>
            <label className="label">Facebook</label>
            <input className="input" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
          </div>
        </div>

        {message && <p className="rounded-2xl bg-emerald-950/80 px-4 py-3 text-sm text-emerald-300 border border-emerald-800">{message}</p>}
        {error && <p className="rounded-2xl bg-red-950/80 px-4 py-3 text-sm text-red-300 border border-red-800">{error}</p>}

        <button type="submit" disabled={saving} className="btn btn-primary px-8 py-3 shadow-md">
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>

      {/* FORM GANTI PASSWORD */}
      <form onSubmit={handleChangePassword} className="space-y-4 rounded-3xl border border-emerald-800/80 bg-emerald-950/40 p-8 shadow-xl backdrop-blur-md">
        <h3 className="font-display text-lg font-bold text-white border-b border-emerald-800/80 pb-3">Ganti Password Admin</h3>
        
        <div>
          <label className="label">Password Lama</label>
          <input type="password" className="input" value={pwLama} onChange={(e) => setPwLama(e.target.value)} required />
        </div>
        
        <div>
          <label className="label">Password Baru</label>
          <input type="password" className="input" value={pwBaru} onChange={(e) => setPwBaru(e.target.value)} required minLength={6} />
        </div>

        {pwMsg && <p className="rounded-2xl bg-emerald-950/80 px-4 py-3 text-sm text-emerald-300 border border-emerald-800">{pwMsg}</p>}
        {pwErr && <p className="rounded-2xl bg-red-950/80 px-4 py-3 text-sm text-red-300 border border-red-800">{pwErr}</p>}

        <button type="submit" disabled={pwSaving} className="btn btn-primary shadow-sm">
          {pwSaving ? "Menyimpan..." : "Ganti Password"}
        </button>
      </form>
    </div>
  );
}