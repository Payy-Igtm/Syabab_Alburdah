import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic"; // <-- WAJIB ADA DI SINI

export async function GET() {
  const result = await db.execute("SELECT * FROM pengaturan WHERE id = 1");
  const pengaturan = result.rows[0];
  return NextResponse.json({ pengaturan });
}

export async function PUT(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });

  const body = await req.json();

  let misi = body.misi;
  if (Array.isArray(misi)) misi = JSON.stringify(misi.filter((m: string) => m && m.trim()));
  else if (typeof misi !== "string") misi = "[]";

  let infoTambahan = body.info_tambahan;
  if (Array.isArray(infoTambahan)) infoTambahan = JSON.stringify(infoTambahan);
  else if (typeof infoTambahan !== "string") infoTambahan = "[]";

  await db.execute({
    sql: `UPDATE pengaturan SET
      nama_grup = ?,
      tagline = ?,
      tentang_burdah = ?,
      asal_usul = ?,
      visi = ?,
      misi = ?,
      tanggal_mulai_program = ?,
      alamat_sekretariat = ?,
      no_whatsapp = ?,
      email = ?,
      instagram = ?,
      facebook = ?,
      info_tambahan = ?,
      updated_at = datetime('now')
     WHERE id = 1`,
    args: [
      body.nama_grup || "Syabab Al-Burdah",
      body.tagline || "",
      body.tentang_burdah || "",
      body.asal_usul || "",
      body.visi || "",
      misi,
      body.tanggal_mulai_program,
      body.alamat_sekretariat || "",
      body.no_whatsapp || "",
      body.email || "",
      body.instagram || "",
      body.facebook || "",
      infoTambahan,
    ],
  });

  const updatedResult = await db.execute("SELECT * FROM pengaturan WHERE id = 1");
  const updated = updatedResult.rows[0];
  return NextResponse.json({ ok: true, pengaturan: updated });
}