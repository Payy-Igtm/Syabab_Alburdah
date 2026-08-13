import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

interface AdminRow {
  id: number;
  username: string;
  password_hash: string;
  nama: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password wajib diisi." }, { status: 400 });
    }

    // Diubah dari better-sqlite3 ke Turso (menggunakan async/await & args)
    const result = await db.execute({
      sql: "SELECT * FROM admin WHERE username = ?",
      args: [username],
    });

    const admin = result.rows[0] as unknown as AdminRow | undefined;

    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
    }

    const token = await createSessionToken({ id: admin.id, username: admin.username, nama: admin.nama });

    const res = NextResponse.json({
      ok: true,
      admin: { id: admin.id, username: admin.username, nama: admin.nama },
    });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}