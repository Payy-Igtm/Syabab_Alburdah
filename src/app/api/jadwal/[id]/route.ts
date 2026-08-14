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

  // Gunakan data dari body secara aman tanpa menimpa status/tuan rumah dengan paksa
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
      Number(body.hari_ke) || Number(existing.hari_ke),
      String(body.tanggal || existing.tanggal),
      body.waktu !== undefined ? body.waktu : existing.waktu,
      body.tuan_rumah !== undefined ? body.tuan_rumah : existing.tuan_rumah,
      body.alamat !== undefined ? body.alamat : existing.alamat,
      body.penanggung_jawab !== undefined ? body.penanggung_jawab : existing.penanggung_jawab,
      body.kontak_pj !== undefined ? body.kontak_pj : existing.kontak_pj,
      body.catatan !== undefined ? body.catatan : existing.catatan,
      body.status !== undefined ? body.status : existing.status,
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