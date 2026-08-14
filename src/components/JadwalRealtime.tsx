"use client";

import { useEffect, useMemo, useState } from "react";
import type { Jadwal } from "@/lib/types";

const statusLabel: Record<string, string> = {
  terjadwal: "Terjadwal",
  berlangsung: "Berlangsung",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

function formatTanggalPanjang(tgl: string) {
  return new Date(tgl).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function JadwalRealtime({ initialJadwal }: { initialJadwal: Jadwal[] }) {
  const [jadwal, setJadwal] = useState<Jadwal[]>(initialJadwal);
  const [now, setNow] = useState<Date>(new Date());
  const [view, setView] = useState<"timeline" | "daftar">("timeline");
  const [filter, setFilter] = useState<"semua" | "terisi" | "kosong">("semua");
  
  const [selectedHari, setSelectedHari] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch("/api/jadwal", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setJadwal(data.jadwal);
        }
      } catch {
        /* diamkan */
      }
    }, 30000);
    return () => clearInterval(poll);
  }, []);

  const todayStr = now.toISOString().slice(0, 10);
  const sorted = useMemo(() => [...jadwal].sort((a, b) => a.hari_ke - b.hari_ke), [jadwal]);

  const filteredJadwal = useMemo(() => {
    return sorted.filter((j) => {
      const isKosong = !j.tuan_rumah || (j.status as string) === "";
      if (filter === "terisi") return !isKosong;
      if (filter === "kosong") return isKosong;
      return true;
    });
  }, [sorted, filter]);

  const uniqueDays = useMemo(() => {
    const daysMap = new Map<number, { hari: number; isToday: boolean; isKosong: boolean }>();
    
    filteredJadwal.forEach((j) => {
      const isKosong = !j.tuan_rumah || (j.status as string) === "";
      const isToday = j.tanggal === todayStr;

      if (!daysMap.has(j.hari_ke)) {
        daysMap.set(j.hari_ke, { hari: j.hari_ke, isToday, isKosong });
      } else {
        const existing = daysMap.get(j.hari_ke)!;
        daysMap.set(j.hari_ke, {
          hari: j.hari_ke,
          isToday: existing.isToday || isToday,
          isKosong: existing.isKosong && isKosong,
        });
      }
    });
    return Array.from(daysMap.values()).sort((a, b) => a.hari - b.hari);
  }, [filteredJadwal, todayStr]);

  const hariIniItem = sorted.find((j) => j.tanggal === todayStr);
  const berikutnya = sorted.find((j) => j.tanggal > todayStr && j.status !== "dibatalkan" && j.tuan_rumah);

  const activeHari = selectedHari !== null 
    ? selectedHari 
    : hariIniItem 
      ? hariIniItem.hari_ke 
      : uniqueDays.length > 0 
        ? uniqueDays[0].hari 
        : null;

  const schedulesForDay = useMemo(() => {
    return sorted.filter((j) => j.hari_ke === activeHari);
  }, [sorted, activeHari]);

  const countdown = useMemo(() => {
    if (!berikutnya || !berikutnya.waktu) return null;
    const target = new Date(`${berikutnya.tanggal}T${berikutnya.waktu}:00`);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return null;
    return {
      hari: Math.floor(diff / (1000 * 60 * 60 * 24)),
      jam: Math.floor((diff / (1000 * 60 * 60)) % 24),
      menit: Math.floor((diff / (1000 * 60)) % 60),
      detik: Math.floor((diff / 1000) % 60),
    };
  }, [berikutnya, now]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6 text-white">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-3xl border border-emerald-800/80 bg-emerald-950/40 p-6 shadow-xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Waktu Sekarang</p>
            </div>
            <p className="mt-2 font-display text-2xl font-bold tracking-tight tabular-nums text-white">
              {now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
            <p className="text-xs text-emerald-300/70 mt-1">
              {now.toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {hariIniItem && hariIniItem.tuan_rumah ? (
          <div className="rounded-3xl border border-amber-500/30 bg-emerald-950/40 p-6 shadow-xl flex flex-col justify-center">
            <span className="badge badge-berlangsung mb-3 w-fit">Hari ke-{hariIniItem.hari_ke} &middot; Hari Ini</span>
            <p className="font-display text-base font-bold text-white truncate">
              {hariIniItem.tuan_rumah}
            </p>
            <p className="text-xs text-amber-400 font-semibold mt-1">
              {hariIniItem.waktu ? `Pukul ${hariIniItem.waktu} WIB` : "-"}
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-emerald-800/80 bg-emerald-950/40 p-6 text-center shadow-xl flex flex-col justify-center">
            <p className="font-bold text-white text-sm">Tidak ada majelis hari ini</p>
            <p className="text-xs text-emerald-300/70 mt-1">Jadwal hari ini belum diatur atau kosong.</p>
          </div>
        )}
      </div>

      {berikutnya && countdown && (
        <div className="rounded-2xl border border-emerald-800/80 bg-emerald-950/40 p-4 px-6 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-emerald-100/90 font-medium">
            ✨ Menuju Hari ke-<strong className="text-amber-400 font-bold">{berikutnya.hari_ke}</strong> ({berikutnya.tuan_rumah})
          </span>
          <div className="flex items-center gap-1.5 font-mono font-bold text-amber-300 bg-amber-500/10 px-3.5 py-1.5 rounded-xl border border-amber-500/20">
            <span>{countdown.hari}h</span> : 
            <span>{String(countdown.jam).padStart(2, "0")}j</span> : 
            <span>{String(countdown.menit).padStart(2, "0")}m</span> : 
            <span>{String(countdown.detik).padStart(2, "0")}d</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 bg-emerald-950/40 border border-emerald-800/80 p-5 rounded-3xl shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-white">Perjalanan 40 Hari</h2>
          <p className="text-xs text-emerald-300/70 mt-0.5">Pilih hari untuk melihat detail lokasi majelis.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-full border border-emerald-800/80 bg-[#011b15] p-1">
            {(["semua", "terisi", "kosong"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition-all ${
                  filter === f ? "bg-amber-500 text-[#011b15] shadow-sm" : "text-emerald-300/70 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex rounded-full border border-emerald-800/80 bg-[#011b15] p-1">
            {(["timeline", "daftar"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition-all ${
                  view === v ? "bg-amber-500 text-[#011b15] shadow-sm" : "text-emerald-300/70 hover:text-white"
                }`}
              >
                {v === "timeline" ? "Timeline" : "Tabel"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "timeline" ? (
        <div className="space-y-6">
          <div className="bg-emerald-950/40 border border-emerald-800/80 p-5 rounded-3xl shadow-xl">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/70 mb-3">Pilih Hari (1 - 40)</p>
            <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-none">
              {uniqueDays.map((dayObj) => {
                const isSelected = activeHari === dayObj.hari;
                const { isToday, isKosong } = dayObj;

                return (
                  <button
                    key={dayObj.hari}
                    onClick={() => setSelectedHari(dayObj.hari)}
                    className={`flex flex-col items-center justify-center shrink-0 min-w-[62px] py-3 px-2 rounded-2xl font-bold transition-all duration-200 relative ${
                      isSelected
                        ? "bg-amber-500 text-[#011b15] shadow-lg ring-2 ring-amber-400 scale-105 z-10 font-black"
                        : isToday
                        ? "bg-amber-400 text-[#011b15] shadow-md border border-amber-300"
                        : isKosong
                        ? "bg-[#011b15] text-emerald-300/70 border border-emerald-800/80 hover:border-amber-500/50 hover:text-white"
                        : "bg-emerald-900/60 text-amber-400 border border-emerald-700/60 shadow-sm hover:bg-emerald-900"
                    }`}
                  >
                    <span className="text-[8px] uppercase tracking-wider opacity-75">Hari</span>
                    <span className="text-sm font-display mt-0.5">{dayObj.hari}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {filteredJadwal.length === 0 && (
            <div className="rounded-3xl border border-dashed border-emerald-800/80 bg-emerald-950/40 p-12 text-center text-emerald-300/70 text-sm">
              Tidak ada jadwal yang sesuai dengan filter.
            </div>
          )}

          {activeHari !== null && schedulesForDay.length > 0 && (() => {
            const firstSchedule = schedulesForDay[0];
            const allKosong = schedulesForDay.every((j) => !j.tuan_rumah || (j.status as string) === "");
            const isPast = firstSchedule.tanggal < todayStr || firstSchedule.status === "selesai";

            const validSessions = schedulesForDay.filter(s => s.tuan_rumah);
            const sessionsToDisplay = validSessions.length > 0 ? validSessions : [firstSchedule];

            return (
              <div className="overflow-hidden rounded-3xl border border-emerald-800/80 bg-emerald-950/40 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800/80 bg-[#011b15] px-6 py-5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      Spotlight Jadwal
                    </span>
                    <h3 className="font-display text-lg font-bold text-white mt-2">
                      Hari ke-{activeHari} &middot; <span className="text-amber-400 font-medium text-sm">{formatTanggalPanjang(firstSchedule.tanggal)}</span>
                    </h3>
                  </div>
                  <span
                    className={`badge px-4 py-1.5 text-xs font-bold rounded-full ${
                      allKosong
                        ? "bg-emerald-900/50 text-emerald-300 border border-emerald-800/80"
                        : firstSchedule.tanggal === todayStr
                        ? "badge-berlangsung"
                        : isPast
                        ? "badge-selesai"
                        : "badge-terjadwal"
                    }`}
                  >
                    {allKosong
                      ? "Jadwal Kosong"
                      : validSessions.length > 1
                      ? `${validSessions.length} Sesi Terjadwal`
                      : (statusLabel[firstSchedule.status] || firstSchedule.status)}
                  </span>
                </div>

                <div className="p-6 md:p-8 space-y-10">
                  {allKosong ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-2xl text-amber-400 border border-amber-500/20">
                        🗓️
                      </div>
                      <p className="text-base font-bold text-white">Jadwal Masih Kosong</p>
                      <p className="mt-1 text-xs text-emerald-300/70 max-w-sm leading-relaxed">
                        Belum ada informasi majelis yang didaftarkan oleh Admin untuk hari ke-{activeHari}.
                      </p>
                      
                      {/* DISCLAIMER TAMBAHAN */}
                      <div className="mt-5 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-200 max-w-sm leading-relaxed text-left">
                        <span className="font-bold block mb-1 text-amber-400">✨ Catatan Penting:</span>
                        Jika jadwal kosong, maka pelaksanaan Maulid Burdah tetap dilaksanakan secara mandiri oleh Tim Syabab Al-Burdah dimasjid jami Adz-Dzikro Cibarengkok.
                      </div>
                    </div>
                  ) : (
                    sessionsToDisplay.map((session, index) => (
                      <div key={session.id} className={`relative ${index > 0 ? "pt-8 border-t border-emerald-800/50" : ""}`}>
                        {validSessions.length > 1 && (
                          <div className="mb-5 flex items-center gap-2">
                            <span className="bg-amber-500 text-[#011b15] font-bold px-3 py-1 rounded text-[10px] uppercase tracking-widest">Sesi {index + 1}</span>
                            <span className="text-[10px] text-emerald-300/80 uppercase font-bold tracking-widest">{statusLabel[session.status] || session.status}</span>
                          </div>
                        )}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <InfoCard 
                              icon="⏰" 
                              label="Waktu Pelaksanaan" 
                              value={session.tuan_rumah && session.waktu ? `Pukul ${session.waktu} WIB` : "-"} 
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <InfoCard 
                              icon="🏡" 
                              label="Pengundang / Lokasi Majelis" 
                              value={session.tuan_rumah || "-"} 
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <InfoCard 
                              icon="📍" 
                              label="Alamat Lengkap" 
                              value={session.alamat || "-"} 
                            />
                          </div>
                          
                          {session.catatan && (
                            <div className="sm:col-span-2 mt-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-200">
                              <span className="font-bold block mb-1 text-amber-400">📝 Catatan Admin:</span> {session.catatan}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-emerald-800/80 bg-emerald-950/40 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-emerald-100">
              <thead className="bg-[#011b15] text-xs uppercase tracking-wider text-emerald-300/70 border-b border-emerald-800/80">
                <tr>
                  <th className="px-6 py-4">Hari</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Pengundang</th>
                  <th className="px-6 py-4">Alamat</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/60">
                {filteredJadwal.map((j) => {
                  const isKosong = !j.tuan_rumah || (j.status as string) === "";
                  return (
                    <tr
                      key={j.id}
                      className={`transition-colors hover:bg-emerald-900/30 ${j.tanggal === todayStr ? "bg-amber-500/10" : ""}`}
                    >
                      <td className="px-6 py-4 font-bold text-white">Ke-{j.hari_ke}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-emerald-300/70 text-xs">
                        {new Date(j.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 text-emerald-200 font-medium text-xs">
                        {j.tuan_rumah && j.waktu ? `${j.waktu} WIB` : <span className="text-emerald-700">-</span>}
                      </td>
                      <td className="px-6 py-4 text-white font-semibold">{j.tuan_rumah || <span className="text-emerald-700 font-normal">-</span>}</td>
                      <td className="px-6 py-4 text-emerald-300/70 max-w-[200px] truncate text-xs">{j.alamat || <span className="text-emerald-700">-</span>}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`badge px-3 py-1 text-[11px] font-semibold ${
                            isKosong
                              ? "bg-emerald-900/50 text-emerald-300 border border-emerald-800/80"
                              : j.tanggal === todayStr
                              ? "badge-berlangsung"
                              : j.status === "selesai" || j.tanggal < todayStr
                              ? "badge-selesai"
                              : j.status === "dibatalkan"
                              ? "badge-dibatalkan"
                              : "badge-terjadwal"
                          }`}
                        >
                          {isKosong ? "Jadwal Kosong" : (statusLabel[j.status] || j.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#011b15] border border-emerald-800/80 p-4">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-300/70">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <p className="mt-1.5 text-sm font-semibold text-white leading-relaxed">{value}</p>
    </div>
  );
}