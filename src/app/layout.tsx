import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import type { Pengaturan } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Syabab Al-Burdah | Sistem Informasi Penjadwalan Maulid Burdah",
  description:
    "Sistem informasi penjadwalan Maulid Burdah selama 40 hari oleh Syabab Al-Burdah. Lihat jadwal majelis, galeri kegiatan, dan informasi seputar Maulid Burdah.",
};

async function getPengaturan(): Promise<Pengaturan> {
  try {
    const result = await db.execute("SELECT * FROM pengaturan WHERE id = 1");
    return (result.rows[0] as unknown as Pengaturan) || ({} as Pengaturan);
  } catch (error) {
    return {} as Pengaturan;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pengaturan = await getPengaturan();

  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col font-sans text-gray-800 antialiased">
        <Navbar namaGrup={pengaturan?.nama_grup} />
        <main className="flex-1">{children}</main>
        <Footer
          namaGrup={pengaturan?.nama_grup}
          noWhatsapp={pengaturan?.no_whatsapp}
          email={pengaturan?.email}
          instagram={pengaturan?.instagram}
          alamatSekretariat={pengaturan?.alamat_sekretariat}
        />
      </body>
    </html>
  );
}