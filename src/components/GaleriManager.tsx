"use client";

import { useRef, useState } from "react";
import type { Galeri } from "@/lib/types";

export default function GaleriManager({ initialGaleri }: { initialGaleri: Galeri[] }) {
  const [galeri, setGaleri] = useState<Galeri[]>(initialGaleri);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalKegiatan, setTanggalKegiatan] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const file = fileRef.current?.files?.[0];
    if (!judul.trim()) {
      setError("Judul wajib diisi.");
      return;
    }
    if (!file) {
      setError("Pilih gambar terlebih dahulu.");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        setError(uploadData.error || "Gagal mengunggah gambar.");
        setUploading(false);
        return;
      }

      const res = await fetch("/api/galeri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul,
          deskripsi,
          gambar_url: uploadData.url,
          tanggal_kegiatan: tanggalKegiatan || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan data galeri.");
        setUploading(false);
        return;
      }

      setGaleri((prev) => [data.galeri, ...prev]);
      setJudul("");
      setDeskripsi("");
      setTanggalKegiatan("");
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/galeri/${id}`, { method: "DELETE" });
      if (res.ok) setGaleri((prev) => prev.filter((g) => g.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr] text-white">
      
      {/* FORM TAMBAH FOTO */}
      <form onSubmit={handleUpload} className="h-fit space-y-4 rounded-3xl border border-emerald-800/80 bg-[#020a07]/80 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden">
        {/* Aksen Cahaya Sudut */}
        <div className="absolute -left-10 -top-10 h-32 w-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <h3 className="font-display text-lg font-bold text-white border-b border-emerald-800/80 pb-3 relative z-10">
          Tambah Foto
        </h3>

        <div className="relative z-10">
          <label className="label">Gambar</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="block w-full text-xs text-emerald-300/70 file:mr-3 file:rounded-xl file:border-0 file:bg-amber-500/10 file:px-4 file:py-2.5 file:text-xs file:font-bold file:text-amber-400 hover:file:bg-amber-500/20 file:cursor-pointer transition-colors"
          />
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="mt-3 max-h-48 w-full rounded-2xl object-cover border border-emerald-800/80 shadow-md" />
          )}
        </div>

        <div className="relative z-10">
          <label className="label">Judul</label>
          <input 
            className="input" 
            value={judul} 
            onChange={(e) => setJudul(e.target.value)} 
            placeholder="Contoh: Malam Burdah Hari ke-10" 
          />
        </div>

        <div className="relative z-10">
          <label className="label">Tanggal Kegiatan (opsional)</label>
          <input 
            type="date" 
            className="input" 
            value={tanggalKegiatan} 
            onChange={(e) => setTanggalKegiatan(e.target.value)} 
          />
        </div>

        <div className="relative z-10">
          <label className="label">Deskripsi (opsional)</label>
          <textarea 
            className="input" 
            rows={3} 
            value={deskripsi} 
            onChange={(e) => setDeskripsi(e.target.value)} 
            placeholder="Keterangan singkat kegiatan..."
          />
        </div>

        {error && <p className="relative z-10 rounded-2xl bg-red-950/80 px-4 py-3 text-sm text-red-300 border border-red-800 shadow-sm">{error}</p>}

        <button type="submit" disabled={uploading} className="btn btn-primary w-full shadow-lg relative z-10 mt-2">
          {uploading ? "Mengunggah..." : "Unggah ke Galeri"}
        </button>
      </form>

      {/* LIST GALERI */}
      <div>
        {galeri.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-emerald-800/80 bg-[#020a07]/50 p-12 text-center text-emerald-300/70 shadow-inner">
            Belum ada foto. Tambahkan foto pertama Anda di panel sebelah kiri.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {galeri.map((g) => (
              <div key={g.id} className="group overflow-hidden rounded-2xl border border-emerald-800/80 bg-[#020a07]/80 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:border-amber-500/40 transition-all">
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.gambar_url} alt={g.judul} className="h-44 w-full object-cover bg-[#011b15] transition-transform duration-500 group-hover:scale-105" />
                  <div className="p-4 relative bg-[#020a07]/80 z-10">
                    <p className="truncate text-sm font-bold text-white tracking-wide">{g.judul}</p>
                    {g.deskripsi && <p className="mt-1 line-clamp-2 text-xs text-emerald-200/70 leading-relaxed">{g.deskripsi}</p>}
                  </div>
                </div>

                <div className="p-4 pt-0 relative z-10 bg-[#020a07]/80">
                  <button
                    onClick={() => handleDelete(g.id)}
                    disabled={deletingId === g.id}
                    className="btn btn-danger w-full !py-2 text-xs shadow-sm"
                  >
                    {deletingId === g.id ? "Menghapus..." : "Hapus Foto"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}