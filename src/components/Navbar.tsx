"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/jadwal", label: "Jadwal 40 Hari" },
  { href: "/galeri", label: "Galeri" },
  { href: "/info", label: "Informasi" },
];

export default function Navbar({ namaGrup }: { namaGrup: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-800/80 bg-emerald-950/95 backdrop-blur supports-[backdrop-filter]:bg-emerald-950/90 text-emerald-100">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        
        {/* Logo & Judul Grup */}
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-amber-400/40 bg-[#04100c]">
            <img src="/logo.jpg" alt={namaGrup} className="h-full w-full object-cover" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-base md:text-lg font-bold text-white truncate max-w-[180px] sm:max-w-xs">{namaGrup}</p>
            <p className="text-[10px] md:text-[11px] tracking-wide text-emerald-300/70">
              Sistem Penjadwalan Maulid Burdah
            </p>
          </div>
        </Link>

        {/* Menu Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30"
                  : "text-emerald-200/80 hover:bg-emerald-900/40 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="ml-2 rounded-xl border border-amber-400/60 bg-amber-500/10 px-3.5 py-2 text-sm font-bold text-amber-400 hover:bg-amber-500/20 transition-all shadow-sm"
          >
            Login Admin
          </Link>
        </div>

        {/* Tombol Hamburger HP (Mobile) */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-xl p-2 text-white hover:bg-emerald-900/50 transition-colors"
            aria-label="Buka menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown Menu Mobile */}
      {open && (
        <div className="border-t border-emerald-800/80 bg-emerald-950 px-4 py-4 md:hidden space-y-2 shadow-xl">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                pathname === l.href 
                  ? "bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30" 
                  : "text-emerald-200/80 hover:bg-emerald-900/40 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-xl border border-amber-400/60 bg-amber-500/10 px-3 py-2.5 text-center text-sm font-bold text-amber-400 shadow-sm"
          >
            Login Admin
          </Link>
        </div>
      )}
    </header>
  );
}