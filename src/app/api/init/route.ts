import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db";

export async function GET() {
  try {
    await initializeDatabase();
    return NextResponse.json({ 
      ok: true, 
      message: "Yeay! Tabel dan data awal berhasil dimasukkan ke Turso!" 
    });
  } catch (error) {
    console.error("Error inisialisasi:", error);
    return NextResponse.json({ error: "Gagal membuat tabel database. Cek terminal VS Code untuk detailnya." }, { status: 500 });
  }
}