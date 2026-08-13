import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import type { Jadwal } from "@/lib/types";

export async function GET() {
  const result = await db.execute("SELECT * FROM jadwal ORDER BY hari_ke ASC");
  return NextResponse.json({ jadwal: result.rows as unknown as Jadwal[] });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });

  const body = await req.json();
  const hariKe = Number(body.hari_ke);
  const tanggal = String(body.tanggal || "");

  if (!hariKe || hariKe < 1 || hariKe > 365 || !tanggal) {
    return NextResponse.json({ error: "Hari ke- dan tanggal wajib diisi dengan benar." }, { status: 400 });
  }

  const insertResult = await db.execute({
    sql: `INSERT INTO jadwal (hari_ke, tanggal, waktu, tuan_rumah, alamat, penanggung_jawab, kontak_pj, catatan, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      hariKe,
      tanggal,
      body.waktu || "20:00",
      body.tuan_rumah || "",
      body.alamat || "",
      body.penanggung_jawab || "",
      body.kontak_pj || "",
      body.catatan || "",
      body.status || "terjadwal",
    ],
  });

  const insertId = insertResult.lastInsertRowid;

  const createdResult = await db.execute({
    sql: "SELECT * FROM jadwal WHERE id = ?",
    args: [insertId ?? 0],
  });
  const created = createdResult.rows[0];

  return NextResponse.json({ ok: true, jadwal: created }, { status: 201 });
}