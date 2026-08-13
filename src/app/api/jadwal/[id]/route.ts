import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });

  const id = Number(params.id);
  const existingRes = await db.execute({
    sql: "SELECT * FROM jadwal WHERE id = ?",
    args: [id],
  });
  const existing = existingRes.rows[0];
  if (!existing) return NextResponse.json({ error: "Jadwal tidak ditemukan." }, { status: 404 });

  const body = await req.json();

  await db.execute({
    sql: `UPDATE jadwal SET
      hari_ke = ?,
      tanggal = ?,
      waktu = ?,
      tuan_rumah = ?,
      alamat = ?,
      penanggung_jawab = ?,
      kontak_pj = ?,
      catatan = ?,
      status = ?,
      updated_at = datetime('now')
     WHERE id = ?`,
    args: [
      Number(body.hari_ke),
      String(body.tanggal),
      body.waktu || "20:00",
      body.tuan_rumah || "",
      body.alamat || "",
      body.penanggung_jawab || "",
      body.kontak_pj || "",
      body.catatan || "",
      body.status || "terjadwal",
      id,
    ],
  });

  const updatedRes = await db.execute({
    sql: "SELECT * FROM jadwal WHERE id = ?",
    args: [id],
  });
  const updated = updatedRes.rows[0];
  return NextResponse.json({ ok: true, jadwal: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });

  const id = Number(params.id);
  const existingRes = await db.execute({
    sql: "SELECT * FROM jadwal WHERE id = ?",
    args: [id],
  });
  const existing = existingRes.rows[0];
  if (!existing) return NextResponse.json({ error: "Jadwal tidak ditemukan." }, { status: 404 });

  await db.execute({
    sql: "DELETE FROM jadwal WHERE id = ?",
    args: [id],
  });
  return NextResponse.json({ ok: true });
}