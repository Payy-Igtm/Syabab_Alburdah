import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });

  const body = await req.json();
  const { password_lama, password_baru } = body as { password_lama?: string; password_baru?: string };

  if (!password_lama || !password_baru) {
    return NextResponse.json({ error: "Password lama dan baru wajib diisi." }, { status: 400 });
  }
  if (password_baru.length < 6) {
    return NextResponse.json({ error: "Password baru minimal 6 karakter." }, { status: 400 });
  }

  // Diubah dari better-sqlite3 ke Turso (async/await dengan args)
  const result = await db.execute({
    sql: "SELECT * FROM admin WHERE id = ?",
    args: [admin.id],
  });
  
  // BAGIAN YANG DIPERBAIKI: Menambahkan "unknown" sebagai jembatan tipe data
  const row = result.rows[0] as unknown as
    | { id: number; password_hash: string }
    | undefined;

  if (!row || !bcrypt.compareSync(password_lama, row.password_hash)) {
    return NextResponse.json({ error: "Password lama tidak sesuai." }, { status: 401 });
  }

  const newHash = bcrypt.hashSync(password_baru, 10);
  
  // Diubah dari .run() ke Turso (async/await dengan args)
  await db.execute({
    sql: "UPDATE admin SET password_hash = ? WHERE id = ?",
    args: [newHash, admin.id],
  });

  return NextResponse.json({ ok: true });
}