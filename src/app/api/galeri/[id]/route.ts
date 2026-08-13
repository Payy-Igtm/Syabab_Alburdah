import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import fs from "fs";
import path from "path";
import type { Galeri } from "@/lib/types";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });

  const id = Number(params.id);

  // Diubah dari better-sqlite3 ke Turso (async/await dengan args)
  const selectResult = await db.execute({
    sql: "SELECT * FROM galeri WHERE id = ?",
    args: [id],
  });
  const item = selectResult.rows[0] as unknown as Galeri | undefined;

  if (!item) return NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });

  // Diubah dari .run() ke Turso (async/await dengan args)
  await db.execute({
    sql: "DELETE FROM galeri WHERE id = ?",
    args: [id],
  });

  // Hapus file fisik jika berasal dari upload lokal (/uploads/...)
  if (item.gambar_url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", item.gambar_url);
    fs.promises.unlink(filePath).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}