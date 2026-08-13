"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Ringkasan", icon: "🏠" },
  { href: "/admin/dashboard/jadwal", label: "Kelola Jadwal", icon: "🗓️" },
  { href: "/admin/dashboard/galeri", label: "Kelola Galeri", icon: "🖼️" },
  { href: "/admin/dashboard/pengaturan", label: "Pengaturan Web", icon: "⚙️" },
];

export default function DashboardShell({
  children,
  adminNama,
}: {
  children: React.ReactNode;
  adminNama: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-[#011b15] pattern-bg text-white">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-emerald-800/80 bg-[#020a07] md:flex z-20 shadow-2xl">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-emerald-800/50 bg-[#011b15]/50">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full ring-2 ring-amber-400/30 bg-[#011b15] shadow-lg shadow-amber-500/10">
            <img src="/logo.jpg" alt="Syabab Al-Burdah" className="h-full w-full object-cover" />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-white tracking-wide">Panel Admin</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Syabab Al-Burdah</p>
          </div>
        </div>
        
        <nav className="mt-4 flex-1 space-y-2 px-4">
          {navItems.map((item) => {
            // Logika agar menu tetap menyala jika berada di sub-halamannya
            const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm font-bold"
                    : "text-emerald-200/70 hover:bg-emerald-900/40 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="border-t border-emerald-800/80 p-5 bg-[#011b15]/30">
          <Link href="/" className="group flex items-center gap-2 text-xs font-semibold text-emerald-400/80 transition-colors hover:text-amber-400">
            <span className="transition-transform group-hover:-translate-x-1">←</span> Lihat situs publik
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col z-10 relative">
        
        {/* HEADER */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-emerald-800/80 bg-emerald-950/80 backdrop-blur-xl px-4 py-4 md:px-8 shadow-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80">Selamat datang,</p>
            <p className="text-sm font-display font-bold text-white tracking-wide mt-0.5">{adminNama}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-semibold text-amber-400 hover:underline md:hidden">
              Situs Publik
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary !py-2 text-xs shadow-sm">
              Keluar
            </button>
          </div>
        </header>

        {/* MOBILE NAVIGATION */}
        <div className="flex gap-2 overflow-x-auto border-b border-emerald-800/80 bg-[#020a07] px-4 py-3 md:hidden scrollbar-none">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-amber-500 text-emerald-950 shadow-md border border-amber-400"
                    : "bg-emerald-900/50 text-emerald-300/80 border border-emerald-800/50 hover:text-white"
                }`}
              >
                <span>{item.icon}</span> 
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* CONTENT */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
        
      </div>
    </div>
  );
}