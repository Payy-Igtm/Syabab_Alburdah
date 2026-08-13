"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal login.");
        setLoading(false);
        return;
      }
      const redirect = searchParams.get("redirect") || "/admin/dashboard";
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-14">
      <div className="w-full max-w-md rounded-2xl border border-burdah-100 bg-white p-8 shadow-lg">
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full ring-2 ring-gold-400/40">
            <img src="/logo.jpg" alt="Syabab Al-Burdah" className="h-full w-full object-cover" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-burdah-900">Login Admin</h1>
          <p className="mt-1 text-sm text-gray-500">Syabab Al-Burdah &middot; Panel Pengelola Jadwal</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="label">Username</label>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Halaman ini khusus untuk panitia/admin pengelola jadwal. Jamaah tidak perlu login untuk
          melihat jadwal.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
