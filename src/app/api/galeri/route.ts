import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const result = await db.execute("SELECT * FROM galeri ORDER BY created_at DESC");
  return NextResponse.json({ galeri: result.rows });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });

  const body = await req.json();
  const judul = String(body.judul || "").trim();
  const gambarUrl = String(body.gambar_url || "").trim();

  if (!judul || !gambarUrl) {
    return NextResponse.json({ error: "Judul dan gambar wajib diisi." }, { status: 400 });
  }

  // Melakukan INSERT dengan Turso (menggunakan args array)
  const insertResult = await db.execute({
    sql: `INSERT INTO galeri (judul, deskripsi, gambar_url, tanggal_kegiatan) VALUES (?, ?, ?, ?)`,
    args: [
      judul,
      body.deskripsi || "",
      gambarUrl,
      body.tanggal_kegiatan || null,
    ],
  });

  // Mengambil ID baris yang baru saja dimasukkan
  const insertId = insertResult.lastInsertRowid;

  // Mengambil data galeri yang baru dibuat untuk dikembalikan sebagai respons
  const createdResult = await db.execute({
    sql: "SELECT * FROM galeri WHERE id = ?",
    args: [insertId ?? 0],
  });
  const created = createdResult.rows[0];

  return NextResponse.json({ ok: true, galeri: created }, { status: 201 });
}